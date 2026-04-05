import React, { useState, useEffect } from 'react';
import { useBacktest } from '../../hooks/useBacktest';
import { STRATEGY_CONFIG } from '../../utils/strategyConfig';

const QuickPresets = () => {
  const { config, setConfig } = useBacktest();
  const [userPresets, setUserPresets] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('algo_user_presets');
    if (saved) {
      setUserPresets(JSON.parse(saved));
    }
  }, []);

  const defaultPresets = [
    {
      id: 'tech_momentum',
      title: 'Tech Momentum',
      description: 'Trend following on Apple using standard MACD signals.',
      badges: ['AAPL', 'MACD', 'Trend'],
      config: {
        symbol: 'AAPL',
        startDate: '2022-01-01',
        endDate: new Date().toISOString().split('T')[0],
        strategy: 'MACD',
        parameters: { fast_period: 12, slow_period: 26, signal_period: 9 }
      }
    },
    {
      id: 'mean_reversion',
      title: 'Crypto Rebound',
      description: 'Mean reversion on volatile assets using tight RSI bounds.',
      badges: ['NVDA', 'RSI', 'Reversal'],
      config: {
        symbol: 'NVDA', // using NVDA as proxy since we only have STOCKS list
        startDate: '2023-01-01',
        endDate: new Date().toISOString().split('T')[0],
        strategy: 'RSI',
        parameters: { period: 10, overbought: 80, oversold: 20 }
      }
    },
    {
      id: 'volatility_breakout',
      title: 'Volatility Breakout',
      description: 'Trading extreme moves outside standard deviations.',
      badges: ['TSLA', 'B-Bands', 'Breakout'],
      config: {
        symbol: 'TSLA',
        startDate: '2022-06-01',
        endDate: new Date().toISOString().split('T')[0],
        strategy: 'BB',
        parameters: { window: 20, std_dev: 2.5 }
      }
    }
  ];

  const applyPreset = (presetConfig) => {
    setConfig(presetConfig);
  };

  const saveCurrentConfig = () => {
    if (!config.symbol || !config.strategy) return;
    
    const newPreset = {
      id: `custom_${Date.now()}`,
      title: `Saved: ${config.symbol} ${config.strategy}`,
      description: 'Custom user configuration saved locally.',
      badges: [config.symbol, config.strategy, 'Custom'],
      config: { ...config }
    };
    
    const updated = [newPreset, ...userPresets];
    setUserPresets(updated);
    localStorage.setItem('algo_user_presets', JSON.stringify(updated));
  };

  const deleteUserPreset = (id, e) => {
    e.stopPropagation();
    const updated = userPresets.filter(p => p.id !== id);
    setUserPresets(updated);
    localStorage.setItem('algo_user_presets', JSON.stringify(updated));
  };

  const presetCard = (preset, isUser = false) => (
    <div 
      key={preset.id} 
      className="card card-hover" 
      style={{ padding: 'var(--space-md)', cursor: 'pointer', position: 'relative' }}
      onClick={() => applyPreset(preset.config)}
    >
      <div className="flex justify-between items-start mb-2" style={{ marginBottom: '8px' }}>
        <h4 style={{ margin: 0, color: isUser ? 'var(--warning)' : 'var(--primary)' }}>{preset.title}</h4>
        {isUser ? (
          <button 
            onClick={(e) => deleteUserPreset(preset.id, e)} 
            className="text-muted"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
          >
            ×
          </button>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        )}
      </div>
      
      <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '12px', lineHeight: 1.4 }}>
        {preset.description}
      </p>
      
      <div className="flex gap-sm flex-wrap">
        {preset.badges.map(b => (
          <span key={b} className="badge badge-neutral" style={{ fontSize: '10px' }}>{b}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-col gap-lg" style={{ height: '100%' }}>
      <div className="flex justify-between items-end" style={{ marginBottom: '8px' }}>
        <div>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 2 13 9 20 9"></polyline>
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            </svg>
            Presets
          </h3>
          <p className="text-secondary" style={{ fontSize: '13px' }}>Click to auto-fill sandbox.</p>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={saveCurrentConfig} disabled={!config.symbol || !config.strategy}>
          Save Current
        </button>
      </div>

      <div className="flex-col gap-md" style={{ flex: 1, overflowY: 'auto' }}>
        {userPresets.length > 0 && (
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <h4 className="label text-muted" style={{ marginBottom: 'var(--space-sm)' }}>My Saved</h4>
            <div className="flex-col gap-md">
              {userPresets.map(p => presetCard(p, true))}
            </div>
            <div className="divider" style={{ margin: 'var(--space-md) 0' }}></div>
          </div>
        )}
        
        <div>
          <h4 className="label text-muted" style={{ marginBottom: 'var(--space-sm)' }}>Trending</h4>
          <div className="flex-col gap-md">
            {defaultPresets.map(p => presetCard(p, false))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPresets;
