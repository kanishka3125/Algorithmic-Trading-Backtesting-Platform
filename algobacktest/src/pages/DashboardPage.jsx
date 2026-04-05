import React from 'react';
import StockSelector from '../components/forms/StockSelector';
import DateRangePicker from '../components/forms/DateRangePicker';
import StrategySelector from '../components/forms/StrategySelector';
import ParameterForm from '../components/forms/ParameterForm';
import RunBacktestButton from '../components/forms/RunBacktestButton';
import Loader from '../components/ui/Loader';
import ErrorBanner from '../components/ui/ErrorBanner';
import QuickPresets from '../components/display/QuickPresets';
import { useBacktest } from '../hooks/useBacktest';
import { usePolling } from '../hooks/usePolling';
import TiltCard from '../components/ui/TiltCard';

const DashboardPage = () => {
  const { status, errorMessage, executeBacktest } = useBacktest();
  
  // Enable polling if backtest is currently loading
  usePolling();

  return (
    <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.2fr) 1fr', gap: 'var(--space-2xl)', alignItems: 'start' }}>
      {status === 'loading' && <Loader message="Running historical simulation..." />}
      
      <div>
        <h1 style={{ marginBottom: '8px' }}>Configure Sandbox</h1>
        <p className="text-secondary" style={{ maxWidth: '600px', marginBottom: 'var(--space-xl)' }}>
          Design your algorithmic strategy by selecting a baseline asset, historical range, and technical indicators. We'll simulate its performance over the time period and benchmark it against a standard buy-and-hold approach.
        </p>

        {status === 'error' && errorMessage && (
          <div className="animate-in" style={{ marginBottom: 'var(--space-xl)', animationDelay: '100ms' }}>
            <ErrorBanner message={errorMessage} onRetry={executeBacktest} />
          </div>
        )}

        <TiltCard className="animate-in" style={{ maxWidth: '600px', animationDelay: '200ms' }}>
          <div style={{ padding: '0 0 var(--space-lg) 0', borderBottom: '1px solid var(--border)' }}>
            <h3>Configuration Panel</h3>
          </div>
          
          <div style={{ marginTop: 'var(--space-lg)' }} className="flex-col gap-lg">
            <StockSelector />
            
            <div className="divider" style={{ margin: 'var(--space-sm) 0' }} />
            
            <DateRangePicker />
            
            <div className="divider" style={{ margin: 'var(--space-sm) 0' }} />
            
            <StrategySelector />
            
            <ParameterForm />
          </div>

          <RunBacktestButton />
        </TiltCard>
      </div>
      
      {/* Interactive Quick Presets Fill the Blank Right Space */}
      <div className="animate-in" style={{ position: 'sticky', top: 'calc(var(--navbar-height) + var(--space-2xl))', height: '100%', animationDelay: '400ms' }}>
        <TiltCard intensity={5}>
          <QuickPresets />
        </TiltCard>
      </div>
    </div>
  );
};

export default DashboardPage;
