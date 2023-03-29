import TestFilePaths from './reader';
import { HuskyGPTReview, HuskyGPTTest } from './huskygpt';
import { HuskyGPTTypeEnum, UserOptions } from './types';
import { userOptions } from './constant';

const runMap: Record<HuskyGPTTypeEnum, () => void> = {
  [HuskyGPTTypeEnum.Test]: () => {
    const testFilePaths = new TestFilePaths();
    const huskygpt = new HuskyGPTTest();

    // Generate a test case for each file path
    testFilePaths.getTestFilePath().map(async (filePath) => {
      await huskygpt.run({ filePath });
    });
  },
  [HuskyGPTTypeEnum.Review]: async () => {
    const testFilePaths = new TestFilePaths();
    const huskygpt = new HuskyGPTReview();

    // Review code for each file path
    for (const filePath of testFilePaths.getTestFilePath()) {
      await huskygpt.run({ filePath });
    }

    // Publish the notices to the webhook channel
    huskygpt.publishNotice();
  },
};

/**
 * Main function for huskygpt
 */
export function main(options?: UserOptions) {
  userOptions.init(options);
  const type = userOptions.huskyGPTType;

  if (!runMap[type]) throw new Error('Invalid huskyGPTType: ' + type);

  // Print debug info
  if (process.env.DEBUG) {
    console.log(
      'Running huskygpt with options: ',
      JSON.stringify(userOptions.options)
    );
  }

  runMap[type]();
}

export default main;
