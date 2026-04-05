import React from 'react';
import { useBacktest } from '../../hooks/useBacktest';
import { validateConfig } from '../../utils/validators';

const DateRangePicker = () => {
  const { config, setConfigValue } = useBacktest();

  // We recalculate errors on render to show inline validation
  const validation = validateConfig(config);
  const errors = validation.errors;

  // Set max date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex gap-md w-full">
      <div className="form-group flex-1">
        <label className="form-label">Start Date</label>
        <input 
          type="date" 
          className={`form-input ${errors.startDate ? 'error' : ''}`}
          value={config.startDate}
          max={config.endDate || today}
          onChange={(e) => setConfigValue('startDate', e.target.value)}
        />
        {errors.startDate && <div className="form-error">{errors.startDate}</div>}
      </div>
      
      <div className="form-group flex-1">
        <label className="form-label">End Date</label>
        <input 
          type="date" 
          className={`form-input ${errors.endDate ? 'error' : ''}`}
          value={config.endDate}
          min={config.startDate}
          max={today}
          onChange={(e) => setConfigValue('endDate', e.target.value)}
        />
        {errors.endDate && <div className="form-error">{errors.endDate}</div>}
      </div>
    </div>
  );
};

export default DateRangePicker;
