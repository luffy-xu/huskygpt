# Auto-generating unit tests with GPT-4
This project is an example of how you can use the GPT-4 language model to automatically generate unit tests for your code. This repository contains a Node.js script that interacts with the OpenAI API to generate test cases based on a given prompt and model configuration.

# Requirements
- Node.js 14.0 or higher
- An [OpenAI API key](https://platform.openai.com/account/api-keys)

# Getting started
1. Clone this repository to your local machine.
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

    npm run generate-tests
    ```
- This will generate the test cases based on your prompt and model configuration, and print them to the console.
- Review and modify the generated test cases as necessary to ensure they provide adequate coverage of your code.
- Commit the generated test cases to your repository.

# Notes
- The `openai` package for Node.js is used to interact with the OpenAI API. You can find more information about this package in the [official documentation](https://github.com/openai/openai-node
).
- The generated test cases may not always cover all edge cases or error conditions, and may require manual review and refinement to ensure they provide adequate coverage of your code. Additionally, generating tests may not be the best approach for all types of projects, and may be more suitable for certain types of code or applications.
- The example `xxx.test.ts` file is provided as a starting point and may need to be modified to suit your specific needs.
