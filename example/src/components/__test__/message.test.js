import React from 'react';
import { render, screen } from '@testing-library/react';
import Message from '../message';

describe('Message', () => {
  it('should render a message with the correct author', () => {
    render(<Message message="Hello, world!" author="user" />);
    const messageContainer = screen.getByTestId('message-container');
    expect(messageContainer).toHaveClass('user-message');
    expect(messageContainer).toHaveTextContent('Hello, world!');
  });

  it('should render a bot message with the correct author', () => {
    render(<Message message="Hello, world!" author="bot" />);
    const messageContainer = screen.getByTestId('message-container');
    expect(messageContainer).toHaveClass('bot-message');
    expect(messageContainer).toHaveTextContent('Hello, world!');
  });
});
