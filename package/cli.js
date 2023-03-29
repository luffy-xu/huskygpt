#!/usr/bin/env node

const { Command } = require('commander');
const { main } = require('./lib/index');
const packageJson = require('./package.json');

const program = new Command();

program
  .version(packageJson.version, '-v, --version', 'output the current version')
  .description('Generate unit tests or review your code by openai gpt')
  .argument('<runType>', 'run type: test or review')
  .option('-k, --api-key <key>', 'Set the OpenAI API key')
  .option('-m, --model <model>', 'OpenAI model to use')
  .option('-p, --prompt <prompt>', 'OpenAI prompt to use')
  .option('-t, --max-tokens <tokens>', 'OpenAI max tokens to use')
  .option(
    '-e, --file-extensions <extensions>',
    'File extensions to read, example: .ts,.tsx'
  )
  .option(
    '-r, --read-type <type>',
    'Read files from directory or git stage, example: dir or git'
  )
  .option(
    '-d, --read-dir-name <name>',
    'Root name of the directory to read files from, example: src'
  )
  .option(
    '-f, --test-file-type <type>',
    'Generate test file type, example: test or spec'
  )
  .option(
    '-x, --test-file-extension <extension>',
    'Generate test file name extension, example: .ts or .js'
  )
  .option(
    '-n, --test-file-dir-name <name>',
    'Generate test file directory name, example: __tests__'
  )
  .action((runType, options) => {
    const userOptions = {
      huskyGPTType: runType === 'test' ? 'test' : 'review',
      ...(options.apiKey && { openAIKey: options.apiKey }),
      ...(options.model && { openAIModel: options.model }),
      ...(options.prompt && { openAIPrompt: options.prompt }),
      ...(options.maxTokens && { openAIMaxTokens: Number(options.maxTokens) }),
      ...(options.fileExtensions && {
        readFileExtensions: options.fileExtensions,
      }),
      ...(options.readType && { readType: options.readType }),
      ...(options.readDirName && { readFilesRootName: options.readDirName }),
      ...(options.testFileType && { testFileType: options.testFileType }),
      ...(options.testFileExtension && {
        testFileNameExtension: options.testFileExtension,
      }),
      ...(options.testFileDirName && {
        testFileDirName: options.testFileDirName,
      }),
    };

    main(userOptions);
  });

program.parse(process.argv);
