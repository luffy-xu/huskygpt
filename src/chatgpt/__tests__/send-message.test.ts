import { ChatMessage, SendMessageOptions } from 'chatgpt';

import { handleContinueMessage, sendMessageWithRetry } from '../send-message';

const sendMessage = jest.fn();
const OPENAI_MAX_RETRY = 3;

describe('sendMessageWithRetry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the message if sendMessage is successful', async () => {
    sendMessage.mockResolvedValueOnce({ message: 'Hello' });
    const res = await sendMessageWithRetry(sendMessage, OPENAI_MAX_RETRY);
    expect(res).toEqual({ message: 'Hello' });
  });

  it('should retry if the error has status code 429', async () => {
    sendMessage.mockRejectedValueOnce({ statusCode: 429 });
    sendMessage.mockResolvedValueOnce({ message: 'Hello' });
    const res = await sendMessageWithRetry(sendMessage, OPENAI_MAX_RETRY, 100);
    expect(res).toEqual({ message: 'Hello' });
    expect(sendMessage).toHaveBeenCalledTimes(2);
  });

  it('should not retry if the error has status code 401', async () => {
    sendMessage.mockRejectedValueOnce({ statusCode: 401 });
    await expect(
      sendMessageWithRetry(sendMessage, OPENAI_MAX_RETRY),
    ).rejects.toEqual({ statusCode: 401 });
    expect(sendMessage).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the maximum number of retries is reached', async () => {
    sendMessage.mockRejectedValue({ message: 'Error' });
    await expect(sendMessageWithRetry(sendMessage, 1)).rejects.toThrowError(
      'sendMessage failed after retries',
    );
    expect(sendMessage).toHaveBeenCalledTimes(1);
  });
});

describe('handleContinueMessage', () => {
  const mockSendMessage: (
    messageText: string,
    sendOptions?: SendMessageOptions,
  ) => Promise<ChatMessage> = async (messageText, sendOptions) => ({
    id: '1',
    conversationId: '1',
    role: 'user',
    text: messageText,
  });

  it('should return the same message if there are no unmatched code block symbols', async () => {
    const message: ChatMessage = {
      id: '1',
      conversationId: '1',
      text: 'Test message without code blocks',
      role: 'user',
    };

    const result = await handleContinueMessage(message, {}, mockSendMessage);
    expect(result).toEqual(message);
  });

  it('should return a combined message after a single continue attempt', async () => {
    const message: ChatMessage = {
      id: '1',
      conversationId: '1',
      role: 'user',
      text: 'Test message with `code` and ```unmatched code block',
    };

    const mockFunc = jest.fn().mockImplementationOnce(() => ({
      id: '2',
      conversationId: '1',
      text: 'Continued message with ```',
      timestamp: new Date(),
    }));

    const result = await handleContinueMessage(message, {}, mockFunc);
    expect(result.text).toBe(
      'Test message with `code` and ```unmatched code blockContinued message with ```',
    );
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it('should return a combined message after multiple continue attempts', async () => {
    const message: ChatMessage = {
      id: '1',
      conversationId: '1',
      role: 'user',
      text: 'Test message with `code` and ```unmatched code block',
    };

    const mockFunc = jest
      .fn()
      .mockImplementationOnce(() => ({
        id: '2',
        conversationId: '1',
        text: 'Continued message.',
      }))
      .mockImplementationOnce(() => ({
        id: '3',
        conversationId: '1',
        text: 'Another continued message with ```',
      }));

    const result = await handleContinueMessage(message, {}, mockFunc);
    expect(result.text).toBe(
      'Test message with `code` and ```unmatched code blockContinued message.Another continued message with ```',
    );
    expect(mockFunc).toHaveBeenCalledTimes(2);
  });

  it('should stop continuing after reaching the maximum attempts', async () => {
    const message: ChatMessage = {
      id: '1',
      conversationId: '1',
      role: 'user',
      text: 'Test message with `code` and ```unmatched code block',
    };

    const mockFunc = jest.fn().mockImplementation(() => ({
      id: '2',
      conversationId: '1',
      text: 'Continued message.',
    }));

    const result = await handleContinueMessage(message, {}, mockFunc, 3);
    expect(result.text).toBe(
      'Test message with `code` and ```unmatched code blockContinued message.Continued message.Continued message.',
    );
    expect(mockFunc).toHaveBeenCalledTimes(3);
  });
});
