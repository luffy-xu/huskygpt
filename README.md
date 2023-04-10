# huskygpt
> Node.js CLI tools for `auto review` your code or `auto generate` unit tests by OpenAI `chatgpt3.5` and `GPT-4` Plus Account! ✅

[![NPM](https://img.shields.io/npm/v/huskygpt.svg)](https://www.npmjs.com/package/huskygpt)  [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Demo
- 🤖 Generate unit tests by gpt-4 model:
![huskygpt-unit-test](https://user-images.githubusercontent.com/105559892/229816192-1cc2c885-b298-41be-9114-7b6b5b2195e8.gif)
- ✨ The unit test result:
![format-test](https://user-images.githubusercontent.com/105559892/229817346-66e272ff-e12a-4d6f-9100-fe445ddd79f1.png)


## Key Features
- 🤖 `AI`: AI-powered code review and unit test generation
- ✨ `Free`: Free to use with an `OpenAI Session Token`, enjoy chatgpt-3.5 or gpt-4 (Plus Account).
- 🛡️ `Security`: Security-conscious function and class extraction, customize your `SECURITY_REGEX`.
- 🧠 `Customizing`: Customizable prompts and model selection
- 📂 `File Reader`: Supports reading files from `directories` or `git staged files`.


## Installation
To install `huskygpt`, run the following command:
```
npm install -g huskygpt
```

## Configuration
### OpenAI Key (Choose one)
- ✅ Set the `OpenAI Session Token` for free using chatgpt
    - OpenAI session token, 2 setp to get token
    - If you don't set this, will use OPENAI_API_KEY, will cause fee by api key
    1. visit https://chat.openai.com/chat and login
    2. Visit https://chat.openai.com/api/auth/session to get token
    ```bash
    npm config set OPENAI_SESSION_TOKEN <YOUR_OPENAI_SESSION_TOKEN> -g
    ```
- Set the [OpenAI API Key](https://platform.openai.com/account/api-keys) by npm config set -g
    ```
    npm config set OPENAI_API_KEY <YOUR_OPENAI_KEY> -g
    ```
| Method                      | Free?  | Robust?  | Quality?                |
| --------------------------- | ------ | -------- | ----------------------- |
| `OpenAI Session Token`      | ✅ Yes  | ☑️ Maybe   | ✅️ Real ChatGPT  |
| `OpenAI API Key`            | ❌ No | ✅ Yes | ✅ Real ChatGPT models        |


### Pre-Commit
1. [husky](https://github.com/typicode/husky) and [lint-stage](https://github.com/okonet/lint-staged)
    ```
    "husky": {
      "hooks": {
        "pre-commit": "huskygpt review && huskygpt test && lint-staged --allow-empty"
      }
    },
    ```
2. `eslintrc.json`:
    ```
    "overrides": [
      {
        "files": ["**/__test__/*.{ts,tsx}"],
        "rules": {
          "no-warning-comments": "off"
        }
      }
    ],
    ```
3. `.gitignore`: 
   ```
   # review
   .huskygpt_review.md
   .env.local
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

### Environment Variables options
See [`.env`](https://github.com/luffy-xu/huskygpt/blob/main/.env) file.

## Note
1. Also can set all options in `.env` or `.env.local`, that will be used as default options. Command options will override the default options.
2. Webhook currently only test in `seaTalk`, if other channel need to use, please rise `PR` by yourself or ask [me](swhd0501@gmail.com) for help.

