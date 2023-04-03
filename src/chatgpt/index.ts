import chalk from 'chalk';
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI, ChatMessage } from 'chatgpt';
import ora from 'ora';
import { HuskyGPTPrompt, PERFECT_KEYWORDS } from 'src/prompt';

import { userOptions } from '../constant';
import { HuskyGPTTypeEnum, IReadFileResult } from '../types';

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
    return message.split('\n').includes(PERFECT_KEYWORDS);
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
    prevMessage: Partial<ChatMessage> = {},
  ): Promise<ChatMessage> {
    const reviewSpinner = this.oraStart();
    const res = await this.api.sendMessage(prompt, {
      ...prevMessage,
      onProgress: (partialResponse) => {
        reviewSpinner.text = partialResponse.text;
      },
    });

    const isReviewPassed = this.isReviewPassed(res.text);
    const colorText = isReviewPassed
      ? chalk.green(res.text)
      : chalk.yellow(res.text);
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
    let message: ChatMessage;

    for (const prompt of promptArray) {
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
