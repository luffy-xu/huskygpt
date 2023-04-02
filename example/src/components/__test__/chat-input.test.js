import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatInput from '../chat-input';

describe('ChatInput', () => {
  it('should display the input value when it changes', () => {
    render(<ChatInput onSubmit={() => {}} />);
    const input = screen.getByTestId('chat-input');
    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    expect(input).toHaveValue('Hello, world!');
  });

  it('should call onSubmit when the form is submitted with a non-empty input value', () => {
    const handleSubmit = jest.fn();
    render(<ChatInput onSubmit={handleSubmit} />);
    const input = screen.getByTestId('chat-input');
    const submitButton = screen.getByText('Send');
    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    fireEvent.click(submitButton);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith('Hello, world!');
    expect(input).toHaveValue('');
  });

  it('should not call onSubmit when the form is submitted with an empty input value', () => {
    const handleSubmit = jest.fn();
    render(<ChatInput onSubmit={handleSubmit} />);
    const input = screen.getByTestId('chat-input');
    const submitButton = screen.getByText('Send');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(submitButton);
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
