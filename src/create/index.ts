import inquirer from 'inquirer';
import ora from 'ora';

enum OptionType {
  Component = 'component',
  Container = 'container',
  Store = 'store',
  Service = 'service',
}

const OptionTypeExtension = {
  [OptionType.Component]: 'tsx',
  [OptionType.Container]: 'tsx',
  [OptionType.Store]: 'ts',
  [OptionType.Service]: 'ts',
};

const optionShortcuts = {
  [OptionType.Component]: '1',
  [OptionType.Container]: '2',
  [OptionType.Store]: '3',
  [OptionType.Service]: '4',
};

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

class CreateCLI {
  constructor(
    private onOptionCreated: (data: {
      option: OptionType;
      name: string;
      dirName: string;
      description: string;
    }) => void,
  ) {}

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

  private async promptName(option?: OptionType): Promise<string> {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        default: option ? 'index' : 'example-module',
        message: option
          ? messages.enterName(option)
          : messages.enterDirectoryName,
        validate: (input: string) => {
          if (input.trim() === '') return messages.nameEmpty;
          if (!/^[a-z]+(?:-[a-z]+)*$|^[a-z]+(?:[A-Z][a-z]*)*$/.test(input))
            return 'Name must be in camelCase or kebab-case.';
          return true;
        },
      },
    ]);

    return name;
  }

  private async promptOptionDescription(option: OptionType): Promise<string> {
    const { description } = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        default: `Write ${option} by context}`,
        message: messages.enterDescription(option),
        validate: (input: string) =>
          input.trim() !== '' || messages.descriptionEmpty,
      },
    ]);

    return description;
  }

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

  async start() {
    let continuePrompt = true;
    const dirName = await this.promptName();

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
