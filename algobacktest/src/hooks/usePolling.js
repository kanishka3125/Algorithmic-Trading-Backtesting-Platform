import { useEffect, useRef } from 'react';
import { useBacktest } from './useBacktest';
import { getResults } from '../services/backtestService';
import { useNavigate } from 'react-router-dom';

export const usePolling = () => {
  const { 
    status, 
    backtestId, 
    setStatus, 
    setMetrics, 
    setEquityCurve, 
    setOhlcData, 
    setSignals, 
    setErrorMessage,
    config
  } = useBacktest();
  
  const navigate = useNavigate();
  const pollTimerRef = useRef(null);
  const attemptsRef = useRef(0);
  
  const MAX_ATTEMPTS = parseInt(import.meta.env.VITE_MAX_POLL_ATTEMPTS || '30', 10);
  const POLL_INTERVAL = parseInt(import.meta.env.VITE_POLL_INTERVAL || '2000', 10);

  useEffect(() => {
    if (status !== 'loading' || !backtestId) {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      return;
    }

    attemptsRef.current = 0;

    const fetchStatus = async () => {
      try {
        attemptsRef.current += 1;
        
        if (attemptsRef.current > MAX_ATTEMPTS) {
          clearInterval(pollTimerRef.current);
          setStatus('error');
          setErrorMessage('Backtest timed out. Please try again.');
          return;
        }

        const res = await getResults(backtestId, config);
        const data = res.data;

        if (data.status === 'completed') {
          clearInterval(pollTimerRef.current);
          
          setMetrics(data.metrics);
          setEquityCurve(data.equity_curve);
          setOhlcData(data.ohlc_data);
          setSignals(data.signals);
          
          setStatus('success');
          navigate(`/dashboard/results/${backtestId}`);
        } else if (data.status === 'failed') {
          clearInterval(pollTimerRef.current);
          setStatus('error');
          setErrorMessage(data.error_message || 'Backtest failed on the server.');
        }
        // If 'running', do nothing, will poll again
      } catch (err) {
        // Optional: fail immediately on network error or tolerate a few before failing
        clearInterval(pollTimerRef.current);
        setStatus('error');
        setErrorMessage('Network error while checking status. Cannot reach server.');
      }
    };

    pollTimerRef.current = setInterval(fetchStatus, POLL_INTERVAL);
    
    // Initial fetch
    fetchStatus();

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [status, backtestId, setStatus, setMetrics, setEquityCurve, setOhlcData, setSignals, setErrorMessage, navigate, config]);
};
