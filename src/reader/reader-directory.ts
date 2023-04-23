import fs from 'fs';
import path from 'path';
import { IReadFileResult } from 'src/types';

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
  private getSubDirectoryFilePaths(filePath: string): IReadFileResult[] {
    return this.getDirFiles(filePath);
  }

  // Get file content of a file
  private getFileContent(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  // Get all file paths in a directory and its subdirectories
  public getDirFiles(dirPath: string): IReadFileResult[] {
    // If the path is not a directory, return the path
    if (!this.isDirectory(dirPath)) {
      return [{ filePath: dirPath, fileContent: this.getFileContent(dirPath) }];
    }

    const filesPath = this.getFilesInDirectory(dirPath);

    return filesPath.reduce((fileResult: IReadFileResult[], file: string) => {
      const filePath = path.join(dirPath, file);

      if (this.isDirectory(filePath)) {
        const subDirFileResults = this.getSubDirectoryFilePaths(filePath);
        return [...fileResult, ...subDirFileResults];
      }

      return [
        ...fileResult,
        { filePath, fileContent: this.getFileContent(filePath) },
      ];
    }, [] as IReadFileResult[]);
  }
}

export default ReadTestFilePathsByDirectory;
