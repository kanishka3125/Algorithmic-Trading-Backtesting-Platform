import React from 'react';
import { formatNumber, colorClass } from '../../utils/formatters';

const MetricsCard = ({ label, value, type = 'neutral', subLabel, index = 0 }) => {
  let valueColorClass = 'text-primary'; // default text-primary maps to white-ish usually, but we have text-profit, text-loss, text-secondary in globals
  
  if (type === 'profit') valueColorClass = 'text-profit';
  else if (type === 'loss') valueColorClass = 'text-loss';
  else if (type === 'neutral') valueColorClass = 'text-primary'; // F1F5F9

  return (
    <div 
      className="card card-hover flex-col justify-between animate-in btn-active" 
      style={{ 
        height: '110px',
        animationDelay: `${index * 80}ms`
      }}
    >
      <div className="flex justify-between items-center w-full">
        <h4 className="label text-muted" style={{ margin: 0 }}>{label}</h4>
        
        {/* Dynamic icon based on type */}
        {type === 'profit' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-profit">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
        )}
        {type === 'loss' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-loss">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            <polyline points="17 18 23 18 23 12"></polyline>
          </svg>
        )}
        {type === 'neutral' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
            <line x1="12" y1="20" x2="12" y2="10"></line>
            <line x1="18" y1="20" x2="18" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="16"></line>
          </svg>
        )}
      </div>
      
      <div>
        <div className={`metric-value ${valueColorClass}`}>
          {value}
        </div>
        {subLabel && (
          <div className="text-secondary" style={{ fontSize: '12px', marginTop: '4px' }}>
            {subLabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;
