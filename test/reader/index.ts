import fs from 'fs';
import path from 'path';
import { userOptions } from '../constant';
import { ReadTypeEnum } from '../types';
import ReadTestFilePathsByDirectory from './reader-directory';
import StagedFileReader from './reader-git-stage';

class TestFilePaths {
  private dirPath: string;
  private fileExtensions: string[];

  constructor({
    dirPath = userOptions.readFilesRoot,
    fileExtensions = userOptions.readFilesExtensions,
  } = {}) {
    this.dirPath = dirPath;
    this.fileExtensions = fileExtensions;
  }

  readTypeMap: Record<ReadTypeEnum, () => string[]> = {
    [ReadTypeEnum.Directory]: () => this.getTestFilePathByDir(),
    [ReadTypeEnum.GitStage]: () => this.getTestFilePathByGit(),
  };

  // Get all file paths by directory
  private getTestFilePathByDir(): string[] {
    const reader = new ReadTestFilePathsByDirectory();
    const filePaths = reader.getFilePaths(this.dirPath);

    return filePaths;
  }

  // Get all file paths by git stage
  private getTestFilePathByGit(): string[] {
    const reader = new StagedFileReader();

    return reader.getStagedFiles();
  }

  // Check if a file has a valid extension
  private hasValidExtension(file: string): boolean {
    const extension = path.extname(file);
    return this.fileExtensions.includes(extension);
  }

  // Check if a file is a test file
  private isTestFile(file: string): boolean {
    const extension = path.extname(file);
    const testFileType = userOptions.options.testFileType;
    return file.endsWith(`.${testFileType}${extension}`);
  }

  // Check if a file exists in the test directory
  private fileExistsInTestDir(filePath: string): boolean {
    const fileName = path.basename(filePath, path.extname(filePath));
    const pathName = path.dirname(filePath);
    const testFileDirName = userOptions.options.testFileDirName;

    if (!testFileDirName) throw new Error('testFileDirName is not set');

    const testFilePath = path.join(
      pathName,
      testFileDirName,
      `${fileName}${userOptions.testFileNameSuffix}`
    );

    return fs.existsSync(testFilePath);
  }

  // Get all file paths that are not test files
  public getTestFilePath(): string[] {
    const readFileType = userOptions.readFileType;

    if (!this.readTypeMap[readFileType])
      throw new Error('Invalid test file read type');

    const filePaths = this.readTypeMap[readFileType]().filter(
      (filePath) =>
        !this.fileExistsInTestDir(filePath) &&
        this.hasValidExtension(filePath) &&
        !this.isTestFile(filePath)
    );

    console.log('Need gen test files ===>', filePaths);
    return filePaths;
  }
}

export default TestFilePaths;
