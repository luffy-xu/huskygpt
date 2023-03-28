import TestFilePaths from './reader';
import TestGenerator from './generate-test';

/**
 * Main function for generating test cases
 */
export function main() {
  const testFilePaths = new TestFilePaths();
  const testGenerator = new TestGenerator();

  // Generate a test case for each file path
  testFilePaths.getTestFilePath().map(async (filePath) => {
    await testGenerator.generateTestCase({ filePath });
  });
}

export default main;
