import TestFilePaths from './reader';
import { HuskyGPTReview, HuskyGPTTest } from './huskygpt';
import { huskyGPTType, HuskyGPTTypeEnum } from './constant';

const runMap: Record<HuskyGPTTypeEnum, () => void> = {
  [HuskyGPTTypeEnum.Test]: () => {
    const testFilePaths = new TestFilePaths();
    const huskygpt = new HuskyGPTTest();

    // Generate a test case for each file path
    testFilePaths.getTestFilePath().map(async (filePath) => {
      await huskygpt.run({ filePath });
    });
  },
  [HuskyGPTTypeEnum.Review]: () => {
    const testFilePaths = new TestFilePaths();
    const huskygpt = new HuskyGPTReview();

    // Review code for each file path
    testFilePaths.getTestFilePath().map(async (filePath) => {
      await huskygpt.run({ filePath });
    });
  },
};

/**
 * Main function for huskygpt
 */
export function main() {
  const type = huskyGPTType;

  if (!runMap[type]) throw new Error('Invalid huskyGPTType: ' + type);
  console.log('Running huskygpt with type: ' + type);

  runMap[type]();
}

export default main;
