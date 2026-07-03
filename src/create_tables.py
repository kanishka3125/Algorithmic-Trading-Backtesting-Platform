from database import get_connection

conn = get_connection()
cursor = conn.cursor()

# Historical Prices
cursor.execute("""
CREATE TABLE IF NOT EXISTS historical_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    symbol TEXT,
    price REAL
)
""")

# Trades
cursor.execute("""
CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    symbol TEXT,
    trade_type TEXT,
    price REAL,
    quantity INTEGER,
    pnl REAL
)
""")

# Backtest results
cursor.execute("""
CREATE TABLE IF NOT EXISTS backtest_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total_profit REAL,
    final_cash REAL,
    win_trades INTEGER,
    loss_trades INTEGER,
    total_trades INTEGER
)
""")
cursor.execute("""
CREATE INDEX IF NOT EXISTS idx_symbol_date 
ON historical_prices(symbol, date)
""")

cursor.execute("""
CREATE INDEX IF NOT EXISTS idx_trades_symbol 
ON trades(symbol)
""")

conn.commit()
conn.close()

print("Tables and indexes created successfully")

