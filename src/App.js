// src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useParams,
  useLocation,
  Link,
  Navigate,
} from "react-router-dom"; // Import necessary routing components
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react"; // Import Chakra components
import SearchBar from "./components/SearchBar"; // Import SearchBar component
import StockInfo from "./components/StockInfo"; // Import StockInfo component
import Watchlist from "./components/Watchlist"; // Import Watchlist component

// Utility functions to handle local storage
const saveWatchlistToLocalStorage = (watchlist) => {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
};

const loadWatchlistFromLocalStorage = () => {
  const storedWatchlist = localStorage.getItem("watchlist");
  return storedWatchlist ? JSON.parse(storedWatchlist) : [];
};

// Main App component that sets up routing and search functionality
const App = () => {
  const [watchlist, setWatchlist] = useState([]); // State to store watchlist items

  // Load watchlist from local storage when the app starts
  useEffect(() => {
    const storedWatchlist = loadWatchlistFromLocalStorage();
    setWatchlist(storedWatchlist);
  }, []);

  // Add a stock to the watchlist
  const addToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol)) {
      const updatedWatchlist = [...watchlist, symbol];
      setWatchlist([...watchlist, symbol]);
      saveWatchlistToLocalStorage(updatedWatchlist); // Save to local storage
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
        {/* Define the root route */}
        <Route path="/" element={<div />} />{" "}
        {/* Render nothing or a placeholder with the search bar */}
        {/* Route to display stock details */}
        <Route
          path="/stock/:symbol"
          element={
            <StockDetailWrapper
              addToWatchlist={addToWatchlist}
              watchlist={watchlist}
            />
          }
        />
        {/* Route to display the watchlist */}
        <Route
          path="/watchlist"
          element={
            <Watchlist
              watchlist={watchlist}
              removeFromWatchlist={removeFromWatchlist}
            />
          }
        />
      </Routes>
    </Router>
  );
};

// SearchBarHandler component to handle the search logic and toggle the button
const SearchBarHandler = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const location = useLocation(); // Hook to get the current route

  // Function to handle stock symbol search
  const handleSearch = (symbol) => {
    if (symbol) {
      navigate(`/stock/${symbol}`); // Navigate to the stock details page with the stock symbol
    }
  };

  return (
    <Flex direction="column" align="center" mt={6} p={4}>
      <Box
        bg="rgba(255, 255, 255, 0.15)" // Lightly translucent white background
        border="1px solid rgba(255, 255, 255, 0.3)" // Subtle border
        boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)" // Soft shadow
        backdropFilter="blur(15px)" // Stronger blur for the glass effect
        borderRadius="lg" // Larger radius for rounded corners
        p={8} // Padding inside the box
        mb={6} // Margin bottom
        w="100%" // Full width for smaller screens
        maxW="600px" // Maximum width
        textAlign="center"
        position="relative"
        zIndex={1} // Lower z-index to ensure it's behind search
      >
        <Link to="/">
          {" "}
          {/* Clicking the logo will go to the home page */}
          <Heading
            as="h1"
            size="2xl"
            mb={4}
            bgGradient="linear(to-r, teal.500, green.400)" // Gradient text color
            bgClip="text"
            fontWeight="bold"
          >
            StockTracker
          </Heading>
        </Link>
        <Text fontSize="lg" color="gray.600" mb={4}>
          Your Ultimate Stock Portfolio Manager
        </Text>
        {/* Wrap SearchBar in a div with higher z-index */}
        <Box position="relative" zIndex={10}>
          <SearchBar onSearch={handleSearch} />
        </Box>

        {/* Conditionally render the button based on the route */}
        {location.pathname === "/watchlist" ? (
          <Button
            position="relative"
            zIndex={0}
            onClick={() => navigate("/")}
            mt={4}
            colorScheme="blue"
          >
            Hide Watchlist
          </Button>
        ) : (
          <Button
            zIndex={0}
            onClick={() => navigate("/watchlist")}
            mt={4}
            colorScheme="red"
          >
            Show Watchlist
          </Button>
        )}
      </Box>
    </Flex>
  );
};

// Wrapper for StockInfo to extract URL parameters
const StockDetailWrapper = ({ addToWatchlist, watchlist }) => {
  const { symbol } = useParams(); // Extract the stock symbol from the URL
  const [isAdded, setIsAdded] = useState(false); // New state to track if the stock has been added

  // Check if the stock is already in the watchlist
  useEffect(() => {

    // Reset `isAdded` to false when the `symbol` changes
    setIsAdded(false);

    // Ensure that the watchlist exists and is an array
    if (watchlist && Array.isArray(watchlist)) {


      // Convert both symbol and watchlist items to lowercase for case-insensitive comparison
      const lowerCaseWatchlist = watchlist.map((stock) => stock.toLowerCase());
      const lowerCaseSymbol = symbol.toLowerCase();

      // Check if the symbol exists in the watchlist
      if (lowerCaseWatchlist.includes(lowerCaseSymbol)) {
        setIsAdded(true); // Set button to "Added" if stock is in the watchlist
      } else {
        console.log(`"${symbol}" is not in the watchlist.`);
      }
    } else {
      console.log("Watchlist is either undefined or not an array.");
    }
  }, [symbol, watchlist]); // Re-run useEffect whenever symbol or watchlist changes

  // Function to handle adding the stock to the watchlist
  const handleAddToWatchlist = () => {
    addToWatchlist(symbol); // Call parent function to add stock
    setIsAdded(true); // After adding, set isAdded to true
  };

  return (
    <Box
      p={6}
      bg="rgba(255, 255, 255, 0.15)" // Light translucent background
      border="1px solid rgba(255, 255, 255, 0.3)"
      boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
      backdropFilter="blur(10px)"
      borderRadius="lg"
      maxW="600px"
      mx="auto"
      mt={8} // Top margin for spacing
      zIndex={1} // Lower z-index to ensure it's behind search
    >
      <StockInfo symbol={symbol} />

      <Flex justify="center" mt={4}>
        <Button
          onClick={handleAddToWatchlist}
          colorScheme={isAdded ? "green" : "blue"} // Change button color if added
          bg={isAdded ? "green.400" : "blue.400"}
          color="white"
          _hover={{ bg: isAdded ? "green.500" : "blue.500" }} // Hover effect
          isDisabled={isAdded} // Disable button if stock is already added
        >
          {isAdded ? "Added to Watchlist" : "Add to Watchlist"}
        </Button>
      </Flex>
    </Box>
  );
};

export default App;
