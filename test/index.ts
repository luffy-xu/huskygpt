import TestFilePaths from './reader';
import TestGenerator from './test-generator';

// Create a new instance of the TestGenerator class
const testGenerator = new TestGenerator();

// Create a new instance of the TestFilePaths class
const testFilePaths = new TestFilePaths();

// Generate a test case for each file path
testFilePaths.getTestFilePath().map(async (filePath) => {
  await testGenerator.generateTestCase({ filePath });
});
