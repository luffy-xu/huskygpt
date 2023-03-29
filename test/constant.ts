import path from 'path';
import { CreateCompletionRequest } from 'openai';
import { config } from 'dotenv';
import { HuskyGPTTypeEnum, ReadTypeEnum, UserOptions } from './types';

// Read the .env file
config();
config({ path: path.join(process.cwd(), '.env.local') });

class UserOptionsClass {
  options: UserOptions;

  constructor(userOptions: UserOptions = {}) {
    this.options = {
      ...this.userOptionsDefault,
      ...userOptions,
    };
  }

  private readonly userOptionsDefault: UserOptions = {
    huskyGPTType: HuskyGPTTypeEnum.Review,
    openAIModel: 'text-davinci-003',
    openAIMaxTokens: 2048,
    readType: ReadTypeEnum.Directory,
    readFilesRootName: 'src',
    readFileExtensions: '.ts,.tsx',
    testFileType: 'test',
    testFileNameExtension: '.ts',
    testFileDirName: '__test__',
  };

  /**
   * Get huskygpt run type
   * @example
   * // returns 'test'
   */
  get huskyGPTType(): HuskyGPTTypeEnum {
    if (!this.options.huskyGPTType) throw new Error('huskyGPTType is not set');
    return this.options.huskyGPTType;
  }

  /**
   * Get OpenAI API key
   * @example
   * // returns 'sk-1234567890'
   */
  get openAIKey(): string {
    if (!this.options.openAIKey) throw new Error('openAIKey is not set');
    return this.options.openAIKey;
  }

  /**
   * Get OpenAI options
   */
  get openAIOptions(): CreateCompletionRequest {
    if (!this.options.openAIModel) throw new Error('openAIModel is not set');

    return {
      model: this.options.openAIModel,
      max_tokens: this.options.openAIMaxTokens,
    };
  }

  /**
   * Get the root directory path to read files from
   * @example
   * // returns '/Users/username/project/src'
   */
  get readFilesRoot(): string {
    if (!this.options.readFilesRootName)
      throw new Error('readFilesRootName is not set');
    return path.join(process.cwd(), this.options.readFilesRootName);
  }

  /**
   * Get the file extensions to read
   * @example
   * // returns ['.ts', '.tsx']
   */
  get readFilesExtensions(): string[] {
    if (!this.options.readFileExtensions)
      throw new Error('readFileExtensions is not set');
    return this.options.readFileExtensions.split(',');
  }

  /**
   * File read type, either 'dir' or 'git'
   * @example
   * // returns 'dir'
   */
  get readFileType(): ReadTypeEnum {
    if (!this.options.readType) throw new Error('readType is not set');
    return this.options.readType;
  }

  /**
   * Get the file name suffix to use for test files
   * @example
   * // returns '.test.ts'
   */
  get testFileNameSuffix(): string {
    return `.${this.options.testFileType}${this.options.testFileNameExtension}`;
  }

  /**
   * Convert the process.env to user options
   */
  private convertProcessEnvToUserOptions(
    processEnv: NodeJS.ProcessEnv
  ): UserOptions {
    return {
      /**
       * OpenAI options
       */
      openAIKey: processEnv.OPENAI_API_KEY,
      openAIModel: processEnv.OPENAI_MODEL,
      openAIMaxTokens: Number(processEnv.OPENAI_MAX_TOKENS),
      /**
       * Read file options
       */
      readType: processEnv.READ_TYPE as ReadTypeEnum,
      readFilesRootName: processEnv.READ_FILES_ROOT_NAME,
      readFileExtensions: processEnv.READ_FILE_EXTENSIONS,
      /**
       * Test file options
       */
      testFileType: processEnv.TEST_FILE_TYPE,
      testFileNameExtension: processEnv.TEST_FILE_NAME_EXTENSION,
      testFileDirName: processEnv.TEST_FILE_DIR_NAME,
    };
  }

  /**
   * Update the user options
   */
  public updateOptions(userOptions?: UserOptions) {
    if (!userOptions) return;

    this.options = {
      ...this.options,
      ...userOptions,
    };
  }

  public updateOptionsFromProcessEnv(processEnv: NodeJS.ProcessEnv) {
    const userOptions = this.convertProcessEnvToUserOptions(processEnv);
    this.updateOptions(userOptions);
  }
}

export const userOptions = new UserOptionsClass();
userOptions.updateOptionsFromProcessEnv(process.env);

/**
 * The parameters for the OpenAI API request
 */
export const completionParams: Partial<CreateCompletionRequest> = {
  temperature: 0,
  top_p: 1,
  n: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: ['###'],
};
