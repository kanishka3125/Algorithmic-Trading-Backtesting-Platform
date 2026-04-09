from data_loader import load_data
from strategy import moving_average_strategy
from portfolio import Portfolio
from executor import run_backtest
from metrics import calculate_metrics

df = load_data("Final-50-stocks.csv")
df = moving_average_strategy(df)

portfolio = Portfolio(capital=100000)
portfolio = run_backtest(df, portfolio)

# =========================
# ADD METRICS HERE
# =========================
metrics = calculate_metrics(portfolio)



# Store portfolio results in output file
with open("ouput.txt", "w", encoding="utf-8") as f:
    sell_trades = [trade for trade in portfolio.trades if trade['type'] == 'SELL']
    pnl_list = [trade['pnl'] for trade in sell_trades]
    metrics_text = "\n".join(f"{k}: {v}" for k, v in metrics.items())
    
    f.write("\n===== BACKTEST RESULTS =====\n") 
    for k, v in metrics.items():
            f.write(f"{k} : {v}\n")
    f.write(f"no of trades: {len(sell_trades)}\n")
    f.write(f"Total profit: {sum(pnl_list):.2f}\n")
    f.write(f"Final cash: {portfolio.cash:.2f}\n")
    f.write(f"Winning trades: {sum(1 for t in pnl_list if t > 0)}\n")
    f.write(f"Losing trades: {sum(1 for t in pnl_list if t < 0)}\n")
    if pnl_list:
        f.write(f"Average trade: {sum(pnl_list)/len(pnl_list):.2f}\n")
        f.write(f"Best trade: {max(pnl_list):.2f}\n")
        f.write(f"Worst trade: {min(pnl_list):.2f}\n")
       

#print("Final Cash:", portfolio.cash)
#print("Trades PnL:", trades)
#print("Total Profit:", sum(trades))
print("\n===== BACKTEST RESULTS =====")

for k, v in metrics.items():
    print(k, ":", v)

print("Number of trades:", len(sell_trades))
print("Total Profit:", sum(pnl_list))
print("Final Cash:", portfolio.cash)
print("Winning Trades:", sum(1 for t in pnl_list if t > 0))
print("Losing trades:", sum(1 for t in pnl_list if t < 0))
print("average trade:", sum(pnl_list)/len(pnl_list))
print("Best trade:", max(pnl_list))
print("Worst trade:", min(pnl_list))

from database import get_connection

conn = get_connection()
cursor = conn.cursor()

cursor.execute("""
INSERT INTO backtest_results 
(total_profit, final_cash, win_trades, loss_trades, total_trades)
VALUES (?, ?, ?, ?, ?)
""", (
    sum(pnl_list),
    portfolio.cash,
    sum(1 for t in pnl_list if t > 0),
    sum(1 for t in pnl_list if t < 0),
    len(pnl_list)
))

conn.commit()
conn.close()
