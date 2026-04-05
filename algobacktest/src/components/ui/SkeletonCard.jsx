import React from 'react';

const SkeletonCard = ({ count = 1, height = '120px' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card skeleton" style={{ height, width: '100%' }} />
      ))}
    </>
  );
};

export default SkeletonCard;
