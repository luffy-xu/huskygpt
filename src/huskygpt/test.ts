import fs from 'fs';
import path from 'path';
import { getAllCodeBlock } from 'src/utils';

import { userOptions } from '../constant';
import { IReadFileResult } from '../types';
import HuskyGPTBase from './base';

/**
 * Generate a test case for a given file path
 */
class HuskyGPTTest extends HuskyGPTBase {
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
    message: string,
  ): Promise<void> {
    // Write the message to a file
    try {
      const testFileDirName = userOptions.options.testFileDirName;
      if (!testFileDirName) throw new Error('testFileDirName is not set');

      const dirPath = path.join(path.dirname(filePath), testFileDirName);
      const fileName =
        this.getFileNameWithoutExtension(filePath) +
        userOptions.testFileNameSuffix;

      // Create the output directory if it doesn't exist
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }

      // Write the message to the output file
      fs.writeFileSync(path.join(dirPath, fileName), message);
    } catch (error) {
      console.error('Error writing message to file:', error);
    }
  }

  /**
   * Generate a test case for a given file
   */
  public async run(fileResult: IReadFileResult): Promise<void> {
    const message = await this.openai.run(fileResult);
    const extraTestsCode = message.map((m) => getAllCodeBlock(m)).join('\n\n');
    await this.writeTestMessageToFile(fileResult.filePath!, extraTestsCode);
  }
}

export default HuskyGPTTest;
