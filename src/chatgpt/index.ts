import { AbortController } from 'abort-controller';
import chalk from 'chalk';
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI, ChatMessage } from 'chatgpt';
import ora from 'ora';
import { userOptions } from 'src/constant';
import { HuskyGPTPrompt } from 'src/huskygpt/prompt';
import { HuskyGPTTypeEnum, IReadFileResult } from 'src/types';

export class ChatgptProxyAPI {
  private api: ChatGPTUnofficialProxyAPI | ChatGPTAPI;

  constructor() {
    this.initApi();
  }

  private initApi() {
    // Use the official api if the session token is not set
    if (
      !userOptions.openAISessionToken ||
      userOptions.openAISessionToken === 'undefined'
    ) {
      this.api = new ChatGPTAPI({
        apiKey: userOptions.openAIKey,
        completionParams: userOptions.openAIOptions,
        debug: userOptions.options.debug,
      });
      return;
    }

    // Use the proxy api
    this.api = new ChatGPTUnofficialProxyAPI({
      model: userOptions.options.openAIModel,
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
  private oraStart(text = ''): ora.Ora {
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
  private async sendMessage(
    prompt: string,
    prevMessage?: Partial<ChatMessage>,
  ): Promise<ChatMessage> {
    // If this is the first message, send it directly
    if (!prevMessage) {
      return await this.api.sendMessage(prompt);
    }

    // Send the message with the progress callback
    const reviewSpinner = this.oraStart();
    const controller = new AbortController();
    const signal = controller.signal;

    const res = await this.api.sendMessage(prompt, {
      ...prevMessage,
      // Set the timeout to 5 minutes
      timeoutMs: 1000 * 60 * 5,
      // @ts-ignore
      abortSignal: signal,
      onProgress: (partialResponse) => {
        reviewSpinner.text = partialResponse.text;
      },
    });

    // Check if the review is passed
    const isReviewPassed = this.isReviewPassed(res.text);
    const colorText = isReviewPassed
      ? chalk.green(res.text)
      : chalk.yellow(res.text);

    // Stop the spinner
    reviewSpinner[isReviewPassed ? 'succeed' : 'fail'](
      `[huskygpt] ${colorText} \n `,
    );

    return res;
  }

  /**
   * Generate a prompt for a given file, then send it to the OpenAI API
   */
  async sendFileResult(fileResult: IReadFileResult): Promise<string[]> {
    const promptArray = this.generatePrompt(fileResult);
    const messageArray: string[] = [];
    const [systemPrompt, ...codePrompts] = promptArray;
    let message = await this.sendMessage(systemPrompt);

    for (const prompt of codePrompts) {
      message = await this.sendMessage(prompt, {
        conversationId: message?.conversationId,
        parentMessageId: message?.id,
      });
      messageArray.push(message.text);
    }

    return messageArray;
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
      });
  }
}
