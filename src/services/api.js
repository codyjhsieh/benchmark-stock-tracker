// Function to fetch stock quote information from the Node.js backend
export const getStockQuote = async (symbol) => {
  const response = await fetch(`/api/quote/${symbol}`);  // This will be proxied to localhost:5000
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stock data for symbol: ${symbol}. Status: ${response.status}`);
  }
  
  const data = await response.json();
  return {
    currentPrice: data.c,
    previousClose: data.pc,
    change: data.d,
    percentChange: data.dp,
  };
};

// Function to fetch stock symbol suggestions via the Node.js backend
export const searchStockSymbols = async (query) => {
  const response = await fetch(`/api/search?query=${query}`); // Call your Node.js backend
  
  if (!response.ok) {
    throw new Error('Failed to fetch stock symbol suggestions');
  }
  
  const data = await response.json();
  return data; // Returns an array of stock symbol suggestions
};