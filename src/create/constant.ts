export enum OptionType {
  Components = 'components',
  Pages = 'pages',
  Sections = 'sections',
  Models = 'models',
  Services = 'services',
  Mock = 'mock',
}

export const OptionTypeExtension = {
  [OptionType.Components]: 'tsx',
  [OptionType.Pages]: 'tsx',
  [OptionType.Sections]: 'tsx',
  [OptionType.Models]: 'ts',
  [OptionType.Services]: 'ts',
  [OptionType.Mock]: 'ts',
};

export const optionShortcuts = {
  [OptionType.Models]: '1',
  [OptionType.Sections]: '2',
  [OptionType.Pages]: '3',
  [OptionType.Components]: '4',
};

export interface IOptionCreated {
  option: OptionType;
  description: string;
  dirName: string;
  name: string;
}

export const messages = {
  selectOption: 'Select an option:',
  enterDirectoryName: 'Enter a name for module (Directory Name):',
  enterName: (option: string) => `Enter a name for the ${option}:`,
  nameEmpty: 'Name cannot be empty.',
  enterDescription: (option: string) =>
    `Enter a description for the ${option}:`,
  descriptionEmpty: 'Description cannot be empty.',
  continueOrFinish: 'Do you want to continue or finish?',
};
