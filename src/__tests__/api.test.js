// src/__tests__/api.test.js
import { getStockQuote } from '../services/api';

describe('API Service', () => {
  beforeEach(() => {
    // Reset fetch mocks before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test('fetches stock quote from API', async () => {
    const mockApiResponse = { c: 150, pc: 148, d: 2, dp: 1.35 };

    // Mock the fetch function to resolve with a successful response
    global.fetch.mockResolvedValue({
      ok: true, // Simulate successful response status
      json: async () => mockApiResponse, // Return the mock API response
    });

    // Call the function
    const stockData = await getStockQuote('AAPL');

    // Verify the returned data matches the mock response
    expect(stockData).toEqual({
      currentPrice: 150,
      previousClose: 148,
      change: 2,
      percentChange: 1.35,
    });

    // Ensure fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith('/api/quote/AAPL');
  });
});