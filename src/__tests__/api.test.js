// src/__tests__/api.test.js
import { getStockQuote } from '../services/api';

describe('API Service', () => {
  test('fetches stock quote from API', async () => {
    const mockResponse = { c: 150, pc: 148, d: 2, dp: 1.35 };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    );

    const result = await getStockQuote('AAPL');
    expect(result).toEqual({
      currentPrice: 150,
      previousClose: 148,
      change: 2,
      percentChange: 1.35,
    });
  });
});