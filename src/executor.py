def run_backtest(df, portfolio):

    for i in range(len(df)):

        price = df['TATASTEEL'][i]
        date = df['DATE'][i]
        signal = df['signal'][i]

        if signal == 1 and portfolio.position == 0:
            portfolio.buy(price, date)

        elif signal == -1 and portfolio.position > 0:
            portfolio.sell(price, date)

        portfolio.update_equity(price, date)

    # Close remaining position
    if portfolio.position > 0:
        final_price = df['TATASTEEL'].iloc[-1]
        final_date = df['DATE'].iloc[-1]
        portfolio.sell(final_price, final_date)

    return portfolio