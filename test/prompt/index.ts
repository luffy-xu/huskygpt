import { huskyGPTType } from '../constant';
import { huskyGPTTypeMap } from './constant';

export const generatePrompt = (filePath: string): string => {
  if (!filePath) throw new Error('File path is required for generatePrompt');
  if (!huskyGPTTypeMap[huskyGPTType])
    throw new Error('Invalid huskyGPTType: ' + huskyGPTType);

  /**
   * Return the prompt for the OpenAI API request as a string
   */
  return huskyGPTTypeMap[huskyGPTType](filePath);
};
