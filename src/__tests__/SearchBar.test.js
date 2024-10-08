// src/__tests__/SearchBar.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../components/SearchBar';
import { searchStockSymbols } from '../services/api';

// Mock Chakra UI components to avoid issues with context resolution
jest.mock('@chakra-ui/react', () => ({
  Input: (props) => <input {...props} />,
  Box: (props) => <div {...props} />,
  List: (props) => <ul {...props} />,
  ListItem: (props) => <li {...props} />,
  Spinner: (props) => <div {...props} />,
}));

// Mock the searchStockSymbols API function
jest.mock('../services/api', () => ({
  searchStockSymbols: jest.fn(),
}));

describe('SearchBar Component', () => {
  test('renders input field for stock search', () => {
    render(<SearchBar />);
    const inputElement = screen.getByPlaceholderText(/type stock symbol and press enter to search/i);
    expect(inputElement).toBeInTheDocument();
  });

  test('calls onSearch when stock symbol is entered', async () => {
    const mockSearch = jest.fn();
    render(<SearchBar onSearch={mockSearch} />);
    const inputElement = screen.getByPlaceholderText(/type stock symbol and press enter to search/i);

    // Simulate user typing and pressing "Enter"
    fireEvent.change(inputElement, { target: { value: 'AAPL' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith('AAPL');
    });
  });
});