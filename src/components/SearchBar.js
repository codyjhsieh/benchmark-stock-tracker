// src/components/SearchBar.js
import React, { useState } from 'react';
import { Input } from '@chakra-ui/react'; // Import Chakra's Input component

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(query);
      setQuery(''); // Clear input after search
    }
  };

  return (
    <Input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyPress}
      placeholder="Type stock symbol and press ENTER to search"
      size="md"   // Default size for the input
      p={4}       // Adds padding inside the input field
      width="80vw" // 80% of the viewport width
      maxWidth="600px" // Set a max width for larger screens
    />
  );
};

export default SearchBar;