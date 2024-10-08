// src/__tests__/StockInfo.test.js
import { render, screen, waitFor } from '@testing-library/react';
import StockInfo from '../components/StockInfo';
import { getStockQuote } from '../services/api';

// Mocking Chakra UI components to avoid import issues during testing
jest.mock('@chakra-ui/react', () => ({
  Box: (props) => <div {...props} />,
  Heading: (props) => <h1 {...props} />,
  Text: (props) => <p {...props} />,
  Spinner: (props) => <div {...props} />,
  Flex: (props) => <div {...props} />,
}));

// Mock the API function that fetches stock data
jest.mock('../services/api', () => ({
  getStockQuote: jest.fn(),
}));

describe('StockInfo Component', () => {
  const mockStockData = {
    currentPrice: 150,
    previousClose: 148,
    change: 2,
    percentChange: 1.35,
  };

  test('displays stock information correctly after fetching data', async () => {
    // Mock the getStockQuote API to return the mock stock data
    getStockQuote.mockResolvedValue(mockStockData);

    // Render the component with the AAPL symbol
    render(<StockInfo symbol="AAPL" />);

    // Wait for the stock data to be fetched and rendered
    await waitFor(() => {
      // Check if the stock symbol is displayed
      expect(screen.getByText('AAPL')).toBeInTheDocument();
      // Check if the current price is displayed
      expect(screen.getByText(/Current Price:/i)).toBeInTheDocument();
      expect(screen.getByText('$150')).toBeInTheDocument();
      // Check if the previous close price is displayed
      expect(screen.getByText(/Previous Close:/i)).toBeInTheDocument();
      expect(screen.getByText('$148')).toBeInTheDocument();
      // Check if the change value is displayed
      expect(screen.getByText(/Change:/i)).toBeInTheDocument();
      expect(screen.getByText('2 (1.35%)')).toBeInTheDocument();
    });
  });
});