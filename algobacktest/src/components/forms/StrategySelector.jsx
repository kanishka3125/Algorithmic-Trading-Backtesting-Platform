import React from 'react';
import { useBacktest } from '../../hooks/useBacktest';
import { STRATEGIES, STRATEGY_CONFIG } from '../../utils/strategyConfig';

const StrategySelector = () => {
  const { config, setConfigValue } = useBacktest();

  return (
    <div className="form-group">
      <label className="form-label">Strategy</label>
      <select 
        className="form-select"
        value={config.strategy}
        onChange={(e) => {
          const strat = e.target.value;
          setConfigValue('strategy', strat);
          
          // Pre-fill parameters with defaults
          if (strat && STRATEGY_CONFIG[strat]) {
            const defaults = {};
            STRATEGY_CONFIG[strat].params.forEach(p => {
              defaults[p.key] = p.default;
            });
            setConfigValue('parameters', defaults);
          }
        }}
      >
        <option value="" disabled>Select a strategy...</option>
        {STRATEGIES.map(s => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      
      {config.strategy && STRATEGY_CONFIG[config.strategy] && (
        <p className="text-secondary" style={{ fontSize: '13px', marginTop: '4px' }}>
          {STRATEGY_CONFIG[config.strategy].description}
        </p>
      )}
    </div>
  );
};

export default StrategySelector;
