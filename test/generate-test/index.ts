import fs from 'fs';
import path from 'path';
import {
  TEST_DIR_NAME,
  testFileNameExtension,
} from '../constant';
import OpenAIFactory from '../openai';

/**
 * Generate a test case for a given file path
 * using the OpenAI API
 * Usage: new TestGenerator().generateTestCase({ filePath: 'path/to/file' });
 */
class TestGenerator {
  private openai: OpenAIFactory;

  constructor() {
    // Create a new OpenAI API client
    this.openai = new OpenAIFactory();
  }

  /**
   * Get the file name without the extension
   */
  private getFileNameWithoutExtension(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }

  /**
   * Write a test message to a file
   */
  private async writeTestMessageToFile(
    filePath: string,
    message: string
  ): Promise<void> {
    // Write the message to a file
    try {
      const dirPath = path.join(path.dirname(filePath), TEST_DIR_NAME);
      const fileName =
        this.getFileNameWithoutExtension(filePath) + testFileNameExtension;

      // Create the output directory if it doesn't exist
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }

      // Write the message to the output file
      fs.writeFileSync(path.join(dirPath, fileName), message);
      console.log('Message written to file');
    } catch (error) {
      console.error('Error writing message to file:', error);
    }
  }

  /**
   * Generate a test case for a given file
   */
  async generateTestCase({ filePath }: { filePath: string }): Promise<void> {
    const message = await this.openai.run({ filePath });
    await this.writeTestMessageToFile(filePath, message);
  }
}

export default TestGenerator;
