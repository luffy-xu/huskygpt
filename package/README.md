# huskygpt

`huskygpt` is a command line tool that generates unit tests or reviews code using the OpenAI API. It is designed to help developers automate the process of generating test cases for their code.

## Installation

To install `huskygpt`, run the following command:
```
npm install -g huskygpt
```

## Configuration
1. Create a `.env.local` file in the project root directory, and add the it to the `.gitignore` file.:
    ```
    OPENAI_API_KEY=<your api key>
    ···
1. Add the following to `scripts` in `package.json`:
    ```
    "scripts": {
      "huskygpt-review": "huskygpt review",
      "huskygpt-test": "huskygpt test"
    }
    ```
1. More optional configurations, see [.env](#https://github.com/luffy-xu/huskygpt/blob/main/.env
)


## Enjoying huskygpt with AI
- Run the following command to review your git staged files:
    ```
    npm run huskygpt-review --model text-davinci-002 --max-tokens 2048
    ```
- Run the following command to generate unit tests:
    ```
    npm run huskygpt-test --model text-davinci-002 --max-tokens 2048 --file-extensions .ts,.tsx --read-type dir --read-dir-name src --test-file-type test --test-file-extension .ts --test-file-dir-name tests
    ```
- Auto run when you commit, add the following to `husky` in `package.json`:
    ```
    "husky": {
      "hooks": {
        "pre-commit": "npm run huskygpt-review"
      }
    }
    ```
- Auto run when you commit, use lint-staged
    ```
    "husky": {
      "hooks": {
        "pre-commit": "lint-staged"
      }
    },
    "lint-staged": {
      "*.{ts,tsx}": [
        "npm run huskygpt-review"
      ]
    }
    ```



## Usage

To generate unit tests or review code, run the following command:
```
huskygpt test --api-key --model text-davinci-002 --max-tokens 2048 --file-extensions .ts,.tsx --read-type dir --read-dir-name src --test-file-type test --test-file-extension .ts --test-file-dir-name tests
```

huskygpt [options]
Replace `<runType>` with either `test` or `review`, depending on whether you want to generate unit tests or review code. The following options are available:

- `-k, --api-key <key>`: Set the [OpenAI API key](#https://platform.openai.com/account/api-keys
)
- `-m, --model <model>`: [OpenAI model](#https://platform.openai.com/docs/models/overview
) to use
- `-p, --prompt <prompt>`: OpenAI prompt to use
- `-t, --max-tokens <tokens>`: OpenAI max tokens to use
- `-e, --file-extensions <extensions>`: File extensions to read, example: `.ts,.tsx`
- `-r, --read-type <type>`: Read files from directory or git stage, example: `dir` or `git`
- `-d, --read-dir-name <name>`: Root name of the directory to read files from, example: `src`
- `-f, --test-file-type <type>`: Generate test file type, example: `test` or `spec`
- `-x, --test-file-extension <extension>`: Generate test file name extension, example: `.ts` or `.js`
- `-n, --test-file-dir-name <name>`: Generate test file directory name, example: `__tests__`
- `-w, --review-report-webhook <url>`: Webhook URL to send review result to your channel, execute example:
    ```bash
    execSync(`curl -i -X POST -H 'Content-Type: application/json' -d '{ "tag": "markdown", "markdown": {"content": "${content}"}}}' ${webhook}`);
    ```
- `-h, --help`: Display help for command


