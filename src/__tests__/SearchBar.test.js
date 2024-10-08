// src/__tests__/SearchBar.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

describe('SearchBar Component', () => {
  test('renders input field for stock search', () => {
    render(<SearchBar />);
    const inputElement = screen.getByPlaceholderText(/search for a stock symbol/i);
    expect(inputElement).toBeInTheDocument();
  });

  test('calls onSearch when stock symbol is entered', () => {
    const mockSearch = jest.fn();
    render(<SearchBar onSearch={mockSearch} />);
    const inputElement = screen.getByPlaceholderText(/search for a stock symbol/i);

    // Simulate user typing and pressing "Enter"
    fireEvent.change(inputElement, { target: { value: 'AAPL' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(mockSearch).toHaveBeenCalledWith('AAPL');
  });
});