import fs from 'fs';
import { userOptions } from 'src/constant';
import { HuskyGPTTypeEnum, IReadFileResult } from 'src/types';
import { ExtractCodePrompts } from 'src/utils/extract-code-prompts';
import { readPromptFile } from 'src/utils/read-prompt-file';

export class HuskyGPTPrompt {
  private huskyGPTTypeMap: Record<
    HuskyGPTTypeEnum,
    (fileResult: IReadFileResult) => string[]
  > = {
    [HuskyGPTTypeEnum.Test]: (fileResult) => {
      const fileContent =
        fileResult.fileContent ||
        fs.readFileSync(fileResult.filePath!, 'utf-8');
      const testsPrompt = readPromptFile('tests.txt');
      // const fileName = getFileNameByPath(fileResult.filePath!)
      // - Import the test function from "../${fileName}".
      const basePrompt = `
        ${testsPrompt}
        ${userOptions.openAIPrompt || ''}
      `;

      const codePicker = new ExtractCodePrompts();

      const codePrompts = codePicker.extractFunctionOrClassCodeArray({
        ...fileResult,
        fileContent,
      });

      return [basePrompt, ...codePrompts];
    },
    [HuskyGPTTypeEnum.Review]: (fileResult) => {
      const fileContent =
        fileResult.fileContent ||
        fs.readFileSync(fileResult.filePath!, 'utf-8');
      const reviewPrompt = readPromptFile('review.txt');
      const basePrompt = `
        ${reviewPrompt}
        ${userOptions.openAIPrompt || ''}
      `;

      const codePicker = new ExtractCodePrompts();

      const codePrompts = codePicker.extractFunctionOrClassCodeArray({
        ...fileResult,
        fileContent,
      });

      return [basePrompt, ...codePrompts];
    },
    [HuskyGPTTypeEnum.Translate]: (fileResult) => {
      const fileContent =
        fileResult.fileContent ||
        fs.readFileSync(fileResult.filePath!, 'utf-8');
      const readPrompt = readPromptFile('translate.txt');
      const basePrompt = `
        ${readPrompt}
        - Target language: ${userOptions.options.translate}
        ${userOptions.openAIPrompt || ''}
      `;

      return [basePrompt, fileContent];
    },
    [HuskyGPTTypeEnum.Create]: ({ prompts }) => {
      if (!prompts) throw new Error('prompts is required for create');
      const createPrompt = readPromptFile('create.txt');

      return [
        createPrompt,
        ...[
          `${userOptions.openAIPrompt}\n${prompts.slice(0, 1)}`,
          ...prompts.slice(1),
        ],
      ];
    },
    [HuskyGPTTypeEnum.Modify]: ({ prompts }) => {
      const readPrompt = readPromptFile('modify.txt');

      return [
        readPrompt,
        ...[
          `${userOptions.openAIPrompt}\n${prompts.slice(0, 1)}`,
          ...prompts.slice(1),
        ],
      ];
    },
  };

  constructor(private huskyGPTType: HuskyGPTTypeEnum) {}

  public generatePrompt(fileResult: IReadFileResult): string[] {
    if (!fileResult)
      throw new Error('File path is required for generatePrompt');
    if (!this.huskyGPTTypeMap[this.huskyGPTType])
      throw new Error('Invalid huskyGPTType: ' + this.huskyGPTType);

    return this.huskyGPTTypeMap[this.huskyGPTType](fileResult);
  }
}
