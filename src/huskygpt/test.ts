import fs from 'fs';
import path from 'path';
import { userOptions } from 'src/constant';
import { IReadFileResult } from 'src/types';
import { getAllCodeBlock } from 'src/utils';
import getConflictResult from 'src/utils/write-conflict';

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
   * Get the file extension
   */
  private getFileExtension(filePath: string): string {
    return path.extname(filePath);
  }

  /**
   * Write a test message to a file
   */
  private async writeTestMessageToFile(
    { filePath, fileContent }: IReadFileResult,
    message: string,
  ): Promise<void> {
    // Write the message to a file
    try {
      const testFileDirName = userOptions.options.testFileDirName;
      if (!testFileDirName) throw new Error('testFileDirName is not set');

      const dirPath = path.join(path.dirname(filePath), testFileDirName);
      const fileName = `${this.getFileNameWithoutExtension(filePath)}.${
        userOptions.options.testFileType
      }${this.getFileExtension(filePath)}`;
      const testFilePath = path.join(dirPath, fileName);

      // Create the output directory if it doesn't exist
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }

      // If the test file doesn't exist, create it
      if (!fs.existsSync(testFilePath)) {
        // Write the message to the output file
        return fs.writeFileSync(testFilePath, message);
      }

      // If the file already exists, and file content is not same, merge existing file content
      const sourceFileContent = fs.readFileSync(filePath, 'utf-8');
      if (fileContent !== sourceFileContent) {
        const testFileContent = fs.readFileSync(testFilePath, 'utf-8');
        return fs.writeFileSync(
          testFilePath,
          `${testFileContent}\n${message}\n`,
        );
      }

      // If the file already exists, and file content is same
      return fs.writeFileSync(
        testFilePath,
        getConflictResult(fileContent, message),
      );
    } catch (error) {
      console.error('Error writing message to file:', error);
    }
  }

  /**
   * Generate a test case for a given file
   */
  public async run(fileResult: IReadFileResult): Promise<string> {
    // Reset the parent message to avoid the message tokens over limit
    this.openai.resetParentMessage();
    const message = await this.openai.run(fileResult);
    if (!message?.length) return;

    const extractTestsCode = message
      .map((m) => getAllCodeBlock(m))
      .join('\n\n');
    await this.writeTestMessageToFile(fileResult, extractTestsCode);

    return extractTestsCode;
  }
}

export default HuskyGPTTest;
