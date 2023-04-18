import { ChatgptProxyAPI } from 'src/chatgpt';
import { codeBlocksMdSymbolRegex } from 'src/constant';
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

  /**
   * Check if the message contains code blocks
   */
  isMessageContainCode(message: string[]): boolean {
    return codeBlocksMdSymbolRegex.test(message.join('\n'));
  }

  abstract run(fileResult: IReadFileResult): Promise<string>;
}

export default HuskyGPTBase;
