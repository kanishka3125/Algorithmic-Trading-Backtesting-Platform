import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      gap: 'var(--space-lg)'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid var(--border)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <h2 style={{ color: 'var(--text-primary)', animation: 'pulse 1.5s ease-in-out infinite' }}>
        {message}
      </h2>
    </div>
  );
};

export default Loader;
