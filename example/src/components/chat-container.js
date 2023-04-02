import React, { useState, useCallback, memo } from 'react';
import Message from './message';
import ChatInput from './chat-input';

const MemoizedMessage = memo(Message);

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback(
    (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message, author: 'user' },
      ]);
    },
    [setMessages]
  );

  return (
    <div className="chat-container" data-testid="chat-container">
      <div className="message-list">
        {messages.map((m, i) => (
          <MemoizedMessage key={i} message={m.message} author={m.author} />
        ))}
      </div>
      <ChatInput onSubmit={addMessage} />
    </div>
  );
};

export default ChatContainer;
