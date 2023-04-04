import fs from 'fs';
import path from 'path';
import { ROOT_SRC_DIR_PATH, userOptions } from 'src/constant';
import { HuskyGPTTypeEnum, IReadFileResult } from 'src/types';
import { CodePicker } from 'src/utils/pick-code';

export class HuskyGPTPrompt {
  private huskyGPTTypeMap: Record<
    HuskyGPTTypeEnum,
    (fileResult: IReadFileResult) => string[]
  > = {
    [HuskyGPTTypeEnum.Test]: (fileResult) => {
      const fileContent =
        fileResult.fileContent ||
        fs.readFileSync(fileResult.filePath!, 'utf-8');
      const testsPrompt = fs.readFileSync(
        path.join(ROOT_SRC_DIR_PATH, './prompt', 'tests.txt'),
        'utf-8',
      );
      // const fileName = getFileNameByPath(fileResult.filePath!)
      // - Import the test function from "../${fileName}".
      const basePrompt = `
        ${testsPrompt}
        ${userOptions.options.openAIPrompt || ''}
      `;

      const codePicker = new CodePicker();

      const codePrompts = codePicker
        .pickFunctionOrClassCodeArray(fileContent)
        .map((code) => {
          return `Here is the code to write tests for: "${code}"`;
        });

      return [basePrompt, ...codePrompts];
    },
    [HuskyGPTTypeEnum.Review]: (fileResult) => {
      const fileContent =
        fileResult.fileContent ||
        fs.readFileSync(fileResult.filePath!, 'utf-8');
      const reviewPrompt = fs.readFileSync(
        path.join(ROOT_SRC_DIR_PATH, './prompt', 'review.txt'),
        'utf-8',
      );
      const basePrompt = `
        ${reviewPrompt}
        ${userOptions.options.openAIPrompt || ''}
      `;

      const codePicker = new CodePicker();

      const codePrompts = codePicker
        .pickFunctionOrClassCodeArray(fileContent)
        .map((code) => {
          return `Here is the code snippet for review: "${code}"`;
        });

      return [basePrompt, ...codePrompts];
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
