import path from 'path';
import { CreateCompletionRequest } from 'openai';
import { config } from 'dotenv';

// Read the .env file
config();
config({ path: path.join(process.cwd(), '.env.local') });

export const TEST_DIR_NAME = '__test__';
export const TEST_FILE_NAME = '.test';
export const readRootName = process.env.TEST_FILE_READ_DIR_NAME || 'src';
export const testDirPath = path.join(process.cwd(), readRootName);
export const testFileExtensions = ['.ts', '.tsx'];
export const testFileNameExtension = `${TEST_FILE_NAME}.${
  process.env.TEST_FILE_EXTENSION || 'ts'
}`;

/**
 * The file extensions to search for
 * @enum {string}
 * @property {string} Directory - Read test files from directory
 * @property {string} GitStage - Read test files from git stage
 * @readonly
 * @type {ReadTypeEnum}
 * @default 'dir'
 */
export enum ReadTypeEnum {
  Directory = 'dir',
  GitStage = 'git',
}
export const testFileReadType =
  (process.env.TEST_FILE_READ_TYPE as ReadTypeEnum) || ReadTypeEnum.Directory;

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
