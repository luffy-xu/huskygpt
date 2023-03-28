import { testDirPath, testFileExtensions } from '../constant';
import ReadTestFilePathsByDirectory from './reader-directory';

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

  // Get all file paths that are not test files
  public getTestFilePath(): string[] {
    const reader = new ReadTestFilePathsByDirectory({
      fileExtensions: this.fileExtensions,
    });
    const filePaths = reader.getFilePaths(this.dirPath);

    console.log('[Gen files] ===>', filePaths);
    return filePaths;
  }
}

export default TestFilePaths;
