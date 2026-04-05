import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBacktest } from '../hooks/useBacktest';
import MetricsCard from '../components/display/MetricsCard';
import EquityCurveChart from '../components/charts/EquityCurveChart';
import CandlestickChart from '../components/charts/CandlestickChart';
import InsightsPanel from '../components/display/InsightsPanel';
import { formatPct, formatNumber } from '../utils/formatters';
import SkeletonCard from '../components/ui/SkeletonCard';
import TiltCard from '../components/ui/TiltCard';

const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backtestId, metrics, equityCurve, ohlcData, signals, status } = useBacktest();

  // Redirect if no backtest ID matching or missing context data
  useEffect(() => {
    if (!backtestId || backtestId !== id) {
      if (status !== 'loading' && status !== 'success') {
        navigate('/dashboard');
      }
    }
  }, [id, backtestId, status, navigate]);

  const isLoading = status === 'loading' || !metrics;

  return (
    <div className="flex-col gap-2xl w-full" style={{ paddingBottom: 'var(--space-2xl)' }}>
      {/* Header Bar */}
      <div className="flex justify-between items-center w-full animate-in" style={{ animationDelay: '0ms' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Performance Analysis</h1>
          <p className="text-secondary">Backtest Results for Session <span className="mono text-muted">{id}</span></p>
        </div>
        
        <div className="flex gap-md">
          <button className="btn btn-secondary hover-scale btn-active" onClick={() => navigate('/dashboard')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Reconfigure
          </button>
          <button className="btn btn-primary btn-glow btn-active" onClick={() => navigate(`/dashboard/trades/${id}`)}>
            View Trade History
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="card skeleton mb-lg" style={{ height: '100px', width: '100%', marginBottom: 'var(--space-2xl)' }} />
      ) : (
        <div className="animate-in" style={{ animationDelay: '100ms' }}>
          <TiltCard intensity={2}>
            <InsightsPanel metrics={metrics} />
          </TiltCard>
        </div>
      )}

      {/* Metrics Row */}
      <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', animationDelay: '300ms' }}>
        {isLoading ? (
          <SkeletonCard count={5} height="110px" />
        ) : (
          <>
            <MetricsCard index={0} label="Total Return" value={formatPct(metrics.total_return)} type={metrics.total_return >= 0 ? 'profit' : 'loss'} />
            <MetricsCard index={1} label="Win Rate" value={formatPct(metrics.win_rate)} type={metrics.win_rate >= 50 ? 'profit' : 'loss'} />
            <MetricsCard index={2} label="Sharpe Ratio" value={formatNumber(metrics.sharpe_ratio)} type={metrics.sharpe_ratio >= 1.0 ? 'profit' : 'neutral'} subLabel="Risk-adjusted return" />
            <MetricsCard index={3} label="Max Drawdown" value={formatPct(metrics.max_drawdown)} type="loss" />
            <MetricsCard index={4} label="Total Trades" value={metrics.num_trades} type="neutral" />
          </>
        )}
      </div>

      {/* Equity Curve Chart */}
      <div className="w-full animate-in" style={{ animationDelay: '500ms' }}>
        {isLoading ? (
          <div className="card skeleton" style={{ height: '480px', width: '100%' }} />
        ) : (
          <EquityCurveChart data={equityCurve} />
        )}
      </div>
      
      {/* Candlestick Chart */}
      <div className="w-full animate-in" style={{ animationDelay: '600ms' }}>
        {isLoading ? (
          <div className="card skeleton" style={{ height: '480px', width: '100%' }} />
        ) : (
          <CandlestickChart data={ohlcData} signals={signals} />
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
