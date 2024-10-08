# StockTracker

**StockTracker** is a simple and interactive React application that allows users to search for stock information, view details for individual stocks, and manage a watchlist. The app uses `Chakra UI` for a clean and responsive interface and handles routing with `react-router-dom`. Local storage is used to persist the user's watchlist.

## Features

- **Stock Search**: Search for stock symbols to view detailed stock information.
- **Stock Details**: View individual stock data such as current price, previous close, and daily changes.
- **Watchlist Management**: Add stocks to a watchlist and remove them as needed. The watchlist is saved in local storage so that it persists across page reloads.
- **Routing**: The app uses `react-router-dom` to handle navigation between stock details and the watchlist.
- **Backend API Integration**: Node.js is used to create backend routes for fetching stock data and symbol search from the Finnhub API.

## Technology Stack

- **React**: JavaScript library for building user interfaces.
- **Chakra UI**: A simple, modular, and accessible component library for React.
- **React Router**: For handling routing within the app.
- **Node.js & Express**: Backend to handle API requests for stock data.
- **Axios**: To make HTTP requests from the Node.js backend to the Finnhub API.
- **Local Storage**: To persist the user's watchlist across sessions.
- **JavaScript (ES6+)**: For modern and clean code structure.

## Installation

Follow the steps below to install and run the application on your local machine.

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/stock-tracker.git
   cd stock-tracker

### Frontend

2. Install the dependencies:
   ```bash
   npm install
3. Run the application:
   ```bash
   npm start
4. Open http://localhost:3000 to view the app in your browser.

### Backend
1. Modify API Key in `server.js` `const API_KEY = ''; // Your Finnhub API Key`

2. Navigate to the server folder:
   ```bash
   cd src/server
3. Install backup dependencies
   ```bash
   npm install
4. Run the Node.js server:
node server.js


## Components

### `App.js`
The main component that handles routing and manages the global state of the watchlist.

- **State Management**: Uses React's `useState` and `useEffect` hooks to manage and persist the watchlist data in local storage.
- **Routing**: The app uses `react-router-dom` for routing. Key routes include:
  - `/`: The homepage with a search bar.
  - `/stock/:symbol`: Displays detailed stock information.
  - `/watchlist`: Shows the user's saved watchlist.

### `SearchBarHandler`
- Handles the stock search functionality.
- Navigates to the stock details page when the user searches for a symbol.
- Contains the clickable text-based logo which navigates back to the homepage.

### `StockDetailWrapper`
- Wrapper component that extracts the stock symbol from the URL parameters and displays stock information using the `StockInfo` component.
- Allows users to add the stock to the watchlist.

### `StockInfo`
- Displays the stock's current price, previous close, and daily changes.
- Uses the `getStockQuote` API call (assumed to be implemented in the `services/api.js`).

### `Watchlist`
- Displays the user's saved stocks in a watchlist.
- Provides the option to remove stocks from the watchlist, which is persisted in local storage.

## Local Storage

The app saves and loads the watchlist using the browser's local storage. This allows users to retain their watchlist even after refreshing the page or closing the browser.

- `saveWatchlistToLocalStorage`: Saves the watchlist to local storage.
- `loadWatchlistFromLocalStorage`: Loads the watchlist from local storage when the app starts.

## Backend API

The Node.js backend is responsible for fetching stock data from the Finnhub API. Below are the key API routes:

### `/api/quote/:symbol`

Fetches stock quote information for a specific stock symbol.

- **Method**: `GET`
- **Params**: `symbol` (string) - The stock symbol to fetch data for.
- **Response**: 
  ```json
  {
    "c": 125.45, // Current price
    "pc": 124.75, // Previous close
    "d": 0.7, // Price change
    "dp": 0.56 // Percent change
  }

### `/api/search`

Searches for stock symbols based on a query string.

- **Method**: `GET`
- **Params**: `query` (string) - The search term to find matching stock symbols.
- **Response**: 
  ```json
  [
  {
    "symbol": "AAPL",
    "description": "Apple Inc."
  },
  {
    "symbol": "GOOGL",
    "description": "Alphabet Inc."
  }
   ]

## Key Design Choices

### **App.js**
- **Persistent Watchlist**: 
  - Utilizes `localStorage` to persist the user's watchlist across sessions. This is handled via `saveWatchlistToLocalStorage` and `loadWatchlistFromLocalStorage`, ensuring that the watchlist is loaded when the app starts.
- **Dynamic Routing**: 
  - Uses `react-router-dom` to enable navigation between different routes (`/`, `/stock/:symbol`, `/watchlist`). The app dynamically updates the UI based on the current route, such as displaying stock details or the watchlist.
- **Search Functionality**: 
  - The `SearchBarHandler` integrates search functionality with navigation, directing users to the relevant stock details page when they input a stock symbol.

### **SearchBar Component**
- **Debouncing for Efficiency**: 
  - Implements a 500ms debounce to limit the number of API requests when users are typing, preventing unnecessary network calls and improving performance.
- **User-Friendly Suggestions**: 
  - Provides real-time stock symbol suggestions in a dropdown based on user input. Clicking on a suggestion directly navigates to the stock’s details, improving the user experience.

### **StockDetailWrapper**
- **Watchlist Integration**: 
  - Automatically checks if the stock is already in the user's watchlist (case-insensitive) and disables the "Add to Watchlist" button if it is already present, ensuring no duplicate entries.

### **Watchlist Component**
- **Auto-Refreshing Data**: 
  - Periodically refreshes stock data every 60 seconds to keep the displayed information up-to-date. A circular progress bar visually shows the time remaining until the next refresh.
- **Sorting and Filtering**: 
  - Users can sort the watchlist by stock symbol, price, or percentage change, and filter it by typing in a search input. This enhances the usability of the watchlist, especially as it grows.

### **Node.js Backend**
- **Finnhub API Integration**: 
  - Handles fetching stock data (current price, percentage change, etc.) and stock symbol search results via two key routes (`/api/quote/:symbol` and `/api/search`). This abstraction ensures that the frontend only communicates with the Node.js backend, simplifying API integration.
- **Error Handling**: 
  - Gracefully manages common API errors such as rate limits and access issues, providing meaningful feedback to the frontend and ensuring robustness.

## TODOs

- **Recharts for Stock Graphs**:
  - The app currently lacks stock graph features due to missing Finnhub premium data. Future iterations should integrate `Recharts` or similar libraries to visualize stock trends, once access to the premium API is available.

- **Search Suggestions Improvements**:
  - Handle edge cases in search suggestions more efficiently, such as dismissing suggestions when the user clicks in and out of the search bar, or refining the experience when no results are found.
  - Stocks with periods in them

- **More Efficient Stock Loading**:
  - Implement lazy loading or infinite scrolling to improve performance when the watchlist grows. Load stock data only as the user scrolls, reducing the initial load time.

- **More Testing**:
  - Increase test coverage to ensure that components behave as expected. Focus on edge cases (e.g., empty watchlists, slow API responses, or invalid symbols) to improve the app's robustness and user experience.
