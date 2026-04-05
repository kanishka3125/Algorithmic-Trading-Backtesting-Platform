import React from 'react';

const InsightsPanel = ({ metrics }) => {
  if (!metrics) return null;

  // Let's generate some mock AI insight text based on simple logic
  const isProfitable = metrics.total_return > 0;
  const isHighWinRate = metrics.win_rate > 55;
  const isHighDrawdown = metrics.max_drawdown < -15; // drawdown is negative, so < -15 means worse than 15% drop
  const isGoodSharpe = metrics.sharpe_ratio >= 1;

  let riskProfile = 'Moderate';
  let riskColor = 'var(--warning)';
  if (isHighDrawdown && !isGoodSharpe) {
    riskProfile = 'High Risk';
    riskColor = 'var(--danger)';
  } else if (!isHighDrawdown && isGoodSharpe) {
    riskProfile = 'Conservative';
    riskColor = 'var(--primary)';
  }

  let insights = [];

  if (isProfitable && isGoodSharpe) {
    insights.push(`This strategy performed excellently during the simulated period. It achieved a positive total return outperforming basic benchmarks on a risk-adjusted basis (Sharpe > 1).`);
  } else if (isProfitable && !isGoodSharpe) {
    insights.push(`While the strategy gained a positive return, it took on significant volatility to get there, resulting in a poor Sharpe Ratio (${metrics.sharpe_ratio.toFixed(2)}).`);
  } else {
    insights.push(`This configuration yielded a net loss over the backtested timeframe.`);
  }

  if (isHighWinRate) {
    insights.push(`It exhibits a strong win rate (${metrics.win_rate.toFixed(1)}%), indicating reliable signal generation, though overall profitability depends heavily on risk/reward ratios per trade.`);
  } else {
    insights.push(`The win rate is relatively low (${metrics.win_rate.toFixed(1)}%). Most trades were losers, so profitability was likely driven by a few outsized winners (trend following behavior).`);
  }

  if (isHighDrawdown) {
    insights.push(`Warning: The strategy suffered a severe maximum drawdown of ${metrics.max_drawdown.toFixed(1)}%. This requires high psychological tolerance to execute live.`);
  }

  return (
    <div className="card w-full mb-lg animate-in" style={{ animationDelay: '300ms', marginBottom: 'var(--space-2xl)' }}>
      <div className="flex justify-between items-center mb-md" style={{ marginBottom: 'var(--space-md)' }}>
        <h3 className="flex items-center gap-sm m-0" style={{ margin: 0, color: 'var(--text-primary)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Automated Insights
        </h3>
        <span className="badge" style={{ background: 'var(--bg-deep)', border: `1px solid ${riskColor}`, color: riskColor }}>
          Profile: {riskProfile}
        </span>
      </div>
      
      <div className="text-secondary" style={{ lineHeight: 1.6 }}>
        {insights.map((text, i) => (
          <p key={i} style={{ marginBottom: i !== insights.length - 1 ? '8px' : 0 }}>
            {text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
