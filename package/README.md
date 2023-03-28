# huskygpt

`huskygpt` is a command line tool that generates test cases using the OpenAI API. It is designed to help developers automate the process of generating test cases for their code.


## Installation

To huskygpt, run the following command:

```
npm install -g huskygpt
```

## Usage

To generate test cases, run the following command:
```
huskygpt -k <YOUR_OPENAI_KEY>
```

Replace `<key>` with your OpenAI API key, `<model>` with the OpenAI model to use, `<extension>` with the file extension for the generated test files, `<type>` with the type of test file to read (dir or git), and `<name>` with the name of the directory to read the test files from.

For example, to generate test cases using the `text-davinci-002` model, with a maximum of 2048 tokens, and to read test files from the `src` directory, run the following command:

```
huskygpt --api-key <YOUR_OPENAI_KEY> --model text-davinci-002 --max-tokens 2048 --test-file-extension js --test-file-read-type dir --test-file-read-dir-name src
```

## Options

The following options are available:

- `-k, --api-key <key>`: Set the OpenAI API key (required)
- `-m, --model <model>`: OpenAI model to use (default: `text-davinci-003`)
- `-p, --prompt <prompt>`, 'OpenAI additional prompt string
- `-e, --test-file-extension <extension>`: Generate Test file extension (default: `ts`)
- `-t, --test-file-read-type <type>`: Read test file type, dir or git (default: `git`)
- `-d, --test-file-read-dir-name <name>`: Read test file dir name (default: `src`)

## Note
If there are `env` or `env.local` files in the project, the `OPENAI_API_KEY` will be read from the file, and the `-k` parameter will be ignored. And other parameters are also the same.

## License

This tool is licensed under the MIT License. See the `LICENSE` file for more information.
