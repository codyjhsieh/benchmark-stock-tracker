const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = ''; // Your Finnhub API Key

// Route to get stock quote
app.get('/api/quote/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {

    // Log the request URL
    const requestUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

    // Make the API request to Finnhub
    const response = await axios.get(requestUrl);

    res.json(response.data); // Return the stock data if successful
  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      // Handle 403 Forbidden error
      if (status === 403) {
        return res.status(403).json({ error: 'Access Forbidden: Check your API key or permissions.' });
      }

      // Handle rate limit exceeded (429) error
      if (status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
      }

      // For any other errors from the API, return a general error message
      res.status(status).json({ error: `Failed to fetch stock data for ${symbol}. Status: ${status}` });
    } else {
      // If it's a different kind of error (like a network issue), return a 500 error
      res.status(500).json({ error: 'An internal error occurred while fetching stock data.' });
    }
  }
});

// Route to handle stock symbol search
app.get('/api/search', async (req, res) => {
  const { query } = req.query; // Extract the search query from the request

  try {
    const response = await axios.get(`https://finnhub.io/api/v1/search?q=${query}&token=${API_KEY}`);
    res.json(response.data.result); // Send the result array to the frontend
  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      // Handle 403 Forbidden error
      if (status === 403) {
        return res.status(403).json({ error: 'Access Forbidden: Check your API key or permissions.' });
      }

      // Handle rate limit exceeded (429) error
      if (status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
      }

      // For any other errors from the API, return a general error message
      res.status(status).json({ error: `Failed to fetch stock symbol suggestions. Status: ${status}` });
    } else {
      // If it's a different kind of error (like a network issue), return a 500 error
      res.status(500).json({ error: 'An internal error occurred while fetching stock symbol suggestions.' });
    }
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
