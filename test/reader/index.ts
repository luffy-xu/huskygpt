import fs from 'fs';
import path from 'path';
import { userOptions } from '../constant';
import { ReadTypeEnum, IReadFileResult } from '../types';
import { getFileNameByPath } from '../utils';
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
    const fileName = getFileNameByPath(filePath);
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
  public getFileResults(): IReadFileResult[] {
    const readFileType = userOptions.readFileType;

    if (!this.readTypeMap[readFileType])
      throw new Error('Invalid test file read type');

    const filePaths = this.readTypeMap[readFileType]().filter(
      ({ filePath: path }) =>
        path &&
        !this.fileExistsInTestDir(path) &&
        this.hasValidExtension(path) &&
        !this.isTestFile(path)
    );

    if (process.env.DEBUG) {
      console.log('Need gen test files ===>', filePaths);
    }
    return filePaths;
  }
}

export default ReadFiles;
