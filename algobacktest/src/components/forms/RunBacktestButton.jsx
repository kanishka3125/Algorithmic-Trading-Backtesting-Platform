import React from 'react';
import { useBacktest } from '../../hooks/useBacktest';
import { validateConfig } from '../../utils/validators';

const RunBacktestButton = () => {
  const { config, status, executeBacktest } = useBacktest();

  // Button disabled state
  const validation = validateConfig(config);
  const isInvalid = !validation.isValid;
  const isLoading = status === 'loading';

  return (
    <button 
      className="btn btn-primary btn-lg btn-glow btn-active" 
      onClick={executeBacktest}
      disabled={isInvalid || isLoading}
      style={{
        marginTop: 'var(--space-xl)',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      {isLoading ? (
        <>
          <div style={{
            width: '18px',
            height: '18px',
            border: '2px solid rgba(10, 22, 40, 0.3)',
            borderTopColor: '#0a1628',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '8px'
          }} />
          Initializing Engine...
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          RUN BACKTEST
        </>
      )}
    </button>
  );
};

export default RunBacktestButton;
