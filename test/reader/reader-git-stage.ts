import { execSync } from 'child_process';
import path from 'path';
import { readRootName } from '../constant';

/**
 * Read the staged files from git only when the file is added
 * @returns the file path of the staged files
 */
class StagedFileReader {
  private stagedFiles: string[];

  constructor() {
    this.stagedFiles = this.readStagedFiles();
  }

  private readStagedFiles(): string[] {
    const files = execSync('git diff --cached --name-status')
      .toString()
      .split('\n')
      .filter(Boolean);
    const stagedFiles: string[] = [];

    // Add the path of each added file
    for (const file of files) {
      const fileSplitArr = file.split('\t');
      const status = fileSplitArr[0].slice(0, 1);
      const filePath = fileSplitArr.slice(-1)[0];
      if (['A', 'R'].includes(status) && filePath.startsWith(`${readRootName}/`)) {
        const fullPath = path.join(process.cwd(), filePath);
        stagedFiles.push(fullPath);
      }
    }

    return stagedFiles;
  }

  public getStagedFiles(): string[] {
    return this.stagedFiles;
  }
}

export default StagedFileReader;