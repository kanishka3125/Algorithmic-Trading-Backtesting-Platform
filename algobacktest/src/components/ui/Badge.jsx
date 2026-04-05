import React from 'react';

const Badge = ({ type = 'neutral', label }) => {
  let badgeClass = 'badge-neutral';
  
  if (type.toLowerCase() === 'buy') {
    badgeClass = 'badge-buy';
  } else if (type.toLowerCase() === 'sell') {
    badgeClass = 'badge-sell';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {label || type}
    </span>
  );
};

export default Badge;
