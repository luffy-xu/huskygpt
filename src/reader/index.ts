import ora from 'ora';
import path from 'path';
import { userOptions } from 'src/constant';
import { IReadFileResult, ReadTypeEnum } from 'src/types';

import ReadTestFilePathsByDirectory from './reader-directory';
import StagedFileReader from './reader-git-stage';

class ReadFiles {
  private dirPath: string;
  private fileExtensions: string[];

  constructor({
    dirPath = userOptions.readFilesRoot,
    fileExtensions = userOptions.readFilesExtensions,
  } = {}) {
    this.dirPath = dirPath;
    this.fileExtensions = fileExtensions;
  }

  readTypeMap: Record<ReadTypeEnum, () => IReadFileResult[]> = {
    [ReadTypeEnum.Directory]: () => this.getTestFilePathByDir(),
    [ReadTypeEnum.GitStage]: () => this.getTestFilePathByGit(),
  };

  // Get all file paths by directory
  private getTestFilePathByDir(): IReadFileResult[] {
    const reader = new ReadTestFilePathsByDirectory();
    const filePaths = reader.getFilePaths(this.dirPath);

    return filePaths.map((filePath) => ({
      filePath,
      content: '',
    }));
  }

  // Get all file paths by git stage
  private getTestFilePathByGit(): IReadFileResult[] {
    const reader = new StagedFileReader();

    return reader.getStagedFiles();
  }

  // Check if a file has a valid extension
  private hasValidExtension(file: string): boolean {
    const extension = path.extname(file);
    if (!this.fileExtensions.length) return true;

    return this.fileExtensions.includes(extension);
  }

  // Check if a file is a test file
  private isTestFile(file: string): boolean {
    const extension = path.extname(file);
    const testFileType = userOptions.options.testFileType;
    return file.endsWith(`.${testFileType}${extension}`);
  }

  // Get all file paths that are not test files
  public getFileResults(
    readFileType = userOptions.readFileType,
  ): IReadFileResult[] {
    if (!this.readTypeMap[readFileType])
      throw new Error('Invalid test file read type');

    const readSpinner = ora({
      text: '🚀 [huskygpt] Reading files...',
    }).start();

    try {
      const fileResults = this.readTypeMap[readFileType]().filter(
        ({ filePath: path }) =>
          path && this.hasValidExtension(path) && !this.isTestFile(path),
      );

      if (userOptions.options.debug) {
        console.log(
          '[huskygpt] read files ===>',
          fileResults.map((r) => r.filePath),
        );
      }

      fileResults.length > 0
        ? readSpinner.succeed('🌟🌟 [huskygpt] read files successfully! 🌟🌟')
        : readSpinner.warn('🤔🤔 [huskygpt] read no files! 🤔🤔');
      return fileResults;
    } catch (error) {
      readSpinner.fail(`[huskygpt] read files failed: ${error}`);
      throw error;
    }
  }
}

export default ReadFiles;
