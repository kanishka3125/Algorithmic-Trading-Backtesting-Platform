import { useContext } from 'react';
import { BacktestContext } from '../context/BacktestContext';

export const useBacktest = () => {
  const context = useContext(BacktestContext);
  
  if (!context) {
    throw new Error('useBacktest must be used within a BacktestProvider');
  }
  
  return context;
};
