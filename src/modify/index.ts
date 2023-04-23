import fs from 'fs';
import inquirer from 'inquirer';
import ora from 'ora';
import { HuskyGPTModify } from 'src/huskygpt';
import { IReadFileResult } from 'src/types';
import getConflictResult from 'src/utils/write-conflict';

/**
 * Huskygpt Modify CLI
 */
class ModifyCLI {
  private huskygpt: HuskyGPTModify;

  constructor(private readFileResult: IReadFileResult) {
    this.init();
  }

  private init() {
    this.huskygpt = new HuskyGPTModify();
  }

  /**
   * Prompt description from user
   */
  private async promptOptionDescription(): Promise<string> {
    const { description } = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        default: `Please chunk my code, and add both en and zh comments for each step`,
        messages: `Please input your modify requirements`,
        validate: (input: string) =>
          input.trim() !== '' || 'Description cannot be empty.',
      },
    ]);

    return description;
  }

  /**
   * Prompt continue or finish from user
   */
  private async promptContinueOrFinish(): Promise<boolean> {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Do you want to continue or finish?',
        choices: ['Continue', 'Finish'],
      },
    ]);

    return action === 'Continue';
  }

  // Write AI message to file
  private writeFile(newContent: string) {
    const { filePath } = this.readFileResult;

    fs.writeFileSync(
      filePath,
      getConflictResult(fs.readFileSync(filePath, 'utf-8'), newContent),
    );
  }

  /**
   * Start CLI
   */
  async start() {
    if (!this.readFileResult.filePath) throw new Error('File path is empty');

    console.log(`[huskygpt] Start modify ${this.readFileResult.filePath}...`);

    let continuePrompt = true;
    let continueTimes = 0;

    while (continuePrompt) {
      const description = await this.promptOptionDescription();
      const spinner = ora(`[huskygpt] Processing...`).start();

      const prompts = [
        continueTimes === 0
          ? `My fileContent is: ${this.readFileResult.fileContent}.`
          : '',
        `Please modify my code by following requirements: ${description}`,
      ];
      const message = await this.huskygpt.run({
        ...this.readFileResult,
        prompts: [prompts.join('\n')],
      });
      if (!message?.length) {
        spinner.stop();
        return;
      }

      this.writeFile(message.join('\n'));

      spinner.stop();
      continuePrompt = await this.promptContinueOrFinish();
      continueTimes += 1;
    }
  }
}

export default ModifyCLI;
