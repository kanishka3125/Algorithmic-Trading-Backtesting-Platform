import numpy as np
import sys
import os
import analysis as an
# from backtesting import compute_performance_metrics 

# Add the project root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from dataset import df

def build_insights_for_asset(asset):
    """Build insights for a specific asset"""
    # Get the time series data for the specific asset
    series = df[asset].dropna()
    trend, seasonal, resid, returns = an.run_analysis(series)

    time_range = f"{series.index.min().date()} to {series.index.max().date()}"

    # Calculate trend using moving average
    window_size = 30  # You can adjust this window size as needed
    trend = series.rolling(window=window_size).mean()

    # Prepare data for trend analysis
    y = trend.dropna().values
    x = np.arange(len(y))

    slope = np.polyfit(x,y,1)[0]

    if slope > 0:
        direction = "upward"
        trend_strength = "strong" if slope > 0.1 else "moderate" if slope > 0.05 else "weak"
    elif slope == 0:
        direction = "flat"
        trend_strength = "weak"
    else:
        direction = "downward"
        trend_strength = "strong" if slope < -0.1 else "moderate" if slope < -0.05 else "weak"

    #seasonality 
    seasonality_strength = np.var(seasonal) / np.var(returns)
    present = seasonality_strength > 0.05
    conclusion = (
        "No significant seasonality"
        if not present
        else "Moderate seasonality" if seasonality_strength < 0.5 else "Strong seasonality"
    )

    #volatility
    std_dev = float(np.std(returns))
    mid = len(returns) // 2
    vol1 = np.std(returns[:mid])
    vol2 = np.std(returns[mid:])

    regime_change = vol2 > 1.5 * vol1

    #anomalies
    z = (resid - resid.mean()) / resid.std()

    anomaly_idx =  resid[np.abs(z) > 3].index

    count = len(anomaly_idx)
    timestamps = anomaly_idx.strftime("%Y-%m-%d").tolist()[:10]

    return {
        "asset": asset,
        "time_range": time_range,

        "trend": {
            "direction": direction,
            "slope": float(slope),
            "strength": trend_strength
        },

        "seasonality": {
            "present": present,
            "strength": float(seasonality_strength),
            "conclusion": conclusion
        },

        "volatility": {
            "std_dev": std_dev,
            "regime_change": regime_change
        },

        "anomalies": {
            "count": count,
            "timestamps": timestamps
        }
    }

# Define the asset and get the time series data
for asset in df.columns:
    series = df[asset].dropna()
trend, seasonal, resid, returns = an.run_analysis(series)

time_range = f"{series.index.min().date()} to {series.index.max().date()}"

# Calculate trend using moving average
window_size = 30  # You can adjust this window size as needed
trend = series.rolling(window=window_size).mean()

# Prepare data for trend analysis
y = trend.dropna().values
x = np.arange(len(y))

slope = np.polyfit(x,y,1)[0]

if slope > 0:
    direction = "upward"
    trend_strength = "strong" if slope > 0.1 else "moderate" if slope > 0.05 else "weak"
elif slope == 0:
    direction = "flat"
    trend_strength = "weak"
else:
    direction = "downward"
    trend_strength = "strong" if slope < -0.1 else "moderate" if slope < -0.05 else "weak"

#seasonality 

seasonality_strength = np.var(seasonal) / np.var(returns)
present = seasonality_strength > 0.05
conclusion = (
    "No significant seasonality"
    if not present
    else "Moderate seasonality" if seasonality_strength < 0.5 else "Strong seasonality"
)

#volatility
std_dev = float(np.std(returns))
mid = len(returns) // 2
vol1 = np.std(returns[:mid])
vol2 = np.std(returns[mid:])

regime_change = vol2 > 1.5 * vol1

#anomalies
z = (resid - resid.mean()) / resid.std()

anomaly_idx =  resid[np.abs(z) > 3].index

count = len(anomaly_idx)
timestamps = anomaly_idx.strftime("%Y-%m-%d").tolist()[:10]


insights = {
    "asset": asset,
    "time_range": time_range,

    "trend": {
        "direction": direction,
        "slope": float(slope),
        "strength": trend_strength
    },

    "seasonality": {
        "present": present,
        "strength": float(seasonality_strength),
        "conclusion": conclusion
    },

    "volatility": {
        "std_dev": std_dev,
        "regime_change": regime_change
    },

    "anomalies": {
        "count": count,
        "timestamps": timestamps
    }
}

if __name__ == "__main__":
    # Print the insights
    print(insights)
    
    # Import here to avoid circular imports
    from explanation import explain
    
    # Process all stocks if needed
    for stock in df.columns:
        explanation = explain(insights)
        print(f"\nAnalysis for {stock}:")
        print(explanation)
