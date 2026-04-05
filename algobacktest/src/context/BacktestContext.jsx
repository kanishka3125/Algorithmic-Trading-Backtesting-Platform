import React, { createContext, useState, useCallback } from 'react';
import { runBacktest, getResults } from '../services/backtestService';

export const BacktestContext = createContext();

export const BacktestProvider = ({ children }) => {
  // Config state
  const [config, setConfig] = useState({
    symbol: '',
    startDate: '',
    endDate: '',
    strategy: '',
    parameters: {}
  });

  // Status state
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [backtestId, setBacktestId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Results state
  const [metrics, setMetrics] = useState(null);
  const [equityCurve, setEquityCurve] = useState([]);
  const [ohlcData, setOhlcData] = useState([]);
  const [signals, setSignals] = useState([]);
  const [trades, setTrades] = useState([]);

  const setConfigValue = useCallback((key, value) => {
    setConfig(prev => {
      // If strategy changes, reset parameters
      if (key === 'strategy' && prev.strategy !== value) {
        return { ...prev, [key]: value, parameters: {} };
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const executeBacktest = useCallback(async () => {
    try {
      setStatus('loading');
      setErrorMessage(null);
      
      const runRes = await runBacktest(config);
      setBacktestId(runRes.data.backtest_id);
      
      // The polling will be handled by a hook/component watching the status and backtestId
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to start backtest');
    }
  }, [config]);

  const resetState = useCallback(() => {
    setStatus('idle');
    setBacktestId(null);
    setErrorMessage(null);
    setMetrics(null);
    setEquityCurve([]);
    setOhlcData([]);
    setSignals([]);
    setTrades([]);
  }, []);

  const value = {
    config,
    setConfigValue,
    setConfig,
    
    status,
    setStatus,
    backtestId,
    errorMessage,
    setErrorMessage,
    
    metrics,
    setMetrics,
    equityCurve,
    setEquityCurve,
    ohlcData,
    setOhlcData,
    signals,
    setSignals,
    trades,
    setTrades,
    
    executeBacktest,
    resetState
  };

  return (
    <BacktestContext.Provider value={value}>
      {children}
    </BacktestContext.Provider>
  );
};
