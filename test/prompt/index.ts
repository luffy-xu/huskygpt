import fs from 'fs';
import path from 'path';

// You are a team leader to review member code, if there is bug or can be optimized you should reply, otherwise reply "good" only, review following code:

export const generatePrompt = (filePath: string) => {
  // Read the file contents using the fs module
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Get the file name without the extension
  const fileName = path.basename(filePath, path.extname(filePath));

  console.log('Customize prompt ===>', process.env.OPENAI_PROMPT);

  /**
   * Return the prompt for the OpenAI API request as a string
   */
  // '- No need to test members that import from other files',
  // `- Test content context: ${context}`,
  // '- The test should update all relative import path to parent directory and remove unused import',
  return [
    'Please Write a unit tests by jest by typescript.',
    `- The test should import the test function from "../${fileName}"`,
    '- Should include at least one test case for each function or class',
    '- No need to test the function import from other files',
    '- No need to test variable definition',
    '- No need to test function that only return a value',
    process.env.OPENAI_PROMPT,
    `- Write tests by following typescript code: ${fileContent}`,
    '- Test case:',
  ].join('\n');
};
