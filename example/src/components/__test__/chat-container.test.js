import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatContainer from '../chat-container';

describe('ChatContainer', () => {
  it('should add a message when the user submits a message', () => {
    render(<ChatContainer />);
    const input = screen.getByTestId('chat-input');
    const submitButton = screen.getByText('Send');
    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    fireEvent.click(submitButton);
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });
});
