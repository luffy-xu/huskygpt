import { ChatMessage, SendMessageOptions } from 'chatgpt';
import {
  OPENAI_MAX_CONTINUES,
  OPENAI_MAX_RETRY,
  codeBlocksMdSymbolRegex,
} from 'src/constant';

// Helper function to perform the API call with retries, handling specific status codes
export const sendMessageWithRetry = async (
  sendMessage: () => Promise<ChatMessage>,
  retries = OPENAI_MAX_RETRY,
  retryDelay = 3000,
): Promise<ChatMessage> => {
  for (let retry = 0; retry < retries; retry++) {
    try {
      const res = await sendMessage();
      return res;
    } catch (error) {
      if (error.statusCode === 401) {
        // If statusCode is 401, do not retry
        throw error;
      } else if (error.statusCode === 429) {
        // If statusCode is 429, sleep for retryDelay milliseconds then try again
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        // If not a specified status code, and we've reached the maximum number of retries, throw the error
        if (retry === retries) {
          throw error;
        }
        console.log(
          `[huskygpt] sendMessage failed, retrying... (${
            retry + 1
          }/${retries})`,
        );
      }
    }
  }
  throw new Error('sendMessage failed after retries');
};

// Handle continue message if needed
export const handleContinueMessage = async (
  message: ChatMessage,
  sendMessage: (
    messageText: string,
    sendOptions?: SendMessageOptions,
  ) => Promise<ChatMessage>,
  maxContinueAttempts = OPENAI_MAX_CONTINUES,
): Promise<ChatMessage> => {
  let resMessage = message;
  let continueAttempts = 0;

  if ((resMessage.text.match(codeBlocksMdSymbolRegex) || []).length % 2 === 0) {
    return resMessage;
  }

  while (continueAttempts < maxContinueAttempts) {
    const continueMessage = 'continue';
    const nextMessage = await sendMessage(continueMessage, {
      conversationId: resMessage.conversationId,
      parentMessageId: resMessage.id,
    } as SendMessageOptions);

    console.log(
      `[huskygpt] continue message... (${
        continueAttempts + 1
      }/${maxContinueAttempts})`,
    );

    resMessage = {
      ...resMessage,
      ...nextMessage,
      text: `${resMessage.text}${nextMessage.text}`,
    };

    if (nextMessage.text.match(codeBlocksMdSymbolRegex)?.length > 0) break;

    continueAttempts++;
  }

  return resMessage;
};
