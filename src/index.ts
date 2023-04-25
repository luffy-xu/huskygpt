import 'isomorphic-fetch';

import { userOptions } from './constant';
import CreateCLI from './create';
import { HuskyGPTReview, HuskyGPTTest, HuskyGPTTranslate } from './huskygpt';
import ModifyCLI from './modify';
import ReadFiles from './reader';
import { HuskyGPTTypeEnum, IUserOptions, ReadTypeEnum } from './types';

const runMap: Record<HuskyGPTTypeEnum, () => void> = {
  [HuskyGPTTypeEnum.Test]: async () => {
    const testFilePaths = new ReadFiles();
    const files = testFilePaths.getFileResults();
    const huskygpt = new HuskyGPTTest();

    // Generate a test case for each file path
    for (const fileResult of files) {
      await huskygpt.run(fileResult);
    }
  },
  [HuskyGPTTypeEnum.Review]: async () => {
    const reviewFiles = new ReadFiles();
    const files = reviewFiles.getFileResults();
    const huskygpt = new HuskyGPTReview();

    // Review code for each file path
    for (const fileResult of files) {
      await huskygpt.run(fileResult);
    }

    // Publish the notices to the webhook channel
    huskygpt.publishNotice();
  },
  [HuskyGPTTypeEnum.Create]: async () => {
    const cli = new CreateCLI();

    await cli.start();
  },
  [HuskyGPTTypeEnum.Modify]: async () => {
    const reviewFiles = new ReadFiles();
    const files = reviewFiles.getFileResults();
    if (!files.length) return;

    // Modify for each file path
    const cli = new ModifyCLI(files);
    await cli.start();
  },
  [HuskyGPTTypeEnum.Translate]: async () => {
    const testFilePaths = new ReadFiles({ fileExtensions: [] });
    const files = testFilePaths.getFileResults(ReadTypeEnum.Directory);
    const huskygpt = new HuskyGPTTranslate();

    // Translate for each file path
    for (const fileResult of files) {
      await huskygpt.run(fileResult);
    }
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
