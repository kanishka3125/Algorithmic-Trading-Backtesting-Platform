from explanation import explain


# for testing directly
if __name__ == "__main__":
    sample = {
        "asset": "Sample Stock",
        "time_range": "2023-01-01 to 2023-12-31",
        "trend": {"direction": "upward", "strength": "moderate", "slope": 0.15},
        "seasonality": {"present": False, "strength": 0.0, "conclusion": "No significant seasonality"},
        "volatility": {"std_dev": 0.1, "regime_change": False},
        "anomalies": {"count": 5, "timestamps": ["2023-03-15", "2023-07-22"]}
    }
    
    # Generate explanation
    explanation = explain(sample)
    
    # Save to file
    import os
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Create the full path to the output file
    output_path = os.path.join(script_dir, 'llm_analysis.txt')