import { ChatgptProxyAPI } from 'src/chatgpt';
import { IReadFileResult } from 'src/types';

/**
 * Base class for HuskyGPT
 */
abstract class HuskyGPTBase {
  public openai: ChatgptProxyAPI;

  constructor() {
    // Create a new OpenAI API client
    this.openai = new ChatgptProxyAPI();
  }

  abstract run(fileResult: IReadFileResult): Promise<void>;
}

export default HuskyGPTBase;
