# huskygpt

`huskygpt` is a command line tool that generates unit tests or reviews code using the OpenAI API. It is designed to help developers automate the process of generating test cases for their code.

## Installation

To install `huskygpt`, run the following command:
```
npm install -g huskygpt
```

## Usage

To generate unit tests or review code, run the following command:
```
huskygpt test --api-key --model text-davinci-002 --max-tokens 2048 --file-extensions .ts,.tsx --read-type dir --read-dir-name src --test-file-type test --test-file-extension .ts --test-file-dir-name tests
```

huskygpt [options]
Replace `<runType>` with either `test` or `review`, depending on whether you want to generate unit tests or review code. The following options are available:

- `-k, --api-key <key>`: Set the OpenAI API key
- `-m, --model <model>`: OpenAI model to use
- `-p, --prompt <prompt>`: OpenAI prompt to use
- `-t, --max-tokens <tokens>`: OpenAI max tokens to use
- `-e, --file-extensions <extensions>`: File extensions to read, example: `.ts,.tsx`
- `-r, --read-type <type>`: Read files from directory or git stage, example: `dir` or `git`
- `-d, --read-dir-name <name>`: Root name of the directory to read files from, example: `src`
- `-f, --test-file-type <type>`: Generate test file type, example: `test` or `spec`
- `-x, --test-file-extension <extension>`: Generate test file name extension, example: `.ts` or `.js`
- `-n, --test-file-dir-name <name>`: Generate test file directory name, example: `__tests__`

For example, to generate unit tests using the `text-davinci-002` model, with a maximum of 2048 tokens, and to read test files from the `src` directory, run the following command:

## Note

If there are `env` or `env.local` files in the project, the `OPENAI_API_KEY` will be read from the file, and the `-k` parameter will be ignored. And other parameters are also the same.

## License

This tool is licensed under the MIT License. See the `LICENSE` file for more information.
