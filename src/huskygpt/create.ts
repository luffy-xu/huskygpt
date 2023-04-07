import { IReadFileResult } from 'src/types';
import { getAllCodeBlock } from 'src/utils';

import HuskyGPTBase from './base';

/**
 * Generate a test case for a given file path
 */
class HuskyGPTCreate extends HuskyGPTBase {
  /**
   * Generate a test case for a given file
   */
  public async run(fileResult: IReadFileResult): Promise<string> {
    const message = await this.openai.run(fileResult);
    if (!message?.length) return;

    const extractTestsCode = message
      .map((m) => getAllCodeBlock(m))
      .join('\n\n');

    return extractTestsCode;
  }
}

export default HuskyGPTCreate;
