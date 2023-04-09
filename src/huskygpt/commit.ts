import fs from 'fs';
import path from 'path';
import { ROOT_SRC_DIR_PATH, userOptions } from 'src/constant';
import { CommitRead, IFileDiff } from 'src/reader/commit-read';
import { ChatgptProxyAPI } from 'src/chatgpt';
import chalk from 'chalk';

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
    // read 3 files for test
    const files = this.read.getFilePrompts(diffFile, 3);
    if (!files || !files.length) {
      console.error('No file diff found, skip commit message summary');
      return;
    }
    const reviewSpinner = this.openai.oraStart(
      chalk.cyan(
        `[huskygpt] start ask ChatGPT to summary commit message... \n`,
      ),
    );

    const messages = await this.openai.sendPrompts(files.map((o) => o.prompt));
    await this.summaryCommitMessage(messages, files.map((o) => o.fileName));

    reviewSpinner.succeed(
      chalk.green(
        `🎉🎉 [huskygpt] ${userOptions.huskyGPTType} code successfully! 🎉🎉\n `,
      ),
    );
  }

  private async summaryCommitMessage(messages: string[], files: string[]) {
    const summary = messages.map((msg, i) => `[${files[i]}]\n${msg}`).join('\n');
    const prompts = this.read.getSummaryPrompts(summary);
    const ret = await this.openai.sendPrompts(prompts);
    console.log(ret);
    return ret;
  }
}

export default HuskyGPTCommit;
