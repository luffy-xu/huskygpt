import { userOptions } from '../constant';
import { IReadFileResult } from '../types';
import { huskyGPTTypeMap } from './constant';

export const generatePrompt = (fileResult: IReadFileResult): string[] => {
  const huskyGPTType = userOptions.huskyGPTType;

  if (!fileResult) throw new Error('File path is required for generatePrompt');
  if (!huskyGPTTypeMap[huskyGPTType])
    throw new Error('Invalid huskyGPTType: ' + huskyGPTType);

  /**
   * Return the prompt for the OpenAI API request as a string
   */
  return huskyGPTTypeMap[huskyGPTType](fileResult);
};
