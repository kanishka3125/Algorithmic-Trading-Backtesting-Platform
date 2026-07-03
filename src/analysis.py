import numpy as np 
import matplotlib.pyplot as plt
import seaborn as sns
import sys
import os
from statsmodels.tsa.seasonal import seasonal_decompose
from colorsetup import colors, palette

# Set seaborn style
sns.set_palette(palette)

def compute_returns(series):
    """Calculate log returns of the series.
    Log returns are used in time series analysis because they offer superior mathematical and statistical properties over simple percentage returns."""
    return np.log(series).diff().dropna()

def decompose_series(series, period=12):
    """Decompose the time series into trend, seasonal, and residual components."""
    returns = compute_returns(series)
    decomposition = seasonal_decompose(x=returns, model='additive', period=period)
    return decomposition.trend, decomposition.seasonal, decomposition.resid

def plot_decomposition(series, trend, seasonal, resid):
    """Plot the decomposition of the time series."""
    plt.figure(figsize=(15, 12))
    
    # Plot original series (aligned with the series index)
    plt.subplot(4, 1, 1)
    plt.plot(series.index, series, label='Original Stock Price')
    plt.legend(loc='upper left')
    plt.title('Historical 50 Years Stock Price - Original Time Series')
    
    # Plot trend component
    plt.subplot(4, 1, 2)
    plt.plot(trend.index, trend, label='Trend')
    plt.legend()
    plt.title('Trend Component')
    
    # Plot seasonal component
    plt.subplot(4, 1, 3)
    plt.plot(seasonal.index, seasonal, label='Seasonal')
    plt.legend()
    plt.title('Seasonal Component')
    
    # Plot residual component
    plt.subplot(4, 1, 4)
    plt.plot(resid.index, resid, label='Residual')
    plt.legend()
    plt.title('Residual Component')
    
    plt.tight_layout()
    plt.show()

def run_analysis(series, plot=False):
    """
    Run time series analysis on the given series.
    
    Args:
        series: Pandas Series with datetime index
        plot: If True, shows the decomposition plots
        
    Returns:
        tuple: (trend, seasonal, residual, returns)
    """
    trend, seasonal, resid = decompose_series(series)
    returns = compute_returns(series)
    
    if plot:
        plot_decomposition(series, trend, seasonal, resid)
    
    return trend, seasonal, resid, returns

if __name__ == "__main__":
    # Add the project root directory to the Python path
    sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    from dataset import df
    
    # Run analysis with plotting enabled
    for asset in df.columns:
        series = df[asset].dropna()
    run_analysis(series, plot=True)