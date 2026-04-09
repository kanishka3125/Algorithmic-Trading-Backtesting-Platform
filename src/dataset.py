import pandas as pd 
file_path = "/Users/admin/Documents/Stock price analyser /Final-50-stocks.csv"
df = pd.read_csv(
    file_path,
    index_col=['DATE'],  
    parse_dates=True
)
ts = df["TATASTEEL"]

if __name__ == "__main__":
    print(ts.head())
    print(ts.info())