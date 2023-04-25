import inquirer from 'inquirer';
import ora from 'ora';

import CreateCodeGenerator from './code-generator';
import {
  OptionType,
  OptionTypeExtension,
  messages,
  optionShortcuts,
} from './constant';

/**
 * Huskygpt Create CLI
 */
class CreateCLI {
  private codeGenerator: CreateCodeGenerator;

  constructor() {
    this.init();
  }

  private init() {
    this.codeGenerator = new CreateCodeGenerator();
  }
  /**
   * Prompt option selection from user
   */
  private async promptOptionSelection(): Promise<OptionType> {
    const { option } = await inquirer.prompt([
      {
        type: 'list',
        name: 'option',
        message: messages.selectOption,
        choices: [
          OptionType.Models,
          OptionType.Sections,
          OptionType.Pages,
          OptionType.Components,
        ].map((option) => ({
          name: `${option} (${optionShortcuts[option]})`,
          value: option,
        })),
      },
    ]);

    return option as OptionType;
  }

  /**
   * Prompt name from user
   */
  private async promptName(
    option?: OptionType,
    defaultName?: string,
  ): Promise<string> {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        default: defaultName || option ? 'index' : 'exampleModule',
        message: option
          ? messages.enterName(option)
          : messages.enterDirectoryName,
        validate: (input: string) => {
          if (input.trim() === '') return messages.nameEmpty;
          if (!/^[a-z]+(?:[A-Z][a-z]*)*$/.test(input))
            return 'Name must be in camelCase.';
          return true;
        },
      },
    ]);

    return name;
  }

  /**
   * Prompt description from user
   */
  private async promptOptionDescription(option: OptionType): Promise<string> {
    const { description } = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        default: `Please input your requirements`,
        message: messages.enterDescription(option),
        validate: (input: string) =>
          input.trim() !== '' || messages.descriptionEmpty,
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
        message: messages.continueOrFinish,
        choices: ['Continue', 'Finish'],
      },
    ]);

    return action === 'Continue';
  }

  /**
   * Start CLI
   */
  async start() {
    // Prompt user for a directory name
    let continuePrompt = true;

    let dirName;
    // If user says yes, prompt for options and create a file
    while (continuePrompt) {
      const selectedOption = await this.promptOptionSelection();
      dirName = await this.promptName(undefined, dirName);
      const name = await this.promptName(selectedOption);
      const description = await this.promptOptionDescription(selectedOption);
      const spinner = ora('[huskygpt] Processing...').start();

      this.codeGenerator.setOptions({
        option: selectedOption,
        name,
        dirName,
        description,
      });

      await this.codeGenerator.generator();

      spinner.stop();
      continuePrompt = await this.promptContinueOrFinish();
    }
  }
}

export { OptionType, OptionTypeExtension };
export default CreateCLI;
