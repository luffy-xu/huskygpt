import { AbortController } from 'abort-controller';
import chalk from 'chalk';
import {
  ChatGPTAPI,
  ChatGPTUnofficialProxyAPI,
  ChatMessage,
  SendMessageOptions,
} from 'chatgpt';
import ora from 'ora';
import { HuskyGPTPrompt } from 'src/chatgpt/prompt';
import {
  OPENAI_MAX_RETRY,
  codeBlocksMdSymbolRegex,
  userOptions,
} from 'src/constant';
import { HuskyGPTTypeEnum, IReadFileResult } from 'src/types';

export class ChatgptProxyAPI {
  private api: ChatGPTUnofficialProxyAPI | ChatGPTAPI;
  private parentMessage?: ChatMessage;

  constructor() {
    this.initApi();
  }

  get needPrintMessage(): boolean {
    return [HuskyGPTTypeEnum.Review, HuskyGPTTypeEnum.Test].includes(
      userOptions.huskyGPTType,
    );
  }

  private initApi() {
    if (process.env.DEBUG)
      console.log(`openAI session token: {${userOptions.openAISessionToken}}`);

    console.log(
      '[huskygpt] Using Model:',
      chalk.green(userOptions.openAIModel),
    );
    // Use the official api if the session token is not set
    if (!userOptions.openAISendByProxy) {
      this.api = new ChatGPTAPI({
        apiKey: userOptions.openAIKey,
        completionParams: userOptions.openAIOptions,
        debug: userOptions.options.debug,
      });
      return;
    }

    // Use the proxy api
    this.api = new ChatGPTUnofficialProxyAPI({
      model: userOptions.openAIModel,
      accessToken: userOptions.openAISessionToken,
      apiReverseProxyUrl: userOptions.options.openAIProxyUrl,
    });
  }

  /**
   * Generate prompt for the OpenAI API
   */
  private generatePrompt(fileResult: IReadFileResult): string[] {
    // Set the file content as the prompt for the API request
    const huskyGPTType = new HuskyGPTPrompt(userOptions.huskyGPTType);

    return huskyGPTType.generatePrompt(fileResult);
  }

  /**
   * Is the review passed?
   */
  private isReviewPassed(message: string): boolean {
    if (userOptions.huskyGPTType !== HuskyGPTTypeEnum.Review) return true;
    return /perfect!/gi.test(message);
  }

  /**
   * Log the review info
   */
  private oraStart(
    text = '',
    needPrintMessage = this.needPrintMessage,
  ): ora.Ora {
    if (!needPrintMessage) return ora();

    return ora({
      text,
      spinner: {
        interval: 800,
        frames: ['🚀', '🤖', '🚀', '🤖', '🚀', '🤖', '🚀', '🤖'],
      },
    }).start();
  }

  /**
   * Run the OpenAI API
   */

  // Helper function to perform the API call with retries, handling specific status codes
  private async sendMessageWithRetry(
    message: string,
    options?: SendMessageOptions,
    retries = OPENAI_MAX_RETRY,
    retryDelay = 3000,
  ): Promise<ChatMessage> {
    for (let retry = 0; retry < retries; retry++) {
      try {
        return await this.api.sendMessage(message, options);
      } catch (error) {
        if (error.statusCode === 401) {
          // If statusCode is 401, do not retry
          throw error;
        } else if (error.statusCode === 429) {
          // If statusCode is 429, sleep for retryDelay milliseconds then try again
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          // If not a specified status code, and we've reached the maximum number of retries, throw the error
          if (retry === retries) {
            throw error;
          }
          console.log(
            `[huskygpt] sendMessage failed, retrying... (${
              retry + 1
            }/${retries})`,
          );
        }
      }
    }
    throw new Error('sendMessage failed after retries');
  }

  // Handle continue message if needed
  private async handleContinueMessage(
    message: ChatMessage,
    sendOptions: SendMessageOptions,
    maxContinueAttempts = 5,
  ): Promise<ChatMessage> {
    let resMessage = message;
    let continueAttempts = 0;

    while (
      (resMessage.text.match(codeBlocksMdSymbolRegex) || []).length % 2 === 1 &&
      continueAttempts < maxContinueAttempts
    ) {
      const continueMessage = 'continue';
      const nextMessage = await this.sendMessageWithRetry(
        continueMessage,
        sendOptions,
      );

      resMessage = {
        ...resMessage,
        ...nextMessage,
        text: `${resMessage.text}${nextMessage.text}`,
      };

      continueAttempts++;
    }

    return resMessage;
  }

  // Send the prompt to the API
  private async sendPrompt(
    prompt: string,
    prevMessage?: Partial<ChatMessage>,
  ): Promise<ChatMessage> {
    const securityPrompt = userOptions.securityPrompt(prompt);

    // If this is the first message, send it directly
    if (!prevMessage) {
      return await this.sendMessageWithRetry(securityPrompt);
    }

    // Send the message with the progress callback
    const reviewSpinner = this.oraStart();
    const controller = new AbortController();
    const signal = controller.signal;
    const sendOptions: SendMessageOptions = {
      ...prevMessage,
      // Set the timeout to 5 minutes
      timeoutMs: 1000 * 60 * 5,
      // @ts-ignore
      abortSignal: signal,
      onProgress: (partialResponse) => {
        reviewSpinner.text = partialResponse.text;
      },
    };

    try {
      let resMessage = await this.sendMessageWithRetry(
        securityPrompt,
        sendOptions,
      );

      // Handle continue message logic
      resMessage = await this.handleContinueMessage(resMessage, {
        ...sendOptions,
        conversationId: resMessage.conversationId,
        parentMessageId: resMessage.id,
      } as SendMessageOptions);

      // Check if the review is passed
      const isReviewPassed = this.isReviewPassed(resMessage.text);
      const colorText = isReviewPassed
        ? chalk.green(resMessage.text)
        : chalk.yellow(resMessage.text);

      // Stop the spinner
      reviewSpinner[isReviewPassed ? 'succeed' : 'fail'](
        `[huskygpt] ${colorText} \n `,
      );

      return resMessage;
    } catch (error) {
      // Stop the spinner
      reviewSpinner.fail(`[huskygpt] ${error.message} \n `);
      controller.abort();
      throw error;
    }
  }

  /**
   * Generate a prompt for a given file, then send it to the OpenAI API
   */
  async sendFileResult(fileResult: IReadFileResult): Promise<string[]> {
    const promptArray = this.generatePrompt(fileResult);
    const [systemPrompt, ...codePrompts] = promptArray;
    if (!codePrompts.length) return [];

    const messageArray: string[] = [];
    let message = this.parentMessage || (await this.sendPrompt(systemPrompt));

    for (const prompt of codePrompts) {
      message = await this.sendPrompt(prompt, {
        conversationId: message?.conversationId,
        parentMessageId: message?.id,
      });
      messageArray.push(message.text);

      this.parentMessage = message;
    }

    return messageArray;
  }

  /**
   * Reset the parent message
   */
  public resetParentMessage() {
    this.parentMessage = undefined;
  }

  /**
   * Start the huskygpt process
   */
  async run(fileResult: IReadFileResult): Promise<string[]> {
    const reviewSpinner = this.oraStart(
      chalk.cyan(
        `[huskygpt] start ${userOptions.huskyGPTType} your code... \n`,
      ),
    );

    return this.sendFileResult(fileResult)
      .then((res) => {
        reviewSpinner.succeed(
          chalk.green(
            `🎉🎉 [huskygpt] ${userOptions.huskyGPTType} code successfully! 🎉🎉\n `,
          ),
        );
        return res;
      })
      .catch((error) => {
        console.error('run error:', error);
        reviewSpinner.fail(
          chalk.red(
            `🤔🤔 [huskygpt] ${userOptions.huskyGPTType} your code failed! 🤔🤔\n`,
          ),
        );
        return ['[huskygpt] call OpenAI API failed!'];
      })
      .finally(() => {
        reviewSpinner.stop();
      });
  }
}
