import path from 'path';
import { CreateCompletionRequest } from 'openai';
import { config } from 'dotenv';

// Read the .env file
config();
config({ path: path.join(process.cwd(), '.env.local') });

/**
 * The file extensions to search for
 */
export const testDirPath = path.join(process.cwd(), 'src');
export const testFileExtensions = ['.ts', '.tsx'];
export const TEST_DIR_NAME = '__test__';
export const TEST_FILE_NAME = '.test';
export const TEST_FILE_NAME_EXTENSION = `${TEST_FILE_NAME}.${
  process.env.TEST_FILE_EXTENSION || 'js'
}`;

/**
 * The parameters for the OpenAI API request
 */
export const completionParams: CreateCompletionRequest = {
  model: process.env.OPENAI_MODEL || 'text-davinci-003',
  max_tokens: Number(process.env.OPENAI_MAX_TOKENS) || 100,
  temperature: 0,
  top_p: 1,
  n: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: ['###'],
};
