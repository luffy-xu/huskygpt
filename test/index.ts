import getTestFilePath from './get-test-files';
import TestGenerator from './test-generator';

// Create a new instance of the TestGenerator class
const testGenerator = new TestGenerator();

// Call the function to generate a test case
getTestFilePath().map(async (filePath) => {
  await testGenerator.generateTestCase({ filePath });
});
