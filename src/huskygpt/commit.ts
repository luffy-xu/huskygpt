import fs from 'fs';
import path from 'path';
import { ROOT_SRC_DIR_PATH, userOptions } from 'src/constant';
import { CommitRead, IFileDiff } from 'src/reader/commit-read';
import { ChatgptProxyAPI } from 'src/chatgpt';
import chalk from 'chalk';

enum PromptFile {
  summarize_file_diff = 'summarize_file_diff',
}

/**
 * Review code for a given file path
 */
class HuskyGPTCommit {
  private openai: ChatgptProxyAPI;
  private read: CommitRead;
  constructor() {
    this.openai = new ChatgptProxyAPI();
    this.read = new CommitRead();
  }

  /**
   * Generate a test case for a given file
   */
  public async run(): Promise<void> {
    const diffFile = userOptions.options.commitDiff;
    const params = this.read.getFileDiffParams(diffFile);
    if (!params || !params.length) {
      console.error('No file diff found, skip commit message summary');
      return;
    }
    const reviewSpinner = this.openai.oraStart(
      chalk.cyan(
        `[huskygpt] start ask ChatGPT to summary commit message... \n`,
      ),
    );

    const messages = await this.openai.sendPrompts(params);

    console.log(messages);

    reviewSpinner.succeed(
      chalk.green(
        `🎉🎉 [huskygpt] ${userOptions.huskyGPTType} code successfully! 🎉🎉\n `,
      ),
    );
  }
}

export default HuskyGPTCommit;
