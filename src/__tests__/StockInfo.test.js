// src/__tests__/StockInfo.test.js
import { render, screen } from '@testing-library/react';
import StockInfo from '../components/StockInfo';

describe('StockInfo Component', () => {
  const stockData = {
    symbol: 'AAPL',
    currentPrice: 150,
    previousClose: 148,
    change: 2,
    percentChange: 1.35
  };

  test('displays stock information correctly', () => {
    render(<StockInfo stock={stockData} />);

    expect(screen.getByText(/aapl/i)).toBeInTheDocument();
    expect(screen.getByText(/current price: 150/i)).toBeInTheDocument();
    expect(screen.getByText(/previous close: 148/i)).toBeInTheDocument();
    expect(screen.getByText(/change: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/\(1.35%\)/i)).toBeInTheDocument();
  });
});