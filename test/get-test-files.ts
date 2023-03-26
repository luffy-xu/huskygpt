import fs from 'fs';
import path from 'path';
import {
  testDirPath,
  testFileExtensions,
  TEST_DIR_NAME,
  TEST_FILE_NAME,
  TEST_FILE_NAME_EXTENSION,
} from './constant';

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

  // Get all files in a directory
  private getFilesInDirectory(dirPath: string): string[] {
    return fs.readdirSync(dirPath);
  }

  // Check if a file path is a directory
  private isDirectory(filePath: string): boolean {
    return fs.statSync(filePath).isDirectory();
  }

  // Get file paths of all files in a subdirectory
  private getSubDirectoryFilePaths(filePath: string): string[] {
    return this.getFilePaths(filePath);
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
      `${fileName}${TEST_FILE_NAME_EXTENSION}`
    );

    return fs.existsSync(testFilePath);
  }

  // Get all file paths in a directory and its subdirectories
  private getFilePaths(dirPath: string): string[] {
    const files = this.getFilesInDirectory(dirPath);

    return files.reduce((filePaths: string[], file: string) => {
      const filePath = path.join(dirPath, file);

      if (this.isDirectory(filePath)) {
        const subDirFilePaths = this.getSubDirectoryFilePaths(filePath);
        return [...filePaths, ...subDirFilePaths];
      }

      if (
        !this.hasValidExtension(file) ||
        this.isTestFile(file) ||
        this.fileExistsInTestDir(filePath)
      ) {
        return filePaths;
      }

      return [...filePaths, filePath];
    }, []);
  }

  // Get all file paths that are not test files
  public getTestFilePath(): string[] {
    const filePaths = this.getFilePaths(this.dirPath);

    console.log('[Gen files] ===>', filePaths);
    return filePaths;
  }
}

export default TestFilePaths;
