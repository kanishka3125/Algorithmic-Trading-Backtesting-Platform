def moving_average_strategy(df, short=20, long=50):
    df['short_ma'] = df['TATASTEEL'].rolling(short).mean()
    df['long_ma'] = df['TATASTEEL'].rolling(long).mean()

    df['signal'] = 0

    for i in range(1, len(df)):
        # Golden Cross (Buy)
        if (df['short_ma'][i] > df['long_ma'][i] and
            df['short_ma'][i-1] <= df['long_ma'][i-1]):
            df.at[i, 'signal'] = 1

        # Death Cross (Sell)
        elif (df['short_ma'][i] < df['long_ma'][i] and
              df['short_ma'][i-1] >= df['long_ma'][i-1]):
            df.at[i, 'signal'] = -1

    return df
