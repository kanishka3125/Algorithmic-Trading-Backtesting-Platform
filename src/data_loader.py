import pandas as pd

def load_data(path):
    df = pd.read_csv(path)
    df['Date'] = pd.to_datetime(df['DATE'])
    return df
 