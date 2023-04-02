import fs from 'fs';
import { getFileNameByPath } from '../utils';
import { userOptions } from '../constant';
import { HuskyGPTTypeEnum, IReadFileResult } from '../types';
import { CodePicker } from './pick-code';

export const PERFECT_KEYWORDS = 'perfect!';

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
        As a programer to write unit test code:
        - The test should import the test function from "../${fileName}"
        - Should include at least one test case for each function or class
        - No need to test the function import from other files
        - No need to test variable definition
        - No need to test function that only return a value
        ${userPrompt || ''}
        - Only return test code
        - Write test by following code: ${fileContent}
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
      As a programer to review code:
      - If there is bugs or can be optimized you should reply main points and reply optimized code.
      - Note that If reply code, must write using markdown's ${fileExtension} syntax code block.
      - Note that we may provide incomplete code snippets, so please ignore any missing pieces.
      - Note that skip the optimization about ternary operator.
      - Note that if there is no need optimized or no bugs only need reply "${PERFECT_KEYWORDS}".
      - Please start your feedback with the function or class name, followed by a colon and a space.
      ${userPrompt || ''}
      Please review following code:
    `;

    const codePicker = new CodePicker();

    return codePicker.pickFunctionOrClassCodeArray(fileContent).map((code) => {
      return `${basePrompt} "${code}"`;
    });
  },
};
