import { ChatGPTUnofficialProxyAPI, ChatMessage } from 'chatgpt'
import ora from 'ora'

import { userOptions } from '../constant'
import { generatePrompt } from '../prompt'
import { IReadFileResult } from '../types'

export class ChatgptProxyAPI {
  private api: ChatGPTUnofficialProxyAPI

  constructor() {
    this.api = new ChatGPTUnofficialProxyAPI({
      accessToken: userOptions.openAISessionToken,
      apiReverseProxyUrl: 'https://bypass.churchless.tech/api/conversation'
      // apiReverseProxyUrl: 'https://api.pawan.krd/backend-api/conversation',
    })
  }

  /**
   * Generate prompt for the OpenAI API
   */
  private generatePrompt(fileResult: IReadFileResult): string[] {
    // Set the file content as the prompt for the API request
    const prompt = generatePrompt(fileResult)

    return prompt
  }

  private async sendMessage(
    prompt: string,
    prevMessage: Partial<ChatMessage> = {}
  ): Promise<ChatMessage> {
    const reviewSpinner = ora({
      text: `[huskygpt] start ${userOptions.huskyGPTType} your code... \n ${prompt}`,
      spinner: {
        interval: 800,
        frames: ['🚀', '🤖', '🚀', '🤖', '🚀', '🤖', '🚀', '🤖']
      }
    }).start()

    const res = await this.api.sendMessage(prompt, {
      ...prevMessage,
      onProgress: (partialResponse) => {
        reviewSpinner.text = partialResponse.text
      }
    })

    reviewSpinner.succeed(`🎉🎉 [huskygpt] ${res.text} 🎉🎉\n `)

    return res
  }

  /**
   * Run the OpenAI API
   * @description filePath is the path of the file to be passed to the OpenAI API as the prompt
   * @returns {Promise<string>}
   */
  async run(fileResult: IReadFileResult): Promise<string> {
    try {
      const promptArray = this.generatePrompt(fileResult)

      console.log('[debug] promptArray:', promptArray.length, promptArray)

      // process.exit(0);
      const messageArray: string[] = []
      let message: ChatMessage
      for (const prompt of promptArray) {
        message = await this.sendMessage(prompt, {
          conversationId: message?.conversationId,
          parentMessageId: message?.id
        })
        messageArray.push(message.text)
      }
      // reviewSpinner.succeed(
      //   `🎉🎉 [huskygpt] ${userOptions.huskyGPTType} code successfully! 🎉🎉\n `
      // );

      return messageArray.join('\n\n---\n\n')
    } catch (error) {
      console.error('run error:', error)
      // reviewSpinner.fail(
      //   `🤔🤔 [huskygpt] ${userOptions.huskyGPTType} your code failed! 🤔🤔\n`
      // );
      return '[huskygpt] call OpenAI API failed!'
    }
  }
}
