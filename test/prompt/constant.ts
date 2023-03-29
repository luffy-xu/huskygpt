import fs from 'fs';
import path from 'path';
import { userOptions } from '../constant';
import { HuskyGPTTypeEnum } from '../types';

export const huskyGPTTypeMap: Record<
  HuskyGPTTypeEnum,
  (filePath: string) => string
> = {
  [HuskyGPTTypeEnum.Test]: (filePath) => {
    // Read the file contents using the fs module
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Get the file name without the extension
    const fileName = path.basename(filePath, path.extname(filePath));
    const userPrompt = userOptions.options.openAIPrompt;

    return [
      'Please Write a unit tests by jest by typescript',
      `- The test should import the test function from "../${fileName}"`,
      '- Should include at least one test case for each function or class',
      '- No need to test the function import from other files',
      '- No need to test variable definition',
      '- No need to test function that only return a value',
      userPrompt,
      `- Write tests by following typescript code: ${fileContent}`,
      '- Test case:',
    ].join('\n');
  },
  [HuskyGPTTypeEnum.Review]: (filePath) => {
    // Read the file contents using the fs module
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const userPrompt = userOptions.options.openAIPrompt;

    return [
      'You are a team leader to review member code.',
      '- if there is bug or can be optimized you should reply, otherwise reply "perfect!" only',
      userPrompt,
      `- review following code: ${fileContent}`,
    ].join('\n');
  },
};
