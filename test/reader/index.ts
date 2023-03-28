import fs from 'fs';
import path from 'path';
import {
  ReadTypeEnum,
  testDirPath,
  testFileExtensions,
  testFileNameExtension,
  testFileReadType,
  TEST_DIR_NAME,
  TEST_FILE_NAME,
} from '../constant';
import ReadTestFilePathsByDirectory from './reader-directory';
import StagedFileReader from './reader-git-stage';

class TestFilePaths {
  private dirPath: string;
  private fileExtensions: string[];

  constructor({
    dirPath = testDirPath,
    fileExtensions = testFileExtensions,
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

    return reader.getStagedFiles().map((file) => file.path);
  }

  // Check if a file has a valid extension
  private hasValidExtension(file: string): boolean {
    const extension = path.extname(file);
    return this.fileExtensions.includes(extension);
  }

  // Check if a file is a test file
  private isTestFile(file: string): boolean {
    const extension = path.extname(file);
    return file.endsWith(TEST_FILE_NAME + extension);
  }

  // Check if a file exists in the test directory
  private fileExistsInTestDir(filePath: string): boolean {
    const fileName = path.basename(filePath, path.extname(filePath));
    const pathName = path.dirname(filePath);

    const testFilePath = path.join(
      pathName,
      TEST_DIR_NAME,
      `${fileName}${testFileNameExtension}`
    );

    return fs.existsSync(testFilePath);
  }

  // Get all file paths that are not test files
  public getTestFilePath(): string[] {
    if (!this.readTypeMap[testFileReadType])
      throw new Error('Invalid test file read type');

    console.log('Read type ===>', testFileReadType);
    const filePaths = this.readTypeMap[testFileReadType]().filter(
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
