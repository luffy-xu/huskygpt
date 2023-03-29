import OpenAIFactory from '../openai';

/**
 * Generate a test case for a given file path
 * using the OpenAI API
 * Usage: new TestGenerator().generateTestCase({ filePath: 'path/to/file' });
 */
class HuskyGPTReview {
  private openai: OpenAIFactory;

  constructor() {
    // Create a new OpenAI API client
    this.openai = new OpenAIFactory();
  }

  /**
   * Write a test message to a file
   */
  private async postAIMessage(
    filePath: string,
    message: string
  ): Promise<void> {
    console.log(`Review ${filePath} message: `, message);
  }

  /**
   * Generate a test case for a given file
   */
  async run({ filePath }: { filePath: string }): Promise<void> {
    const message = await this.openai.run({ filePath });
    await this.postAIMessage(filePath, message);
  }
}

export default HuskyGPTReview;
