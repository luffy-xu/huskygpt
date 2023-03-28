import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { readRootName } from '../constant';

interface StagedFile {
  path: string;
  content: string;
}

/**
 * Read all staged files
 * @returns {StagedFile[]} staged files
 * @example
 * const stagedFiles = new StagedFileReader().getStagedFiles();
 * console.log(stagedFiles);
 */
class StagedFileReader {
  private stagedFiles: StagedFile[];

  constructor() {
    this.stagedFiles = this.readStagedFiles();
  }

  // Read all staged files
  private readStagedFiles(): StagedFile[] {
    const files = execSync('git diff --name-only --cached')
      .toString()
      .split('\n')
      .filter(Boolean);
    const stagedFiles: StagedFile[] = [];

    // Read the content of each staged file
    for (const file of files) {
      // Only read files in the root directory
      if (file.startsWith(`${readRootName}/`)) {
        const filePath = path.join(process.cwd(), file);
        const content = fs.readFileSync(filePath, 'utf-8');
        stagedFiles.push({ path: filePath, content });
      }
    }

    return stagedFiles;
  }

  public getStagedFiles(): StagedFile[] {
    return this.stagedFiles;
  }
}

export default StagedFileReader;
