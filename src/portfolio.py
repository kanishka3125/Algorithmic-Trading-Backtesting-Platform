from database import get_connection
class Portfolio:
    def __init__(self, capital, brokerage=0.001, slippage=0.0005):
        self.initial_capital = capital
        self.cash = capital
        self.position = 0
        self.entry_price = 0

        self.brokerage = brokerage
        self.slippage = slippage

        self.trades = []
        self.equity_curve = []

    def buy(self, price, date):
        price = price * (1 + self.slippage)

        quantity = self.cash // price
        if quantity <= 0:
            return

        cost = quantity * price
        brokerage_fee = cost * self.brokerage

        self.cash -= (cost + brokerage_fee)
        self.position = quantity
        self.entry_price = price

        self.trades.append({
            "type": "BUY",
            "date": date,
            "price": price,
            "quantity": quantity
        })

    def sell(self, price, date):
        price = price * (1 - self.slippage)

        revenue = self.position * price
        brokerage_fee = revenue * self.brokerage

        pnl = (price - self.entry_price) * self.position - brokerage_fee

        self.cash += (revenue - brokerage_fee)

        self.trades.append({
            "type": "SELL",
            "date": date,
            "price": price,
            "quantity": self.position,
            "pnl": pnl
        })

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
        INSERT INTO trades (date, symbol, trade_type, price, quantity, pnl)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (date, "TATASTEEL", "SELL", price, self.position, pnl))

        conn.commit()
        conn.close()

        self.position = 0
        self.entry_price = 0

        return pnl

    def update_equity(self, price, date):
        equity = self.cash + self.position * price
        self.equity_curve.append({
            "date": date,
            "equity": equity
        })