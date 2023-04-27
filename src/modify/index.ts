import fs from 'fs';
import inquirer from 'inquirer';
import ora from 'ora';
import { userOptions } from 'src/constant';
import { HuskyGPTModify } from 'src/huskygpt';
import { IReadFileResult } from 'src/types';
import getConflictResult from 'src/utils/write-conflict';

/**
 * Huskygpt Modify CLI
 */
class ModifyCLI {
  private huskygpt: HuskyGPTModify;

  constructor(private readFileResult: IReadFileResult[]) {
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
        default: `Please fix bugs or optimize my code, and extract constant variable or enum variable. if the function is complexity, please chunk it. If it's functional component, use react hooks optimize some UI component or functions. And add comments with ${
          userOptions.options.translate || 'en'
        } language for complexity logic steps.`,
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
  private writeFile(filePath: string, newContent: string) {
    fs.writeFileSync(
      filePath,
      getConflictResult(fs.readFileSync(filePath, 'utf-8'), newContent),
    );
  }

  // Run single file modify
  private async runSingleFile(
    fileResult: IReadFileResult,
    continueTimes: number,
  ) {
    if (!fileResult?.filePath) throw new Error('File path is empty');

    console.log(`[huskygpt] Start modify ${fileResult.filePath}...`);
    const description = await this.promptOptionDescription();
    const spinner = ora(`[huskygpt] Processing...`).start();

    const prompts = [
      continueTimes === 0
        ? `My fileContent is: ${fileResult.fileContent}.`
        : '',
      `Please modify previous code by following requirements: ${description}`,
    ];
    const message = await this.huskygpt.run({
      ...this.readFileResult,
      prompts: [prompts.join('\n')],
    });
    if (!message?.length) {
      spinner.stop();
      return;
    }

    this.writeFile(fileResult.filePath, message.join('\n'));

    spinner.stop();
  }

  /**
   * Start CLI
   */
  async start() {
    if (!this.readFileResult?.length) throw new Error('File path is empty');

    let continuePrompt = true;
    let continueTimes = 0;

    while (continuePrompt) {
      for (const fileResult of this.readFileResult) {
        await this.runSingleFile(fileResult, continueTimes);
      }

      continuePrompt = await this.promptContinueOrFinish();
      continueTimes += 1;
    }
  }
}

export default ModifyCLI;
