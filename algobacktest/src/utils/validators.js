export const validateConfig = (config) => {
  const errors = {};

  if (!config.symbol) {
    errors.symbol = 'Stock symbol is required';
  }

  if (!config.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!config.endDate) {
    errors.endDate = 'End date is required';
  }

  if (config.startDate && config.endDate) {
    const start = new Date(config.startDate);
    const end = new Date(config.endDate);
    const msDiff = end.getTime() - start.getTime();
    
    if (start >= end) {
      errors.endDate = 'End date must be after start date';
    } else {
      const daysDiff = msDiff / (1000 * 60 * 60 * 24);
      if (daysDiff > 1825) { // ~5 years
        errors.endDate = 'Max date range is 5 years';
      }
    }
  }

  if (!config.strategy) {
    errors.strategy = 'Strategy must be selected';
  }

  // Parameter validation happens dynamically based on strategy configuration
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
