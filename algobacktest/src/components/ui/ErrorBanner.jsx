import React from 'react';

const ErrorBanner = ({ message, onRetry }) => {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--danger)',
      borderRadius: 'var(--radius-card)',
      padding: 'var(--space-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-md)'
    }}>
      <div className="flex items-center gap-md">
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'var(--danger-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--danger)'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <div>
          <h3 style={{ color: 'var(--danger)', marginBottom: '4px' }}>Error</h3>
          <p>{message || 'Something went wrong.'}</p>
        </div>
      </div>
      
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
