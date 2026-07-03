import numpy as np

def calculate_metrics(portfolio):

    equity = [x['equity'] for x in portfolio.equity_curve]

    total_return = (equity[-1] - portfolio.initial_capital) / portfolio.initial_capital

    returns = np.diff(equity) / equity[:-1]

    sharpe = 0
    if len(returns) > 1 and np.std(returns) != 0:
        sharpe = (np.mean(returns) / np.std(returns)) * np.sqrt(252)

    drawdown = calculate_drawdown(equity)

    trades = [t for t in portfolio.trades if 'pnl' in t]

    wins = [t for t in trades if t['pnl'] > 0]
    losses = [t for t in trades if t['pnl'] < 0]

    win_rate = len(wins) / len(trades) if trades else 0

    return {
        "Total Return (%)": round(total_return * 100, 2),
        "Sharpe Ratio": round(sharpe, 2),
        "Max Drawdown (%)": round(drawdown * 100, 2),
        "Win Rate (%)": round(win_rate * 100, 2),
        "Total Trades": len(trades)
    }


def calculate_drawdown(equity):

    peak = equity[0]
    max_dd = 0

    for value in equity:
        if value > peak:
            peak = value

        dd = (peak - value) / peak

        if dd > max_dd:
            max_dd = dd

    return max_dd