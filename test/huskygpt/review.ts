import OpenAIFactory from '../openai';
import WebhookNotifier from './webhook';

/**
 * Generate a test case for a given file path
 * using the OpenAI API
 * Usage: new TestGenerator().generateTestCase({ filePath: 'path/to/file' });
 */
class HuskyGPTReview {
  private openai: OpenAIFactory;
  private publishChannel: WebhookNotifier;

  constructor() {
    // Create a new OpenAI API client
    this.openai = new OpenAIFactory();

    this.publishChannel = new WebhookNotifier();
  }

  /**
   * Write a test message to a file
   */
  private async postAIMessage(
    filePath: string,
    message: string
  ): Promise<void> {
    this.publishChannel.addNoticeTask({ filePath, message });
  }

  /**
   * Generate a test case for a given file
   */
  async run({ filePath }: { filePath: string }): Promise<void> {
    const message = await this.openai.run({ filePath });

    this.postAIMessage(filePath, message);
  }

  /**
   * Publish the notices to the webhook channel
   */
  public publishNotice(): void {
    this.publishChannel.publishNotice();
  }
}

export default HuskyGPTReview;
