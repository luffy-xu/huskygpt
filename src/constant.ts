import path from 'path';
import { CreateCompletionRequest } from 'openai';
import { config } from 'dotenv';
import { HuskyGPTTypeEnum, ReadTypeEnum, IUserOptions } from './types';
import { execSync } from 'child_process';

export const OPENAI_API_KEY_NAME = 'OPENAI_API_KEY';
export const OPENAI_SESSION_TOKEN_NAME = 'OPENAI_SESSION_TOKEN';

class UserOptionsClass {
  options: IUserOptions;

  private userOptionsDefault: IUserOptions = {
    huskyGPTType: HuskyGPTTypeEnum.Review,
    openAIModel: 'text-davinci-003',
    openAIMaxTokens: 2048,
    readType: ReadTypeEnum.GitStage,
    readGitStatus: 'R, M, A',
    readFilesRootName: 'src',
    readFileExtensions: '.ts,.tsx',
    testFileType: 'test',
    testFileNameExtension: '.ts',
    testFileDirName: '__test__',
    reviewReportWebhook: '',
    reviewTyping: 'true',
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

  // get open AI key from npm config
  getOpenAIKeyFromNpmConfig(key = OPENAI_SESSION_TOKEN_NAME): string {
    try {
      return execSync(`npm config get ${key}`).toString().trim();
    } catch (error) {
      return '';
    }
  }

  /**
   * Get OpenAI API key
   * @example
   * @returns 'sk-1234567890'
   */
  get openAIKey(): string {
    if (!this.options.openAIKey) {
      this.options.openAIKey =
        this.getOpenAIKeyFromNpmConfig(OPENAI_API_KEY_NAME);
    }

    if (!this.options.openAIKey) throw new Error('openAIKey is not set');

    if (process.env.DEBUG)
      console.log(`openAI key: "${this.options.openAIKey}"`);

    return this.options.openAIKey;
  }

  /**
   * Get OpenAI session token
   */
  get openAISessionToken(): string {
    if (!this.options.openAISessionToken) {
      this.options.openAISessionToken = this.getOpenAIKeyFromNpmConfig();
    }

    if (process.env.DEBUG)
      console.log(`openAI key: "${this.options.openAISessionToken}"`);

    return this.options.openAISessionToken;
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
  ): IUserOptions {
    return {
      openAIKey: processEnv.OPENAI_API_KEY,
      openAISessionToken: processEnv.OPENAI_SESSION_TOKEN,
      openAIModel:
        processEnv.OPENAI_MODEL || this.userOptionsDefault.openAIModel,
      openAIMaxTokens: Number(
        processEnv.OPENAI_MAX_TOKENS || this.userOptionsDefault.openAIMaxTokens
      ),
      /**
       * Read file options
       */
      readType:
        (processEnv.READ_TYPE as ReadTypeEnum) ||
        this.userOptionsDefault.readType,
      readGitStatus:
        processEnv.READ_GIT_STATUS || this.userOptionsDefault.readGitStatus,
      readFilesRootName:
        processEnv.READ_FILES_ROOT_NAME ||
        this.userOptionsDefault.readFilesRootName,
      readFileExtensions:
        processEnv.READ_FILE_EXTENSIONS ||
        this.userOptionsDefault.readFileExtensions,
      /**
       * Test file options
       */
      testFileType:
        processEnv.TEST_FILE_TYPE || this.userOptionsDefault.testFileType,
      testFileNameExtension:
        processEnv.TEST_FILE_NAME_EXTENSION ||
        this.userOptionsDefault.testFileNameExtension,
      testFileDirName:
        processEnv.TEST_FILE_DIR_NAME ||
        this.userOptionsDefault.testFileDirName,
      /**
       * Review options
       */
      reviewReportWebhook: processEnv.REVIEW_REPORT_WEBHOOK,
      reviewTyping:
        processEnv.REVIEW_TYPING || this.userOptionsDefault.reviewTyping,
    };
  }

  /**
   * Initialize the user options
   */

  public init(userOptions: IUserOptions = {}) {
    // Read the .env file
    config();
    config({ path: path.join(process.cwd(), '.env.local') });
    const envUserOptions = this.convertProcessEnvToUserOptions(process.env);

    if (process.env.DEBUG) {
      console.log('envUserOptions: ', envUserOptions);
      console.log('userOptions: ', userOptions);
    }

    this.options = Object.assign(
      {},
      this.userOptionsDefault,
      envUserOptions,
      userOptions
    );
  }
}

export const userOptions = new UserOptionsClass();

/**
 * The parameters for the OpenAI API request
 */
export const completionParams: Partial<CreateCompletionRequest> = {
  temperature: 0.2,
  top_p: 0.4,
  n: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: ['###'],
};

/**
 * Review result configs
 */
export const codeBlocksRegex = /```([\s\S]*?)```/g;

// Write the output text to a file if there are code blocks
export const reviewFileName = '.huskygpt_review.md';
