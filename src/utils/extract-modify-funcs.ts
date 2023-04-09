import { execSync } from 'child_process';

class GitDiffExtractor {
  /**
   * Retrieves the git diff output for the specified file path.
   * @param filePath - The file path to retrieve the git diff output for.
   * @returns The git diff output as a string.
   */
  private getGitDiffOutput(filePath: string): string {
    return execSync(`git diff --cached ${filePath}`).toString();
  }

  /**
   * Gets the line numbers of the modified lines in the git diff output.
   * @param diffLines - The git diff output lines.
   * @returns An array of modified line numbers.
   */
  private getModifiedLineNumbers(diffLines: string[]): number[] {
    const modifiedLineNumbers: number[] = [];
    let currentLineNumber = 0;

    for (const line of diffLines) {
      if (line.startsWith('@@ ')) {
        const match = line.match(/\+(\d+)/);
        if (match) {
          currentLineNumber = parseInt(match[1], 10) - 1;
        }
      } else if (
        line.startsWith('+') &&
        !line.startsWith('++') &&
        !line.startsWith('@@')
      ) {
        modifiedLineNumbers.push(currentLineNumber);
        currentLineNumber++;
      } else if (!line.startsWith('-')) {
        currentLineNumber++;
      }
    }

    return modifiedLineNumbers;
  }

  /**
   * Extracts a code block containing a function or class from the specified line number.
   * @param lines - The lines of the target file.
   * @param lineNumber - The line number of the modified line.
   * @returns The extracted code block as a string or null if not found.
   */
  private extractCodeBlock(lines: string[], lineNumber: number): string | null {
    let startLine = lineNumber;
    let endLine = lineNumber;
    const blockPattern =
      /^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function\b|class\b|.*=>|\(.*\)\s*=>|\(\s*\)\s*=>)/;
    const classPattern = /^\s*(?:export\s+)?(?:default\s+)?class\b/;

    // Search for the beginning of a code block (function, class, or arrow function)
    while (startLine >= 0 && !lines[startLine].match(blockPattern)) {
      startLine--;
    }

    // If the code block is a class, set the endLine to the closing brace of the class
    if (lines[startLine] && lines[startLine].match(classPattern)) {
      endLine = this.findClosingBrace(lines, startLine);
    } else {
      let openBraces = 0;

      for (let i = startLine; i < lines.length; i++) {
        const line = lines[i];
        openBraces += this.countChar(line, '{');
        openBraces -= this.countChar(line, '}');

        if (openBraces === 0) {
          endLine = i;
          break;
        }
      }
    }

    if (startLine < 0 || endLine >= lines.length || !lines[startLine]) {
      return null;
    }

    return lines.slice(startLine, endLine + 1).join('\n');
  }

  /**
   * Finds the line number of the closing brace of a class.
   * @param lines - The lines of the target file.
   * @param startLine - The line number of the opening brace of the class.
   * @returns The line number of the closing brace of the class.
   */
  private findClosingBrace(lines: string[], startLine: number): number {
    let openBraces = 0;

    for (let i = startLine; i < lines.length; i++) {
      const line = lines[i];
      openBraces += this.countChar(line, '{');
      openBraces -= this.countChar(line, '}');

      if (openBraces === 0) {
        return i;
      }
    }

    return lines.length - 1;
  }

  /**
   * Counts the occurrences of a specific character in a string.
   * @param line - The string to search for the character in.
   * @param char - The character to count occurrences of.
   * @returns The number of occurrences of the character in the string.
   */
  private countChar(line: string, char: string): number {
    return line?.split(char).length - 1 || 0;
  }

  /**
   * Checks if the specified code block is contained in any of the existing code blocks.
   */
  private isCodeBlockContainedInExistingBlocks(
    codeBlock: string,
    existingBlocks: string[],
  ): boolean {
    for (const existingBlock of existingBlocks) {
      if (existingBlock.includes(codeBlock)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Adds the specified code block to the array of extracted code blocks if it is not already contained in the array.
   */
  private addCodeBlockIfNotContained(blocks: string[], newBlock: string): void {
    if (
      !this.isCodeBlockContainedInExistingBlocks(newBlock, blocks) &&
      !blocks.includes(newBlock)
    ) {
      blocks.push(newBlock);
    }
  }

  /**
   * Extracts the modified functions from the specified file.
   */
  public extractModifiedFunction(
    filePath: string,
    contents: string,
  ): string | null {
    const diffOutput = this.getGitDiffOutput(filePath);
    const diffLines = diffOutput?.split('\n');
    if (!diffLines || !contents) return null;

    const modifiedLineNumbers = this.getModifiedLineNumbers(diffLines);
    if (modifiedLineNumbers.length === 0) return null;

    const lines = contents.split('\n');
    const extractedCodeBlocks: string[] = [];

    for (const lineNumber of modifiedLineNumbers) {
      const codeBlock = this.extractCodeBlock(lines, lineNumber);
      if (codeBlock) {
        this.addCodeBlockIfNotContained(extractedCodeBlocks, codeBlock);
      }
    }

    return extractedCodeBlocks.join('\n\n');
  }
}

export default GitDiffExtractor;
