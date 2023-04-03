import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render the chat interface', () => {
    render(<App />);
    const chatContainer = screen.getByTestId('chat-container');
    expect(chatContainer).toBeInTheDocument();
  });
});
