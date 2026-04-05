import React, { useState } from 'react';
import { useBacktest } from '../../hooks/useBacktest';
import { STOCKS } from '../../constants/stocks';

const StockSelector = () => {
  const { config, setConfigValue } = useBacktest();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredStocks = STOCKS.filter(s => 
    s.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedStock = STOCKS.find(s => s.ticker === config.symbol);

  return (
    <div className="form-group" style={{ position: 'relative' }}>
      <label className="form-label">Stock Symbol</label>
      <div 
        className="form-input flex items-center justify-between"
        style={{ cursor: 'pointer' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedStock ? (
            <span><strong>{selectedStock.ticker}</strong> - {selectedStock.name}</span>
          ) : (
            <span className="text-muted">Select a stock...</span>
          )}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)',
          maxHeight: '250px',
          overflowY: 'auto',
          zIndex: 50,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ padding: 'var(--space-sm)' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search ticker or name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div style={{ padding: '0 0 var(--space-sm) 0' }}>
            {filteredStocks.length > 0 ? filteredStocks.map(stock => (
              <div 
                key={stock.ticker}
                style={{
                  padding: '10px var(--space-md)',
                  cursor: 'pointer',
                  background: config.symbol === stock.ticker ? 'var(--primary-dim)' : 'transparent',
                  borderLeft: config.symbol === stock.ticker ? '2px solid var(--primary)' : '2px solid transparent',
                }}
                onClick={() => {
                  setConfigValue('symbol', stock.ticker);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="card-hover"
              >
                <strong style={{ display: 'inline-block', width: '60px' }}>{stock.ticker}</strong>
                <span className="text-secondary">{stock.name}</span>
              </div>
            )) : (
              <div style={{ padding: '10px var(--space-md)' }} className="text-muted">
                No stocks found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockSelector;
