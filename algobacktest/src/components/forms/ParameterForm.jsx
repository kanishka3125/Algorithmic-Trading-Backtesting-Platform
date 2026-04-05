import React from 'react';
import { useBacktest } from '../../hooks/useBacktest';
import { STRATEGY_CONFIG } from '../../utils/strategyConfig';
import Tooltip from '../ui/Tooltip';

const ParameterForm = () => {
  const { config, setConfigValue } = useBacktest();

  if (!config.strategy || !STRATEGY_CONFIG[config.strategy]) {
    return null; // Don't render anything if no strategy is selected
  }

  const stratConfig = STRATEGY_CONFIG[config.strategy];

  const handleParamChange = (key, value, type) => {
    let parsedValue = value;
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }
    
    setConfigValue('parameters', {
      ...config.parameters,
      [key]: parsedValue
    });
  };

  return (
    <div style={{
      marginTop: 'var(--space-md)',
      padding: 'var(--space-md)',
      background: 'var(--bg-elevated)',
      borderRadius: 'var(--radius-card)',
      border: '1px solid var(--border)'
    }}>
      <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--space-md)' }}>
        <h3 style={{ fontSize: '14px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Strategy Parameters
        </h3>
      </div>
      
      <div className="form-group gap-md">
        {stratConfig.params.map(param => (
          <div key={param.key} className="flex-col gap-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <label className="form-label" style={{ margin: 0 }}>{param.label}</label>
                <Tooltip content={param.tooltip}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary" style={{ cursor: 'help' }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </Tooltip>
              </div>
              <input 
                type="number" 
                className="form-input" 
                style={{ width: '80px', textAlign: 'right', padding: '4px 8px', fontSize: '13px', background: 'var(--bg-deep)' }}
                value={config.parameters[param.key] !== undefined ? config.parameters[param.key] : ''}
                min={param.min}
                max={param.max}
                step={param.step || 1}
                onChange={(e) => handleParamChange(param.key, e.target.value, param.type)}
              />
            </div>
            
            {param.type === 'number' && (
              <div className="w-full flex items-center gap-md">
                <span className="text-muted" style={{ fontSize: '11px', width: '20px', textAlign: 'right' }}>{param.min}</span>
                <input 
                  type="range"
                  style={{ flex: 1, accentColor: 'var(--primary)', cursor: 'pointer' }}
                  min={param.min}
                  max={param.max}
                  step={param.step || 1}
                  value={config.parameters[param.key] !== undefined ? config.parameters[param.key] : param.min}
                  onChange={(e) => handleParamChange(param.key, e.target.value, 'number')}
                />
                <span className="text-muted" style={{ fontSize: '11px', width: '20px' }}>{param.max}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParameterForm;
