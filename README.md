# huskygpt
Auto Review your code or Auto generate unit tests by OpenAI api gpt (GPT-4)

## Key Features
- 🤖 Generates test cases using the OpenAI API
- 🤖 Review your code using the OpenAI API
- 🧠 Supports multiple OpenAI models and customizing the prompt
- 📂 Supports reading test files from `directories` or `git staged files`

## Usage
- [Command Line NPM Usage Click Me](https://github.com/luffy-xu/huskygpt/tree/main/package
)


## Requirements
- Node.js 14.0 or higher
- An [OpenAI API key](https://platform.openai.com/account/api-keys)

## Getting started
1. Install the required dependencies by running the following command in your terminal:
    ```bash
    npm install
    ```
1. Set your OpenAI API key as an environment variable in your local machine. You can do this by adding the following line to your `.env` or `.env.local`(preferred) file:
    ```bash
    OPENAI_API_KEY=YOR_API_KEY
    ```
1. Make sure to replace `<your_api_key>` with your actual API key.
1. Modify the `.env` file to define your own prompt and model configuration. You can update the `openai.createCompletion()` function to interact with the GPT API and generate the desired number of test cases.
1. Run the script by running the following command in your terminal:
    ```bash
    // NOTE: If **.test.ts is already present in the project, will skip this file generation

    npm run huskygpt
    ```
- This will generate the test cases based on your prompt and model configuration, and print them to the console.
- Review and modify the generated test cases as necessary to ensure they provide adequate coverage of your code.
- Commit the generated test cases to your repository.

## Notes
- The `openai` package for Node.js is used to interact with the OpenAI API. You can find more information about this package in the [official documentation](https://github.com/openai/openai-node
).
- The generated test cases may not always cover all edge cases or error conditions, and may require manual review and refinement to ensure they provide adequate coverage of your code. Additionally, generating tests may not be the best approach for all types of projects, and may be more suitable for certain types of code or applications.
- The example `xxx.test.ts` file is provided as a starting point and may need to be modified to suit your specific needs.
