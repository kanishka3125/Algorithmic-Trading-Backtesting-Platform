def normalize(value, min_val, max_val):
    if max_val == min_val:
        return 0 
    return (value - min_val) / (max_val - min_val)

def compute_score(market_insights, strategy_metrics):

    # Extract metrics
    trend_slope = market_insights["trend"]["slope"]
    volatility = market_insights["volatility"]["std_dev"]
    sharpe = strategy_metrics["sharpe"]
    max_drawdown = strategy_metrics["max_drawdown"]
    total_return = strategy_metrics["total_return"]

    # Normalize values (define reasonable ranges)
    norm_trend = normalize(trend_slope, -0.5, 0.5)
    norm_sharpe = normalize(sharpe, -1, 3)
    norm_return = normalize(total_return, -1, 2)
    norm_drawdown = normalize(max_drawdown, -1, 0)
    norm_volatility = 1 - normalize(volatility, 0, 0.5)

    # Weighted score
    score = (
        0.30 * norm_sharpe +
        0.25 * norm_trend +
        0.20 * norm_return +
        0.15 * norm_drawdown +
        0.10 * norm_volatility
    )

    return score

def make_decision(market_insights, strategy_metrics):

    score = compute_score(market_insights, strategy_metrics)

    if score >= 0.7:
        decision = "BUY"
    elif score >= 0.4:
        decision = "HOLD"
    else:
        decision = "AVOID"

    return decision, score