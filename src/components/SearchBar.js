// src/components/SearchBar.js
import React, { useState, useEffect } from 'react';
import { Input, Box, List, ListItem, Spinner } from '@chakra-ui/react'; // Import Chakra's Input component
import { searchStockSymbols } from '../services/api'; // Import search API

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query); // Debounced query state
  const [isSuggestionClicked, setIsSuggestionClicked] = useState(false);


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(query);
      setQuery(''); // Clear input after search
      setSuggestions([]); // Clear suggestions after search
    }
  };

  // Debounce the query to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1000); // 1000ms debounce delay

    // Cleanup timeout if the effect is rerun (e.g., if the user keeps typing)
    return () => {
      clearTimeout(handler);
    };
  }, [query]); // Only trigger when query changes

  // Fetch stock symbol suggestions based on the debounced query
  useEffect(() => {
    if (isSuggestionClicked) {
      setIsSuggestionClicked(false); // Reset flag after the suggestion was clicked
      return; // Skip the search
    }
    const fetchSuggestions = async () => {
      if (debouncedQuery.length > 1) {
        setIsLoading(true);
        try {
          const results = await searchStockSymbols(debouncedQuery);
          setSuggestions(results); // Update suggestions state
        } catch (error) {
          console.error('Error fetching symbol suggestions:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]); // Clear suggestions if input is too short
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, isSuggestionClicked]); // Trigger this effect only when the debounced query changes

  // Force uppercase input by transforming the query value to uppercase
  const handleInputChange = (e) => {
    setQuery(e.target.value.toUpperCase()); // Convert input value to uppercase
  };

  // Handle symbol selection from the dropdown
  const handleSuggestionClick = (symbol) => {
    setIsSuggestionClicked(true); // Mark that a suggestion was clicked
    setQuery(symbol); // Set the selected symbol to the input field
    onSearch(symbol); // Trigger search with the selected symbol
    setSuggestions([]); // Clear suggestions
    setDebouncedQuery('');
  };

  return (
    <Box width="100%" maxw="600px" mx="auto" position="relative">
      <Input
        type="text"
        value={query}
        onChange={handleInputChange} // Update query on input change
        onKeyDown={handleKeyPress} // Handle Enter key to search
        placeholder="Type stock symbol and press ENTER to search"
        size="md"
        p={4}
        width="100%"
        shadow="sm"
        bordercolor="gray.300"
        _hover={{ borderColor: 'teal.400' }}
        _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}
      />
      
      {/* Display suggestions */}
      {isLoading && (
        <Box mt={2}>
          <Spinner size="sm" />
        </Box>
      )}
      {suggestions.length > 0 && (
        <List
          mt={2}
          borderwidth="1px"
          borderradius="md"
          bg="white"
          shadow="md"
          position="absolute"
          width="100%"
        >
          {suggestions.map((suggestion, index) => (
            <ListItem
              key={index}
              p={2}
              _hover={{ bg: 'gray.100', cursor: 'pointer' }}
              onClick={() => handleSuggestionClick(suggestion.symbol)} // Handle click
            >
              {suggestion.symbol} - {suggestion.description}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};


export default SearchBar;