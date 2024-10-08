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
  Select,
  Input,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";

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
  const [sortOption, setSortOption] = useState("symbol"); // State for sorting
  const [filterText, setFilterText] = useState(""); // State for filtering
  const [progress, setProgress] = useState(0); // State to track progress
  const refreshInterval = 60000; // Refresh every 60 seconds finnhub doesn't seem to update faster
  const [secondsLeft, setSecondsLeft] = useState(refreshInterval / 1000); // Track seconds until the next refresh

  // Fetch stock data for each symbol in the watchlist
  useEffect(() => {
    const fetchStockData = async () => {
      const storedWatchlist = loadWatchlistFromLocalStorage();
      if (storedWatchlist.length > 0) {
        try {
          const updatedWatchlist = await Promise.all(
            storedWatchlist.map(async (symbol) => {
              const stockData = await getStockQuote(symbol);
              return { symbol, ...stockData };
            })
          );
          setWatchlist(updatedWatchlist);
        } catch (error) {
            // Check if the error is a rate limit error
            if (error.message.includes('Rate limit exceeded')) {
              setError(`Too many requests: Rate limit exceeded. Please wait and try again.`);
            } else {
              setError(`Failed to load stock data`);
            }
        }
      }
      setLoading(false); // Set loading to false after initial fetch
    };

    fetchStockData(); // Fetch data on mount

    // Set interval for fetching stock data periodically
    const intervalId = setInterval(() => {
      fetchStockData(); // Fetch data periodically
      setProgress(0); // Reset progress after each fetch
      setSecondsLeft(refreshInterval / 1000); // Reset seconds countdown
    }, refreshInterval);

    // Update progress bar every second
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 100 / (refreshInterval / 1000)
      );
      setSecondsLeft((prevSeconds) =>
        prevSeconds > 0 ? prevSeconds - 1 : refreshInterval / 1000
      );
    }, 1000); // Update progress every second

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(intervalId);
      clearInterval(progressInterval);
    };
  }, []);

  // Remove a stock symbol from the watchlist
  const removeFromWatchlist = (symbol) => {

    // Filter out the stock with the matching symbol
    const updatedWatchlist = watchlist.filter(
      (stock) => stock.symbol !== symbol
    );

    setWatchlist(updatedWatchlist); // Update the state
    saveWatchlistToLocalStorage(updatedWatchlist); // Save updated list (symbols only) to local storage

    const storedWatchlist = loadWatchlistFromLocalStorage();
  };

  // Sorting function
  const sortWatchlist = (watchlist, option) => {
    return [...watchlist].sort((a, b) => {
      switch (option) {
        case "price-asc":
          return a.currentPrice - b.currentPrice;
        case "price-desc":
          return b.currentPrice - a.currentPrice;
        case "change-asc":
          return a.change - b.change;
        case "change-desc":
          return b.change - a.change;
        case "percentChange-asc":
          return a.percentChange - b.percentChange;
        case "percentChange-desc":
          return b.percentChange - a.percentChange;
        case "symbol":
        default:
          return a.symbol.localeCompare(b.symbol);
      }
    });
  };

  // Filter function
  const filterWatchlist = (watchlist, filterText) => {
    return watchlist.filter((stock) =>
      stock.symbol.toLowerCase().includes(filterText.toLowerCase())
    );
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

  // Apply sorting and filtering
  const sortedWatchlist = sortWatchlist(watchlist, sortOption);
  const filteredWatchlist = filterWatchlist(sortedWatchlist, filterText);

  return (
    <Box
      p={8} // Increased padding for a consistent look with SearchBarHandler
      bg="rgba(255, 255, 255, 0.15)" // Lightly translucent background
      border="1px solid rgba(255, 255, 255, 0.3)" // Subtle border for a clean glass look
      boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)" // Soft shadow for depth
      backdropFilter="blur(15px)" // Stronger blur effect for glassmorphism
      borderRadius="lg" // Larger radius for rounded corners
      maxW="800px" // Make sure it's centered and not too wide
      mx="auto" // Center horizontally
      mt={8} // Top margin for spacing
      position="relative" // Needed for the refresh timer positioning
    >
      {/* Heading for Stock Watchlist */}
      <Heading
        as="h1"
        size="xl"
        mb={6}
        bgGradient="linear(to-r, teal.500, green.400)" // Gradient text color
        bgClip="text"
        fontWeight="bold"
      >
        Stock Watchlist
      </Heading>
  
      {/* Circular Progress in the top-right corner */}
      <Box position="absolute" top={4} right={4}>
        <Flex direction="column" align="center" justify="center">
          <Heading as="h2" size="xs" mb={1} textAlign="center" color="gray.600">
            Next Refresh
          </Heading>
          <CircularProgress
            value={progress}
            size="35px"
            thickness="6px"
            color="teal.500"
          >
            <CircularProgressLabel fontSize="10px">
              {secondsLeft}s
            </CircularProgressLabel>
          </CircularProgress>
        </Flex>
      </Box>
  
      {/* Sorting options */}
      <Flex mb={4} justify="space-between">
        <Select
          width="30%"
          bg="rgba(255, 255, 255, 0.1)" // Light translucent background for dropdown
          onChange={(e) => setSortOption(e.target.value)}
          value={sortOption}
        >
          <option value="symbol">Sort by Symbol</option>
          <option value="price-asc">Sort by Price (Asc)</option>
          <option value="price-desc">Sort by Price (Desc)</option>
          <option value="change-asc">Sort by Change (Asc)</option>
          <option value="change-desc">Sort by Change (Desc)</option>
          <option value="percentChange-asc">Sort by % Change (Asc)</option>
          <option value="percentChange-desc">Sort by % Change (Desc)</option>
        </Select>
  
        {/* Filtering input */}
        <Input
          width="30%"
          placeholder="Filter by Symbol"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          bg="rgba(255, 255, 255, 0.1)" // Light translucent background for input
        />
      </Flex>
  
      {/* Watchlist items */}
      {filteredWatchlist.length === 0 ? (
        <Text color="gray.300">Your watchlist is empty.</Text> // Text color for empty state
      ) : (
        <List spacing={4}>
          {filteredWatchlist.map((stock, index) => (
            <ListItem
              key={index}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="md"
              bg="rgba(255, 255, 255, 0.1)" // Translucent background for each list item
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
