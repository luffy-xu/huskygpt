import { IReadFileResult } from '../types';
import WebhookNotifier from '../webhook';
import HuskyGPTBase from './base';

/**
 * Review code for a given file path
 */
class HuskyGPTReview extends HuskyGPTBase {
  private publishChannel: WebhookNotifier;

  constructor() {
    super();
    this.publishChannel = new WebhookNotifier();
  }

  /**
   * Write a test message to a file
   */
  private async postAIMessage(
    filePath: string,
    message: string,
  ): Promise<void> {
    this.publishChannel.addNoticeTask({ filePath, message });
  }

  /**
   * Generate a test case for a given file
   */
  public async run(fileResult: IReadFileResult): Promise<void> {
    const message = await this.openai.run(fileResult);

    this.postAIMessage(fileResult.filePath!, message.join('\n\n---\n\n'));
  }

  /**
   * Publish the notices to the webhook channel
   */
  public publishNotice(): void {
    this.publishChannel.publishNotice();
  }
}

export default HuskyGPTReview;
