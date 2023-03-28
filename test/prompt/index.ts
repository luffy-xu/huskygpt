import fs from 'fs';
import path from 'path';
import DependencyReader from './context';

export const generatePrompt = (filePath: string) => {
  // Read the file contents using the fs module
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Get the file name without the extension
  const fileName = path.basename(filePath, path.extname(filePath));

  // Get the file context
  const dependencyReader = new DependencyReader(filePath);
  const context = dependencyReader
    .getDependencies()
    .map((dependency) => dependency.content)
    .join('\n');

  // console.log('context ===>', context);
  // process.exit(1);
  // Return the prompt for the OpenAI API request as a string
  // '- No need to test members that import from other files',
  // '- The test should update all relative import path to parent directory and remove unused import',
  // return [
  //   'Please Write a javascript unit tests.',
  //   `- The test should import the test function from parent directory and file name is ${fileName}`,
  //   '- Should include at least one test case for each function or class',
  //   '- No need to test the function only return another function',
  //   '- No need to test variable definition',
  //   `- Test content context: ${context}`,
  //   `- Need to write test content: ${fileContent}`,
  // ].join('\n');
  return `
    Please Write a javascript unit tests.
    The test should import the test function from parent directory and file name is ${fileName}.
    Should include at least one test case for each function or class.
    No need to test the function only return another function.
    No need to test variable definition.

    ${context}

    Need to write test content: ${fileContent}
  `;
};
