from fastapi import FastAPI
import sqlite3

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Backtesting API Running"}

@app.get("/trades")
def get_trades():
    conn = sqlite3.connect("backtest.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM trades")
    rows = cursor.fetchall()

    conn.close()

    return rows

@app.get("/metrics")
def get_metrics():
    conn = sqlite3.connect("backtest.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM backtest_results")
    rows = cursor.fetchall()

    conn.close()

    return rows