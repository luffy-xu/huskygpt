import { IReadFileResult } from 'src/types';

import { ExtractCodePrompts } from '../extract-code-prompts';
import {
  functionString,
  multipleFunctionString,
  noFunctionString,
} from './__mock__/test-data';

const emptyReg = /[\n\s]+/g;

describe('ExtractCodePrompts', () => {
  let extractCodePrompts: ExtractCodePrompts;

  beforeEach(() => {
    extractCodePrompts = new ExtractCodePrompts();
  });

  it('should return an empty array when no functions or classes found', () => {
    const readFileResult: IReadFileResult = {
      fileContent: noFunctionString,
      filePath: '/test/path',
    };

    const result =
      extractCodePrompts.extractFunctionOrClassCodeArray(readFileResult);

    expect(result).toEqual([]);
  });

  it('should return an array with the extracted function code when a function is found', () => {
    const readFileResult: IReadFileResult = {
      fileContent: functionString,
      filePath: '/test/path',
    };

    const result =
      extractCodePrompts.extractFunctionOrClassCodeArray(readFileResult);

    const normalizedResult = result.map((code) => code.replace(emptyReg, ' '));

    expect(normalizedResult).toEqual([functionString]);
  });

  it('should return an array with the extracted function code when multiple function is found', () => {
    const readFileResult: IReadFileResult = {
      fileContent: multipleFunctionString,
      filePath: '/test/path',
    };

    const result =
      extractCodePrompts.extractFunctionOrClassCodeArray(readFileResult);

    expect(result.length).toEqual(6);
  });

  // Add more test cases for classes and variable declarations with functions or arrow functions.
});
