# huskygpt
Auto Review your code or Auto generate unit tests by OpenAI api gpt3.5 (GPT-4)

## Demo
- `huskygpt review`: Review your code using the OpenAI API
  ![huskygpt-review](https://user-images.githubusercontent.com/105559892/229581059-184a3ecd-3c08-424e-b449-fdcb9feb00bb.gif)
- `huskygpt test`: Generates unit test using the OpenAI API
  ![huskygpt-test](https://user-images.githubusercontent.com/105559892/229142867-fb5768dc-d2d6-429c-8a20-b2adec087b6d.gif)

## Key Features
- 🤖 Generates unit test using the OpenAI API
- 🤖 Review your code using the OpenAI API
- ✨ No API key needed, just set the `OpenAI Session Token` for free using chatgpt-3.5 or gpt-4 (Plus Account)
- ✨ Only pick up the `functions` or `class` code to OpenAI api for `security` and `low cost`
- 🧠 Supports multiple OpenAI models and customizing the prompt
- 📂 Supports reading test files from `directories` or `git staged files`


## Installation
To install `huskygpt`, run the following command:
```
npm install -g huskygpt
```

## Configuration
1. Set the `OpenAI Session Token` for free using chatgpt
    - OpenAI session token, 2 setp to get token
    - If you don't set this, will use OPENAI_API_KEY, will cause fee by api key
    1. visit https://chat.openai.com/chat and login
    2. Visit https://chat.openai.com/api/auth/session to get token
    ```bash
    npm config set OPENAI_SESSION_TOKEN <YOUR_OPENAI_SESSION_TOKEN> -g
    ```
1. Set the [OpenAI API key](https://platform.openai.com/account/api-keys) by npm config set -g
    ```
    npm config set OPENAI_API_KEY <YOUR_OPENAI_KEY> -g
    ```

## Usage
- Run the following command to review your git staged files:
  ```
  huskygpt review --model gpt-4 --max-tokens 2048
  ```
- Run the following command to generate unit tests:
  ```
  huskygpt test --model gpt-3.5-turbo --max-tokens 2048 --file-extensions .ts,.tsx --read-type dir --read-dir-name src --test-file-type test --test-file-extension .ts --test-file-dir-name tests
  ```

### Options

- `-k, --api-key <key>`: Set the OpenAI API key.
- `-t, --openai-session-token <token>`: OpenAI session token, 2 step to get token, If you don't set this, will use OPENAI_API_KEY, will cause fee by api key.
- `-pu, --openai-proxy-url <url>`: Proxy URL to use for OpenAI API requests.
- `-m, --model <model>`: OpenAI model to use.
- `-p, --prompt <prompt>`: OpenAI prompt to use.
- `-mt, --max-tokens <tokens>`: OpenAI max tokens to use.
- `-e, --file-extensions <extensions>`: File extensions to read, example: .ts,.tsx.
- `-r, --read-type <type>`: Read files from directory or git stage, example: dir or git.
- `-s, --read-git-status <name>`: Read files from git stage by status default: A,R,M.
- `-d, --read-dir-name <name>`: Root name of the directory to read files from, example: src.
- `-f, --test-file-type <type>`: Generate test file type, example: test or spec.
- `-x, --test-file-extension <extension>`: Generate test file name extension, example: .ts or .js.
- `-n, --test-file-dir-name <name>`: Generate test file directory name, example: __tests__.
- `-o, --test-file-overwrite <value>`: Generate test file overwrite, default is true.
- `-w, --review-report-webhook <url>`: Webhook URL to send review report.


## Note
1. Also can set all options in `.env` or `.env.local`, that will be used as default options. Command options will override the default options.
1. Webhook currently only test in `seaTalk`, if other channel need to use, please rise `PR` by yourself or ask [me](swhd0501@gmail.com) for help.

