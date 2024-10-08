// src/services/api.js
const API_KEY = "cs26ok1r01qpjum5qj7gcs26ok1r01qpjum5qj80";

// Function to fetch stock quote information for a given symbol
export const getStockQuote = async (symbol) => {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }
    const data = await response.json();
    // return data
    // const data = await response.json();
    return {
      currentPrice: data.c,
      previousClose: data.pc,
      change: data.d,
      percentChange: data.dp,
    };
  };