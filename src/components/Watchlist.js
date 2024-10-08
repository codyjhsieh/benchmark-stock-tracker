// src/components/Watchlist.js
import React, { useState, useEffect } from "react";
import { getStockQuote } from "../services/api"; // Import your API function
import {
  Box,
  Heading,
  Text,
  Button,
  List,
  ListItem,
  Spinner,
  Flex,
} from "@chakra-ui/react"; // Import Chakra components

// Utility functions for local storage
const loadWatchlistFromLocalStorage = () => {
  const storedWatchlist = localStorage.getItem("watchlist");
  return storedWatchlist ? JSON.parse(storedWatchlist) : [];
};

const saveWatchlistToLocalStorage = (watchlist) => {
  // Since watchlist is now an array of objects (after fetching stock data),
  // we need to only save the symbols to local storage
  const symbolsOnly = watchlist.map((stock) => stock.symbol);
  localStorage.setItem("watchlist", JSON.stringify(symbolsOnly));
};

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stock data for each symbol in the watchlist
  useEffect(() => {
    const fetchStockData = async () => {
      const storedWatchlist = loadWatchlistFromLocalStorage();
      console.log("Loaded watchlist from local storage:", storedWatchlist); // Log when the watchlist is loaded
      if (storedWatchlist.length > 0) {
        try {
          const updatedWatchlist = await Promise.all(
            storedWatchlist.map(async (symbol) => {
              const stockData = await getStockQuote(symbol);
              return { symbol, ...stockData }; // Combine symbol with stock data
            })
          );
          setWatchlist(updatedWatchlist); // Update the watchlist with fetched data
          setLoading(false); // Set loading to false after data is fetched
          console.log("Fetched watchlist with data:", updatedWatchlist);
        } catch (error) {
          setError("Failed to load stock data. Please try again later.");
          console.error(error);
        }
      } else {
        setLoading(false); // Set loading to false if no stocks are found
      }
    };

    fetchStockData();
  }, []);

  // Remove a stock symbol from the watchlist
  const removeFromWatchlist = (symbol) => {
    console.log("Removing symbol:", symbol);

    // Filter out the stock with the matching symbol
    const updatedWatchlist = watchlist.filter(
      (stock) => stock.symbol !== symbol
    );

    setWatchlist(updatedWatchlist); // Update the state
    saveWatchlistToLocalStorage(updatedWatchlist); // Save updated list (symbols only) to local storage
    console.log(`${symbol} removed from the watchlist.`);

    const storedWatchlist = loadWatchlistFromLocalStorage();
    console.log("Loaded watchlist from local storage:", storedWatchlist); // Log when the watchlist is loaded
    console.log("Updated watchlist:", updatedWatchlist);
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box textAlign="center">
        <Text color="red.500" fontSize="lg">
          {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={6}>
        Stock Watchlist
      </Heading>

      <Heading as="h2" size="md" mb={4}>
        Your Watchlist
      </Heading>

      {watchlist.length === 0 ? (
        <Text>Your watchlist is empty.</Text>
      ) : (
        <List spacing={4}>
          {watchlist.map((stock, index) => (
            <ListItem
              key={index}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="sm"
            >
              <Text fontSize="lg" fontWeight="bold">
                {stock.symbol}
              </Text>
              <Text>Current Price: ${stock.currentPrice}</Text>
              <Text>
                Change: {stock.change} ({stock.percentChange}%)
              </Text>
              <Button
                mt={2}
                colorScheme="red"
                size="sm"
                onClick={() => removeFromWatchlist(stock.symbol)}
              >
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Watchlist;
