import { IReadFileResult } from 'src/types';

import HuskyGPTBase from './base';

/**
 * Review code for a given file path
 */
class HuskyGPTCommit extends HuskyGPTBase {
  constructor() {
    super();
  }

  /**
   * Generate a test case for a given file
   */
  public async run(fileResult: IReadFileResult): Promise<void> {
    const message = await this.openai.run(fileResult);
    console.log(message);
  }
}

export default HuskyGPTCommit;
