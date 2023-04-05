import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { userOptions } from 'src/constant';
import { IReadFileResult } from 'src/types';
import GitDiffExtractor from 'src/utils/extract-modify-funcs';

/**
 * Read the staged files from git only when the file is added
 * @returns the file path of the staged files
 */
class StagedFileReader {
  private stagedFiles: IReadFileResult[];

  constructor() {
    this.stagedFiles = this.readStagedFiles();
  }

  /**
   * Read the staged files from git
   */
  private readStagedFiles(): IReadFileResult[] {
    const files = execSync('git diff --cached --name-status')
      .toString()
      .split('\n')
      .filter(Boolean);
    const readRootName = userOptions.options.readFilesRootName;
    const readGitStatus =
      userOptions.options.readGitStatus?.split(',').map((el) => el.trim()) ||
      [];

    if (!readRootName) throw new Error('readFilesRootName is not set');
    if (!readGitStatus.length) {
      console.warn('readGitStatus is not set, no reading staged files');
      return [];
    }

    // Add the path of each added, renamed, or modified file
    return files.reduce<IReadFileResult[]>((acc, file) => {
      const fileSplitArr = file.split('\t');
      const status = fileSplitArr[0].slice(0, 1);
      const filePath = fileSplitArr.slice(-1)[0];
      const fullPath = path.join(process.cwd(), filePath);

      // Only read the files under the specified root directory and the specified status
      if (
        !readGitStatus.includes(status) ||
        !filePath.startsWith(`${readRootName}/`) ||
        !fs.existsSync(fullPath)
      ) {
        return acc;
      }

      const contents = fs.readFileSync(fullPath, 'utf-8');

      // If the file is not modified, return the original file content
      if (status !== 'M') {
        return [...acc, { filePath: fullPath, fileContent: contents }];
      }

      // If the file is modified, extract the modified function or class
      const codeExtractor = new GitDiffExtractor();
      const modifiedContents =
        codeExtractor.extractModifiedFunction(fullPath, contents) || '';
      return [
        ...acc,
        {
          filePath: fullPath,
          fileContent: modifiedContents,
        },
      ];
    }, []);
  }

  public getStagedFiles(): IReadFileResult[] {
    return this.stagedFiles;
  }
}

export default StagedFileReader;
