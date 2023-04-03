#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

import { main } from '../build/index.js';

const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), './package.json'), 'utf8'),
);
const program = new Command();

program
  .version(packageJson.version, '-v, --version', 'output the current version')
  .description('Generate unit tests or review your code by chatgpt 4')
  .argument('<runType>', 'run type: test or review')
  .option('-k, --api-key <key>', 'Set the OpenAI API key')
  .option(
    '-t, --openai-session-token <token>',
    "OpenAI session token, 2 step to get token, If you don't set this, will use OPENAI_API_KEY, will cause fee by api key",
  )
  .option(
    '-pu, --openai-proxy-url <url>',
    'Proxy URL to use for OpenAI API requests',
  )
  .option('-m, --model <model>', 'OpenAI model to use')
  .option('-p, --prompt <prompt>', 'OpenAI prompt to use')
  .option('-mt, --max-tokens <tokens>', 'OpenAI max tokens to use')
  .option(
    '-e, --file-extensions <extensions>',
    'File extensions to read, example: .ts,.tsx',
  )
  .option(
    '-r, --read-type <type>',
    'Read files from directory or git stage, example: dir or git',
  )
  .option(
    '-s, --read-git-status <name>',
    'Read files from git stage by status default: A,R,M',
  )
  .option(
    '-d, --read-dir-name <name>',
    'Root name of the directory to read files from, example: src',
  )
  .option(
    '-f, --test-file-type <type>',
    'Generate test file type, example: test or spec',
  )
  .option(
    '-x, --test-file-extension <extension>',
    'Generate test file name extension, example: .ts or .js',
  )
  .option(
    '-n, --test-file-dir-name <name>',
    'Generate test file directory name, example: __tests__',
  )
  .option(
    '-o, --test-file-overwrite <value>',
    'Generate test file overwrite, default is true',
  )
  .option(
    '-w, --review-report-webhook <url>',
    'Webhook URL to send review report',
  )
  .action((runType, options) => {
    const userOptions = {
      huskyGPTType: runType === 'test' ? 'test' : 'review',
      reviewTyping: options.reviewTyping,
      ...(options.apiKey && { openAIKey: options.apiKey }),
      ...(options.model && { openAIModel: options.model }),
      ...(options.prompt && { openAIPrompt: options.prompt }),
      ...(options.maxTokens && { openAIMaxTokens: Number(options.maxTokens) }),
      ...(options.fileExtensions && {
        readFileExtensions: options.fileExtensions,
      }),
      ...(options.readType && { readType: options.readType }),
      ...(options.readGitStatus && { readGitStatus: options.readGitStatus }),
      ...(options.readDirName && { readFilesRootName: options.readDirName }),
      ...(options.testFileType && { testFileType: options.testFileType }),
      ...(options.testFileExtension && {
        testFileNameExtension: options.testFileExtension,
      }),
      ...(options.testFileDirName && {
        testFileDirName: options.testFileDirName,
      }),
      ...(options.reviewReportWebhook && {
        reviewReportWebhook: options.reviewReportWebhook,
      }),
      ...(options.openAISessionToken && {
        openAISessionToken: options.openAISessionToken,
      }),
      ...(options.openAIProxyUrl && {
        openAIProxyUrl: options.openAIProxyUrl,
      }),
      ...(options.testFileOverwrite && {
        testFileOverwrite: options.testFileOverwrite,
      }),
    };

    main(userOptions);
  });

program.parse(process.argv);
