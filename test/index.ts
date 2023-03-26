import TestGenerator from './test-generator';
import TestFilePaths from './get-test-files';
import { config } from 'dotenv';
import path from 'path';

// Read the .env file
config();
config({ path: path.join(process.cwd(), '.env.local') });

// Create a new instance of the TestGenerator class
const testGenerator = new TestGenerator();

// Create a new instance of the TestFilePaths class
const testFilePaths = new TestFilePaths();

// Generate a test case for each file path
testFilePaths.getTestFilePath().map(async (filePath) => {
  await testGenerator.generateTestCase({ filePath });
});
