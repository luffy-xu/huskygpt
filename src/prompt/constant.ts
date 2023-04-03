import fs from 'fs'
import path from 'path'

import { userOptions } from '../constant'
import { HuskyGPTTypeEnum, IReadFileResult } from '../types'
import { getFileNameByPath } from '../utils'
import { CodePicker } from '../utils/pick-code'

export const PERFECT_KEYWORDS = 'perfect!'

export const huskyGPTTypeMap: Record<
  HuskyGPTTypeEnum,
  (fileResult: IReadFileResult) => string[]
> = {
  [HuskyGPTTypeEnum.Test]: (fileResult) => {
    // Read the file contents using the fs module
    const fileContent =
      fileResult.fileContent || fs.readFileSync(fileResult.filePath!, 'utf-8')

    // Get the file name without the extension
    const fileName = getFileNameByPath(fileResult.filePath!)
    const userPrompt = userOptions.options.openAIPrompt

    return [
      `
        As a programer to write unit test code:
        - The test should import the test function from "../${fileName}"
        - Should include at least one test case for each function or class
        - No need to test the function import from other files
        - No need to test variable definition
        - No need to test function that only return a value
        ${userPrompt || ''}
        - Only return test code
        - Write test by following code: ${fileContent}
      `
    ]
  },
  [HuskyGPTTypeEnum.Review]: (fileResult) => {
    // Read the file contents using the fs module
    const fileContent =
      fileResult.fileContent || fs.readFileSync(fileResult.filePath!, 'utf-8')
    const userPrompt = userOptions.options.openAIPrompt
    const reviewPrompt = fs.readFileSync(
      path.join(process.cwd(), 'src/prompt/review.txt'),
      'utf-8'
    )

    // The base prompt for each code snippet
    const basePrompt = `
      ${reviewPrompt}
      ${userPrompt || ''}
      Here's the code snippet for review:
    `

    const codePicker = new CodePicker()

    return codePicker.pickFunctionOrClassCodeArray(fileContent).map((code) => {
      return `${basePrompt} "${code}"`
    })
  }
}
