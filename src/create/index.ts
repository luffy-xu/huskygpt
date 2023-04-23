import fs from 'fs';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import { userOptions } from 'src/constant';
import { HuskyGPTCreate } from 'src/huskygpt';
import { makeDirExist } from 'src/utils';
import { readPromptFile } from 'src/utils/read-prompt-file';

enum OptionType {
  Components = 'components',
  Pages = 'pages',
  Models = 'models',
  Services = 'services',
}

const OptionTypeExtension = {
  [OptionType.Components]: 'tsx',
  [OptionType.Pages]: 'tsx',
  [OptionType.Models]: 'ts',
  [OptionType.Services]: 'ts',
};

const optionShortcuts = {
  [OptionType.Components]: '1',
  [OptionType.Pages]: '2',
  [OptionType.Models]: '3',
  [OptionType.Services]: '4',
};

interface IOptionCreated {
  option: OptionType;
  description: string;
  dirName: string;
  name: string;
}

const messages = {
  selectOption: 'Select an option:',
  enterDirectoryName: 'Enter a name for module (Directory Name):',
  enterName: (option: string) => `Enter a name for the ${option}:`,
  nameEmpty: 'Name cannot be empty.',
  enterDescription: (option: string) =>
    `Enter a description for the ${option}:`,
  descriptionEmpty: 'Description cannot be empty.',
  continueOrFinish: 'Do you want to continue or finish?',
};

/**
 * Huskygpt Create CLI
 */
class CreateCLI {
  private onOptionCreated = async ({
    option,
    description,
    dirName,
    name,
  }: IOptionCreated) => {
    const huskygpt = new HuskyGPTCreate();
    const message = await huskygpt.run({
      fileContent: `${readPromptFile(
        `create-${option}.txt`,
      )}\n Please reply "${option}" code by following requirements: ${description}`,
    });
    if (!message) return;

    const dirPath = path.join(
      process.cwd(),
      userOptions.options.readFilesRootName,
      option,
      dirName,
    );
    makeDirExist(dirPath);
    fs.writeFileSync(
      path.join(dirPath, `${name}.${OptionTypeExtension[option]}`),
      message,
    );
  };

  /**
   * Prompt option selection from user
   */
  private async promptOptionSelection(): Promise<OptionType> {
    const { option } = await inquirer.prompt([
      {
        type: 'list',
        name: 'option',
        message: messages.selectOption,
        choices: Object.values(OptionType).map((option) => ({
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
  private async promptName(option?: OptionType): Promise<string> {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        default: option ? 'index' : 'exampleModule',
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
    const dirName = await this.promptName();

    // If user says yes, prompt for options and create a file
    while (continuePrompt) {
      const selectedOption = await this.promptOptionSelection();
      const name = await this.promptName(selectedOption);
      const description = await this.promptOptionDescription(selectedOption);
      const spinner = ora('[huskygpt] Processing...').start();

      await this.onOptionCreated({
        option: selectedOption,
        name,
        dirName,
        description,
      });

      spinner.stop();
      continuePrompt = await this.promptContinueOrFinish();
    }
  }
}

export { OptionType, OptionTypeExtension };
export default CreateCLI;
