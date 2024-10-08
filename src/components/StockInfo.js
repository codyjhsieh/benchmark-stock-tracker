// src/components/StockInfo.js
import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Spinner, Flex } from '@chakra-ui/react'; // Import Chakra UI components
import { getStockQuote } from '../services/api'; // Import API function to fetch stock data

/**
 * StockInfo component fetches and displays stock information for a given stock symbol.
 * It handles the loading, error, and successful data fetching states using Chakra UI for styling.
 * 
 * @param {string} symbol - The stock symbol to fetch data for (passed as a prop).
 */
const StockInfo = ({ symbol }) => {
  const [stock, setStock] = useState(null); // State to store stock information
  const [error, setError] = useState(''); // State to handle errors

  /**
   * useEffect hook to fetch stock data whenever the component mounts or the stock symbol changes.
   * It triggers an asynchronous function to get stock data from the API and updates the state.
   * Handles loading, success, and error states.
   */
  useEffect(() => {
    const fetchStockData = async () => {
      console.log(`Fetching stock data for: ${symbol}`); // Log the stock symbol for which data is being fetched
      try {
        const stockData = await getStockQuote(symbol); // Fetch stock data from the API
        console.log(`Fetched data for ${symbol}:`, stockData); // Log the fetched stock data
        setStock(stockData); // Set stock data in state
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error); // Log errors if the API request fails
        setError('Failed to load stock data'); // Handle API errors
      }
    };
    fetchStockData(); // Fetch stock data on mount or symbol change
  }, [symbol]); // Re-fetch stock data if the stock symbol changes

  // Display error if the API request fails
  if (error) return <Text color="red.500">{error}</Text>;

  // Show loading spinner while the data is being fetched
  if (!stock) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }
  // Display stock information once fetched
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      p={4} 
      boxShadow="md" 
      maxWidth="500px" 
      mx="auto"
    >
      <Heading as="h2" size="lg" mb={4}>
        {symbol}
      </Heading>
      <Text fontSize="lg">
        <strong>Current Price:</strong> ${stock.currentPrice}
      </Text>
      <Text fontSize="lg">
        <strong>Previous Close:</strong> ${stock.previousClose}
      </Text>
      <Text fontSize="lg">
        <strong>Change:</strong> {stock.change} ({stock.percentChange}%)
      </Text>
    </Box>
  );
};

export default StockInfo;