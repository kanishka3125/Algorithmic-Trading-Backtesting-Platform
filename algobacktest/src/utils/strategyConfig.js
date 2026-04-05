export const STRATEGY_CONFIG = {
  MA: {
    label: 'Moving Average (MA)',
    description: 'Generates signals when short-term MA crosses long-term MA',
    params: [
      { key: 'short_window', label: 'Short Window', tooltip: 'Number of periods for fast moving average (e.g. 10)', type: 'number', default: 10, min: 2, max: 200 },
      { key: 'long_window', label: 'Long Window', tooltip: 'Number of periods for slow moving average (e.g. 50)', type: 'number', default: 50, min: 5, max: 500 },
    ],
  },
  RSI: {
    label: 'Relative Strength Index (RSI)',
    description: 'Buys when oversold, sells when overbought based on RSI momentum',
    params: [
      { key: 'period', label: 'RSI Period', tooltip: 'Lookback period for RSI calculation (default: 14)', type: 'number', default: 14, min: 2, max: 100 },
      { key: 'overbought', label: 'Overbought Level', tooltip: 'RSI value indicating overbought (default: 70)', type: 'number', default: 70, min: 51, max: 99 },
      { key: 'oversold', label: 'Oversold Level', tooltip: 'RSI value indicating oversold (default: 30)', type: 'number', default: 30, min: 1, max: 49 },
    ],
  },
  MACD: {
    label: 'MACD',
    description: 'Trend-following using MACD line crossover with signal line',
    params: [
      { key: 'fast_period', label: 'Fast Period', tooltip: 'Fast EMA period (default: 12)', type: 'number', default: 12, min: 2, max: 100 },
      { key: 'slow_period', label: 'Slow Period', tooltip: 'Slow EMA period (default: 26)', type: 'number', default: 26, min: 5, max: 200 },
      { key: 'signal_period', label: 'Signal Period', tooltip: 'Signal line EMA period (default: 9)', type: 'number', default: 9, min: 2, max: 50 },
    ],
  },
  BB: {
    label: 'Bollinger Bands (BB)',
    description: 'Mean reversion strategy using price channel breakouts',
    params: [
      { key: 'window', label: 'Window Period', tooltip: 'Rolling window for band calculation (default: 20)', type: 'number', default: 20, min: 2, max: 200 },
      { key: 'std_dev', label: 'Std Dev Multiplier', tooltip: 'Standard deviations for band width (default: 2.0)', type: 'number', default: 2.0, min: 0.5, max: 5.0, step: 0.1 },
    ],
  },
};

export const STRATEGIES = Object.entries(STRATEGY_CONFIG).map(([key, val]) => ({
  value: key,
  label: val.label,
  description: val.description,
}));
