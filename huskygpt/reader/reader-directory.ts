import fs from 'fs';
import path from 'path';

class ReadTestFilePathsByDirectory {
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

  // Get all file paths in a directory and its subdirectories
  public getFilePaths(dirPath: string): string[] {
    const files = this.getFilesInDirectory(dirPath);

    return files.reduce((filePaths: string[], file: string) => {
      const filePath = path.join(dirPath, file);

      if (this.isDirectory(filePath)) {
        const subDirFilePaths = this.getSubDirectoryFilePaths(filePath);
        return [...filePaths, ...subDirFilePaths];
      }

      return [...filePaths, filePath];
    }, []);
  }
}

export default ReadTestFilePathsByDirectory;
