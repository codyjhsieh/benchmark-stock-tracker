// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams, Link } from 'react-router-dom'; // Import necessary routing components
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';  // Import Chakra components
import SearchBar from './components/SearchBar'; // Import SearchBar component
import StockInfo from './components/StockInfo'; // Import StockInfo component
import Watchlist from './components/Watchlist'; // Import Watchlist component

// Utility functions to handle local storage
const saveWatchlistToLocalStorage = (watchlist) => {
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
};

const loadWatchlistFromLocalStorage = () => {
  const storedWatchlist = localStorage.getItem('watchlist');
  return storedWatchlist ? JSON.parse(storedWatchlist) : [];
};


// Main App component that sets up routing and search functionality
const App = () => {
  const [watchlist, setWatchlist] = useState([]); // State to store watchlist items

  // Load watchlist from local storage when the app starts
  useEffect(() => {
    const storedWatchlist = loadWatchlistFromLocalStorage();
    setWatchlist(storedWatchlist);
    console.log('Loaded watchlist from local storage:', storedWatchlist); // Log when the watchlist is loaded
  }, []);

  // Add a stock to the watchlist
  const addToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol)) {
      const updatedWatchlist = [...watchlist, symbol];
      setWatchlist([...watchlist, symbol]);
      saveWatchlistToLocalStorage(updatedWatchlist); // Save to local storage
      console.log(`${symbol} is added to the watchlist.`); // Log when stock is added
    }
  };

  // Remove a stock from the watchlist
  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter((item) => item !== symbol));
  };
  return (
    <Router>
      <SearchBarHandler /> {/* SearchBar is included on every page */}
      <Routes>
        {/* Route to display stock details */}
        <Route path="/stock/:symbol" element={<StockDetailWrapper addToWatchlist={addToWatchlist} />} />

        {/* Route to display the watchlist */}
        <Route path="/watchlist" element={<Watchlist watchlist={watchlist} removeFromWatchlist={removeFromWatchlist} />} />

      </Routes>
    </Router>
  );
};

// SearchBarHandler component to handle the search logic
const SearchBarHandler = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle stock symbol search
  const handleSearch = (symbol) => {
    if (symbol) {
      // Navigate to the stock details page with the stock symbol
      console.log(`Navigating to stock details for: ${symbol}`);
      navigate(`/stock/${symbol}`);
    }
  };

  return (
    <Flex direction="column" align="center" mt={6} p={4}>  {/* Flexbox layout to center content */}
      {/* Clickable Text-Based Logo that navigates back to home */}
      <Link to="/"> {/* Clicking the logo will go to the home page */}
        <Heading as="h1" size="2xl" mb={4} color="teal.500" fontWeight="bold" textAlign="center">
          StockTracker
        </Heading>
      </Link>
      <Text fontSize="lg" color="gray.600" mb={4}>
        Your Ultimate Stock Portfolio Manager
      </Text>
      <SearchBar onSearch={handleSearch} />
      {/* Button to navigate to the watchlist */}
      <Button onClick={() => navigate('/watchlist')} mt={4} colorScheme="teal">
        Show Watchlist
      </Button>
    </Flex>
  );
};

// Wrapper for StockInfo to extract URL parameters
const StockDetailWrapper = ({ addToWatchlist }) => {
  const { symbol } = useParams(); // Extract the stock symbol from the URL
  console.log(`Displaying stock info for: ${symbol}`); 
  return (
    
    <Box p={4}>
      <StockInfo symbol={symbol} />
      
      {/* Flex to center the button horizontally */}
      <Flex justify="center" mt={4}>
        <Button onClick={() => addToWatchlist(symbol)} colorScheme="blue">
          Add to Watchlist
        </Button>
      </Flex>
    </Box>
  );
};


export default App;