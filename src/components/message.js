import React from 'react';

const Message = ({ message, author }) => (
  <div
    data-testid="message-container"
    className={`message ${author === 'bot' ? 'bot-message' : 'user-message'}`}
  >
    <p>{message}</p>
  </div>
);

export default Message;
