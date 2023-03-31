import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { userOptions } from '../constant';
import { IReadFileResult } from '../types';

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
   * Get the modified function from the staged files
   */
  private extractModifiedFunction(
    filePath: string,
    contents: string
  ): string | null {
    const diffOutput = execSync(`git diff --cached ${filePath}`).toString();
    const diffLines = diffOutput.split('\n');

    let startLine = -1;
    let endLine = -1;
    let inModifiedBlock = false;
    let modifiedLines: string[] = [];

    for (const line of diffLines) {
      if (line.startsWith('@@ ')) {
        const match = line.match(/-(\d+),?/);
        if (match) {
          startLine = parseInt(match[1], 10) - 1;
          endLine = startLine;
          inModifiedBlock = false;
        }
      } else if (line.startsWith('-')) {
        endLine++;
        inModifiedBlock = false;
      } else if (line.startsWith('+')) {
        if (!inModifiedBlock) {
          modifiedLines = [];
          inModifiedBlock = true;
        }
        modifiedLines.push(line.substring(1));
        endLine++;
      } else {
        endLine++;
        inModifiedBlock = false;
      }
    }

    if (startLine === -1 || endLine === -1 || modifiedLines.length === 0) {
      return null;
    }

    const lines = contents.split('\n');
    const functionLines: string[] = [];

    for (let i = startLine; i <= endLine; i++) {
      functionLines.push(lines[i]);
    }

    return functionLines.join('\n');
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

      // Only read the files under the specified root directory and the specified status
      if (
        !readGitStatus.includes(status) ||
        !filePath.startsWith(`${readRootName}/`)
      ) {
        return acc;
      }

      const fullPath = path.join(process.cwd(), filePath);
      const contents = fs.readFileSync(fullPath, 'utf-8');

      if (status !== 'M') {
        return [...acc, { filePath: fullPath, fileContent: contents }];
      }

      const modifiedContents =
        this.extractModifiedFunction(fullPath, contents) || '';
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
