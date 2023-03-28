#!/usr/bin/env node

const { Command } = require('commander');
const { main } = require('./lib/index');
const packageJson = require('./package.json');

const program = new Command();

program
  .version(packageJson.version, '-v, --version', 'output the current version')
  .description('Generate test cases by openai gpt')
  .option('-k, --api-key <key>', 'Set the OpenAI API key')
  .option('-m, --model <model>', 'OpenAI model to use')
  .option('-p, --prompt <prompt>', 'OpenAI additional prompt string')
  .option(
    '-e, --test-file-extension <extension>',
    'Generate Test file extension, default is ts'
  )
  .option('-t, --test-file-read-type <type>', 'Read test file type, dir or git')
  .option(
    '-d, --test-file-read-dir-name <name>',
    'Read test file dir name, default is src'
  )
  .action((options) => {
    if (options.apiKey) {
      process.env.OPENAI_API_KEY = options.apiKey;
    }
    if (options.model) {
      process.env.OPENAI_MODEL = options.model;
    }
    if (options.prompt) {
      process.env.OPENAI_PROMPT = options.prompt;
    }
    if (options.maxTokens) {
      process.env.OPENAI_MAX_TOKENS = options.maxTokens;
    }
    if (options.testFileExtension) {
      process.env.TEST_FILE_EXTENSION = options.testFileExtension;
    }
    if (options.testFileReadType) {
      process.env.TEST_FILE_READ_TYPE = options.testFileReadType;
    }
    if (options.testFileReadDirName) {
      process.env.TEST_FILE_READ_DIR_NAME = options.testFileReadDirName;
    }

    main();
  });

program.parse(process.argv);
