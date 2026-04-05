import React, { useState } from 'react';
import StrategySelector from '../components/forms/StrategySelector';
import ComparisonChart from '../components/charts/ComparisonChart';
import { STRATEGIES, STRATEGY_CONFIG } from '../utils/strategyConfig';
import { formatPct, formatNumber, colorClass } from '../utils/formatters';
import TiltCard from '../components/ui/TiltCard';

// Generate some mock multi-strategy data for the comparison page (since it's purely frontend for now)
const generateMockComparisonData = (strategiesConfig) => {
  const result = [];
  const baseStartDate = new Date('2022-01-01');
  const baseEndDate = new Date('2023-12-31');
  
  strategiesConfig.forEach((strat, index) => {
    let currentDate = new Date(baseStartDate);
    const data = [];
    let currentReturn = 0;
    
    // Each strategy gets its own volatility/drift based on its name to look different
    const drift = strat.id === 'MA' ? 0.05 : (strat.id === 'RSI' ? 0.08 : (strat.id === 'MACD' ? 0.03 : 0.06));
    const vol = 0.5 + index * 0.2;
    
    while (currentDate <= baseEndDate) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        currentReturn += (Math.random() - 0.48) * vol + drift;
        data.push({
          date: currentDate.toISOString().split('T')[0],
          returnPct: currentReturn
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    result.push({
      id: strat.id,
      name: strat.name,
      color: strat.color,
      data,
      metrics: {
        totalReturn: currentReturn,
        winRate: 40 + Math.random() * 30,
        sharpeRatio: 0.5 + Math.random() * 2,
        maxDrawdown: -(5 + Math.random() * 20),
        tradesCount: Math.floor(10 + Math.random() * 100)
      }
    });
  });
  
  return result;
};

const ComparisonPage = () => {
  const [selectedStrategies, setSelectedStrategies] = useState([
    { id: 'MA', name: 'Moving Average', color: 'var(--chart1)' },
    { id: 'RSI', name: 'RSI', color: 'var(--chart2)' }
  ]);
  
  const [comparisonResults, setComparisonResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stratToAdd, setStratToAdd] = useState('');

  const availableColors = ['var(--chart1)', 'var(--chart2)', 'var(--chart3)', 'var(--chart4)'];

  const handleAddStrategy = () => {
    if (stratToAdd && selectedStrategies.length < 4 && !selectedStrategies.find(s => s.id === stratToAdd)) {
      const config = STRATEGIES.find(s => s.value === stratToAdd);
      if (config) {
        setSelectedStrategies([...selectedStrategies, {
          id: config.value,
          name: config.label.split('(')[0].trim(),
          color: availableColors[selectedStrategies.length]
        }]);
        setStratToAdd('');
      }
    }
  };

  const handleRemoveStrategy = (id) => {
    setSelectedStrategies(selectedStrategies.filter(s => s.id !== id));
    // Reset colors
    setSelectedStrategies(prev => prev.map((s, idx) => ({ ...s, color: availableColors[idx] })));
  };

  const handleRunComparison = () => {
    if (selectedStrategies.length === 0) return;
    
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setComparisonResults(generateMockComparisonData(selectedStrategies));
      setIsLoading(false);
    }, 1200);
  };

  const getBestMetric = (metricKey) => {
    if (!comparisonResults) return null;
    let best = comparisonResults[0];
    
    comparisonResults.forEach(r => {
      // For drawdown, closer to 0 (higher) is better
      if (r.metrics[metricKey] > best.metrics[metricKey]) {
        best = r;
      }
    });
    return best.id;
  };

  return (
    <div className="flex-col gap-2xl w-full animate-in" style={{ paddingBottom: 'var(--space-2xl)' }}>
      {/* Header Bar */}
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 style={{ marginBottom: '8px' }}>Strategy Comparison</h1>
          <p className="text-secondary">Evaluate multi-strategy performance head-to-head</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 'var(--space-xl)' }}>
        {/* Left Column Config Panel */}
        <TiltCard intensity={5} className="animate-in" style={{ alignSelf: 'start', animationDelay: '100ms' }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>Selected Models</h3>
          
          <div className="flex-col gap-sm" style={{ marginBottom: 'var(--space-lg)' }}>
            {selectedStrategies.map(strat => (
              <div key={strat.id} className="flex justify-between items-center" style={{ padding: '10px 14px', background: 'var(--bg-deep)', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-sm">
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: strat.color }} />
                  <strong>{strat.id}</strong>
                  <span className="text-secondary" style={{ fontSize: '13px' }}>{strat.name}</span>
                </div>
                <button 
                  className="btn btn-ghost btn-sm" 
                  style={{ padding: '4px', color: 'var(--muted)' }}
                  onClick={() => handleRemoveStrategy(strat.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ))}
            {selectedStrategies.length === 0 && (
              <div className="text-muted" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>No strategies selected</div>
            )}
          </div>

          <div className="divider" style={{ margin: 'var(--space-md) 0' }}></div>

          <div className="form-group flex items-end gap-sm" style={{ marginBottom: 'var(--space-xl)' }}>
            <div className="w-full">
              <label className="form-label">Add Strategy (Max 4)</label>
              <select 
                className="form-select" 
                value={stratToAdd}
                onChange={(e) => setStratToAdd(e.target.value)}
                disabled={selectedStrategies.length >= 4}
              >
                <option value="" disabled>Select...</option>
                {STRATEGIES.map(s => (
                  <option 
                    key={s.value} 
                    value={s.value} 
                    disabled={selectedStrategies.some(sel => sel.id === s.value)}
                  >
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <button 
              className="btn btn-secondary hover-scale"
              onClick={handleAddStrategy}
              disabled={!stratToAdd || selectedStrategies.length >= 4}
            >
              Add
            </button>
          </div>

          <button 
            className="btn btn-primary btn-lg btn-glow" 
            onClick={handleRunComparison}
            disabled={selectedStrategies.length === 0 || isLoading}
            style={{ marginBottom: 'var(--space-2xl)' }}
          >
            {isLoading ? 'Running Comparison...' : 'RUN COMPARISON'}
          </button>

          <div className="flex-col gap-xl">
            <h4 className="label" style={{ color: 'var(--primary)' }}>Understanding Metrics</h4>
            
            <div className="flex-col gap-lg">
              <div className="flex-col gap-xs">
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Sharpe Ratio</span>
                <p style={{ fontSize: '12px', margin: 0, opacity: 0.8, lineHeight: 1.5 }}>Measures risk-adjusted return. A ratio above 1.0 is generally considered good, while 2.0+ is exceptional.</p>
              </div>
              
              <div className="flex-col gap-xs">
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Max Drawdown</span>
                <p style={{ fontSize: '12px', margin: 0, opacity: 0.8, lineHeight: 1.5 }}>The largest peak-to-trough decline. Traders look for smaller drawdowns to manage emotional and capital risk.</p>
              </div>

              <div className="flex-col gap-xs">
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Profit Factor</span>
                <p style={{ fontSize: '12px', margin: 0, opacity: 0.8, lineHeight: 1.5 }}>Ratio of gross profit vs gross loss. A factor {'>'} 1.0 means the strategy is profitable.</p>
              </div>
            </div>

            <div className="card" style={{ background: 'var(--primary-dim)', borderColor: 'var(--primary)', padding: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
              <h4 className="flex items-center gap-sm" style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '13px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                Comparison Pro-Tip
              </h4>
              <p style={{ fontSize: '12px', margin: 0, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Compare strategies with different parameters (e.g. RSI 14 vs RSI 9) to find the optimal sensitivity for the current market volatility.
              </p>
            </div>
          </div>
        </TiltCard>

        {/* Right Column Visuals */}
        <div className="flex-col gap-xl">
          {isLoading ? (
             <div className="card skeleton" style={{ height: '460px', width: '100%' }} />
          ) : (
            <>
              {comparisonResults ? (
                <>
                  <ComparisonChart strategies={comparisonResults} />
                  
                  {/* Metrics Comparison Table */}
                  <div className="animate-in" style={{ animationDelay: '500ms' }}>
                    <TiltCard intensity={2} style={{ padding: 0, overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                        <thead>
                          <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                            <th className="label" style={{ padding: 'var(--space-md)', textAlign: 'left' }}>Metric</th>
                            {comparisonResults.map(r => (
                              <th key={r.id} style={{ padding: 'var(--space-md)', borderLeft: '1px solid var(--border)' }}>
                                <div className="flex justify-center items-center gap-sm">
                                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: r.color }} />
                                  {r.id}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { key: 'totalReturn', label: 'Total Return', fmt: formatPct, isGood: true },
                            { key: 'winRate', label: 'Win Rate', fmt: formatPct, isGood: true },
                            { key: 'sharpeRatio', label: 'Sharpe Ratio', fmt: formatNumber, isGood: true },
                            { key: 'maxDrawdown', label: 'Max Drawdown', fmt: formatPct, isGood: true /* closer to 0 */ },
                            { key: 'tradesCount', label: '# Trades', fmt: (v) => v, isGood: false }
                          ].map((metric) => {
                            const bestId = metric.isGood ? getBestMetric(metric.key) : null;
                            return (
                              <tr key={metric.key} style={{ borderBottom: '1px solid var(--border)' }} className="card-hover">
                                <td className="text-secondary" style={{ padding: '12px var(--space-md)', textAlign: 'left', fontWeight: 500 }}>
                                  {metric.label}
                                </td>
                                {comparisonResults.map(r => {
                                  const isBest = bestId === r.id;
                                  return (
                                    <td 
                                      key={r.id} 
                                      className="mono" 
                                      style={{ 
                                        padding: '12px var(--space-md)', 
                                        borderLeft: '1px solid var(--border)',
                                        color: isBest ? 'var(--primary)' : 'var(--text-primary)',
                                        fontWeight: isBest ? 'bold' : 'normal',
                                        background: isBest ? 'var(--primary-dim)' : 'transparent'
                                      }}
                                    >
                                      {metric.fmt(r.metrics[metric.key])}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </TiltCard>
                  </div>
                </>
              ) : (
                <div className="card flex items-center justify-center p-2xl text-muted" style={{ height: '460px' }}>
                  Select strategies and click 'Run Comparison' to display charts and metrics.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
