import fs from 'fs';
import { getFileNameByPath } from '../utils';
import { userOptions } from '../constant';
import { HuskyGPTTypeEnum, IReadFileResult } from '../types';
import { CodePicker } from './pick-code';

export const huskyGPTTypeMap: Record<
  HuskyGPTTypeEnum,
  (fileResult: IReadFileResult) => string[]
> = {
  [HuskyGPTTypeEnum.Test]: (fileResult) => {
    // Read the file contents using the fs module
    const fileContent =
      fileResult.fileContent || fs.readFileSync(fileResult.filePath!, 'utf-8');

    // Get the file name without the extension
    const fileName = getFileNameByPath(fileResult.filePath!);
    const userPrompt = userOptions.options.openAIPrompt;

    return [
      `
        Please Write a unit tests by jest by typescript
        - The test should import the test function from "../${fileName}"
        - Should include at least one test case for each function or class
        - No need to test the function import from other files
        - No need to test variable definition
        - No need to test function that only return a value
        ${userPrompt || ''}
        - Write tests by following typescript code: ${fileContent}
        - Test case:
      `,
    ];
  },
  [HuskyGPTTypeEnum.Review]: (fileResult) => {
    // Read the file contents using the fs module
    const fileContent =
      fileResult.fileContent || fs.readFileSync(fileResult.filePath!, 'utf-8');
    const userPrompt = userOptions.options.openAIPrompt;
    const fileExtension = fileResult.filePath?.split('.').pop();

    // The base prompt for each code snippet
    const basePrompt = `
      You are a programer to review code
      - If there is bugs or can be optimized you should reply key problems and write code with markdown ${fileExtension} language block , else reply "function name or class name perfect!" only
      - Ignore the code snippet is incomplete
      ${userPrompt || ''}
      - review following code:
    `;

    const codePicker = new CodePicker();

    return codePicker.pickFunctionOrClassCodeArray(fileContent).map((code) => {
      return basePrompt + code;
    });
  },
};
