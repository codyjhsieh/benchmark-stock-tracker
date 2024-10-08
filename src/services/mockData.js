// src/services/mockData.js

export const mockStockData = {
    symbol: 'AAPL',
    currentPrice: 150.23,
    previousClose: 149.50,
    change: 0.73,
    percentChange: 0.49,
  };
  
  export const mockGoogleStockData = {
    symbol: 'GOOGL',
    currentPrice: 2750.10,
    previousClose: 2735.45,
    change: 14.65,
    percentChange: 0.54,
  };

  export const mockAutocompleteSuggestions = [
    { symbol: 'AAPL', description: 'Apple Inc.' },
    { symbol: 'GOOGL', description: 'Alphabet Inc.' },
    { symbol: 'AMZN', description: 'Amazon.com Inc.' },
    { symbol: 'MSFT', description: 'Microsoft Corporation' },
  ];