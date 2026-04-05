import api from './api';

// Set this to true to use mock data for purely frontend development
const USE_MOCKS = true;

const generateMockEquityCurve = (startDate, endDate, startValue = 10000, volatility = 0.02) => {
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  const data = [];
  let currentValue = startValue;
  let benchmarkValue = startValue;

  while (currentDate <= end) {
    // Skip weekends
    const day = currentDate.getDay();
    if (day !== 0 && day !== 6) {
      // Random walk with drift
      const change = 1 + (Math.random() - 0.48) * volatility;
      currentValue *= change;
      
      const benchChange = 1 + (Math.random() - 0.49) * volatility;
      benchmarkValue *= benchChange;
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        value: currentValue,
        benchmark: benchmarkValue
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

const generateMockOHLC = (startDate, endDate, startPrice = 150, volatility = 0.03) => {
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  const data = [];
  let currentPrice = startPrice;

  while (currentDate <= end) {
    const day = currentDate.getDay();
    if (day !== 0 && day !== 6) {
      const open = currentPrice * (1 + (Math.random() - 0.5) * 0.01);
      const high = open * (1 + Math.random() * volatility);
      const low = open * (1 - Math.random() * volatility);
      const close = low + Math.random() * (high - low);
      const volume = Math.floor(Math.random() * 1000000) + 500000;
      
      currentPrice = close;
      
      data.push({
        x: currentDate.getTime(),
        o: open,
        h: high,
        l: low,
        c: close,
        v: volume
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

const generateMockTrades = (startDate, endDate, numTrades = 20) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const trades = [];
  
  for (let i = 0; i < numTrades; i++) {
    const tradeTime = start + Math.random() * (end - start);
    const isBuy = Math.random() > 0.5;
    const entryPrice = 100 + Math.random() * 100;
    const returnPct = (Math.random() - 0.4) * 10;
    const exitPrice = entryPrice * (1 + returnPct / 100);
    const quantity = Math.floor(Math.random() * 100) + 10;
    const pnl = (exitPrice - entryPrice) * quantity;
    
    trades.push({
      id: i + 1,
      date: new Date(tradeTime).toISOString().split('T')[0],
      type: isBuy ? 'BUY' : 'SELL',
      entry_price: entryPrice,
      exit_price: exitPrice,
      quantity,
      pnl,
      return_pct: returnPct
    });
  }
  
  return trades.sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const runBacktest = async (config) => {
  if (USE_MOCKS) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            backtest_id: `mock-bt-${Date.now()}`,
            status: 'running'
          }
        });
      }, 500);
    });
  }
  return api.post('/run-backtest', config);
};

export const getResults = async (backtestId, config) => {
  if (USE_MOCKS) {
    // Generate dates based on config if available, else some default
    const startDate = config?.startDate || '2022-01-01';
    const endDate = config?.endDate || '2023-12-31';
    
    const equityCurve = generateMockEquityCurve(startDate, endDate);
    
    return new Promise(resolve => {
      // Simulate random processing time
      const status = Math.random() > 0.3 ? 'completed' : 'running';
      
      resolve({
        data: {
          backtest_id: backtestId,
          status,
          metrics: status === 'completed' ? {
            total_return: (equityCurve[equityCurve.length - 1].value / equityCurve[0].value - 1) * 100,
            win_rate: 45 + Math.random() * 20,
            sharpe_ratio: 0.8 + Math.random() * 1.5,
            max_drawdown: -(5 + Math.random() * 15),
            num_trades: Math.floor(20 + Math.random() * 80)
          } : null,
          equity_curve: status === 'completed' ? equityCurve : null,
          ohlc_data: status === 'completed' ? generateMockOHLC(startDate, endDate) : null,
          signals: status === 'completed' ? generateMockTrades(startDate, endDate, 15) : null
        }
      });
    });
  }
  return api.get(`/results/${backtestId}`);
};

export const getTrades = async (backtestId) => {
  if (USE_MOCKS) {
    return new Promise(resolve => {
      resolve({
        data: {
          backtest_id: backtestId,
          trades: generateMockTrades('2022-01-01', '2023-12-31', 47)
        }
      });
    });
  }
  return api.get(`/trades/${backtestId}`);
};

