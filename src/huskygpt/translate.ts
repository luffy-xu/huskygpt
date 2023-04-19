import fs from 'fs';
import { userOptions } from 'src/constant';
import { IReadFileResult } from 'src/types';
import { getAllCodeBlock } from 'src/utils';
import getConflictResult from 'src/utils/write-conflict';

import HuskyGPTBase from './base';

/**
 * Translate for a given file path
 */
class HuskyGPTTranslate extends HuskyGPTBase {
  /**
   * Write message to a file
   */
  private writeMessageToFile(
    { filePath, fileContent }: IReadFileResult,
    message: string,
  ) {
    try {
      if (userOptions.options.debug) {
        console.log('Write message to file:', filePath, message);
      }
      fs.writeFileSync(filePath, getConflictResult(fileContent, message));
    } catch (error) {
      console.error('Error writing message to file:', error);
    }
  }

  /**
   * Translate content for a given file
   */
  public async run(fileResult: IReadFileResult): Promise<string> {
    // Reset the parent message to avoid the message tokens over limit
    this.openai.resetParentMessage();
    const message = await this.openai.run(fileResult);
    if (!message?.length) return;

    const extractCode = message.map((m) => getAllCodeBlock(m)).join('\n');
    this.writeMessageToFile(fileResult, extractCode);

    return extractCode;
  }
}

export default HuskyGPTTranslate;
