import 'isomorphic-fetch';

import { userOptions } from './constant';
import { HuskyGPTReview, HuskyGPTTest } from './huskygpt';
import ReadFiles from './reader';
import { HuskyGPTTypeEnum, IUserOptions } from './types';

const runMap: Record<HuskyGPTTypeEnum, () => void> = {
  [HuskyGPTTypeEnum.Test]: async () => {
    const testFilePaths = new ReadFiles();
    const huskygpt = new HuskyGPTTest();

    // Generate a test case for each file path
    for (const fileResult of testFilePaths.getFileResults()) {
      await huskygpt.run(fileResult);
    }
  },
  [HuskyGPTTypeEnum.Review]: async () => {
    const reviewFiles = new ReadFiles();
    const huskygpt = new HuskyGPTReview();

    // Review code for each file path
    for (const fileResult of reviewFiles.getFileResults()) {
      await huskygpt.run(fileResult);
    }

    // Publish the notices to the webhook channel
    huskygpt.publishNotice();
  },
};

/**
 * Main function for huskygpt
 */
export function main(options?: IUserOptions) {
  userOptions.init(options);
  const type = userOptions.huskyGPTType;

  if (!runMap[type]) throw new Error('Invalid huskyGPTType: ' + type);

  // Print debug info
  if (userOptions.options.debug) {
    console.log(
      'Running huskygpt with options: ',
      JSON.stringify(userOptions.options),
    );
  }

  runMap[type]();
}

export default main;
