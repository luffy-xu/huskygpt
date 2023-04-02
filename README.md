# huskygpt
Auto Review your code or Auto generate unit tests by OpenAI api gpt3.5 (GPT-4)

## Demo
- `huskygpt review`: Review your code using the OpenAI API
  ![huskygpt-review](https://user-images.githubusercontent.com/105559892/229142794-a85a024c-faff-46cf-8de5-839aff983d9f.gif)
- `huskygpt test`: Generates unit test using the OpenAI API
  ![huskygpt-test](https://user-images.githubusercontent.com/105559892/229142867-fb5768dc-d2d6-429c-8a20-b2adec087b6d.gif)

## Key Features
- 🤖 Generates unit test using the OpenAI API
- 🤖 Review your code using the OpenAI API
- 🧠 Supports multiple OpenAI models and customizing the prompt
- 📂 Supports reading test files from `directories` or `git staged files`
- 🍺 Only pick up the `functions` or `class` code to OpenAI api for `security` and low `cost`
- 💻 Supports typing review comments in the terminal


## Installation
To install `huskygpt`, run the following command:
```
npm install -g huskygpt
```

## Configuration
1. Set the [OpenAI API key](https://platform.openai.com/account/api-keys) by npm config set -g
    ```
    npm config set OPENAI_API_KEY <YOUR_OPENAI_KEY> -g
    ```
## Usage
- Run the following command to review your git staged files:
  ```
  huskygpt review --model gpt-3.5-turbo --max-tokens 2048
  ```
- Run the following command to generate unit tests:
  ```
  huskygpt test --model gpt-3.5-turbo --max-tokens 2048 --file-extensions .ts,.tsx --read-type dir --read-dir-name src --test-file-type test --test-file-extension .ts --test-file-dir-name tests
  ```


huskygpt [options]
Replace `<runType>` with either `test` or `review`, depending on whether you want to generate unit tests or review code. The following options are available:

- `-k, --api-key <key>`: Set the [OpenAI API key](https://platform.openai.com/account/api-keys
)
- `-m, --model <model>`: [OpenAI model](https://platform.openai.com/docs/models/overview
) to use
- `-p, --prompt <prompt>`: OpenAI prompt to use
- `-t, --max-tokens <tokens>`: OpenAI max tokens to use
- `-e, --file-extensions <extensions>`: File extensions to read, example: `.ts,.tsx`
- `-r, --read-type <type>`: Read files from directory or git stage, example: `dir` or `git`
- `-s, --read-git-status <name>`: Read files from git stage by status default: `A,R,M`
- `-d, --read-dir-name <name>`: Root name of the directory to read files from, example: `src`
- `-f, --test-file-type <type>`: Generate test file type, example: `test` or `spec`
- `-x, --test-file-extension <extension>`: Generate test file name extension, example: `.ts` or `.js`
- `-n, --test-file-dir-name <name>`: Generate test file directory name, example: `__tests__`
- `-w, --review-report-webhook <url>`: Webhook URL to send review result to your channel, execute example:
    ```bash
    execSync(`curl -i -X POST -H 'Content-Type: application/json' -d '{ "tag": "markdown", "markdown": {"content": "${content}"}}}' ${webhook}`);
    ```
- `-h, --help`: Display help for command
- `-y, --review-typing <value>`: Enable or disable review typing in console, default: true


## Note
1. Also can set all options in [.env](https://github.com/luffy-xu/huskygpt/blob/main/.env), that will be used as default options.
1. Command options will override the default options.
1. Webhook currently only test in `seaTalk`, if other channel need to use, please rise `PR` by yourself or ask [me](swhd0501@gmail.com) for help.

