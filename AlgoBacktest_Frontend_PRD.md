# AlgoBacktest — Frontend PRD
### Algorithmic Trading Backtesting Platform
**Version:** 1.0 | **Stack:** React.js | **Theme:** Dark Mode Trading Dashboard

---

## 1. 🧩 Product Overview

### What This Frontend Does
A professional, single-page React application that allows users to configure algorithmic trading strategies, run backtests against historical stock data, and analyze performance through interactive charts, metrics, and trade logs.

### Target Users
- **Students / Learners** — exploring algorithmic trading concepts
- **Quant Traders** — validating strategies before live deployment
- **Recruiters / Demo Viewers** — evaluating engineering & product capabilities

### Core Value Proposition
> Configure → Run → Analyze — in under 60 seconds.

One cohesive dark-mode interface that removes friction from strategy testing: no page reloads, instant feedback, professional-grade charts.

---

## 2. 🧱 Page Structure

### Page 1 — Dashboard (Configuration)
**Route:** `/` or `/dashboard`
**Purpose:** Strategy configuration and backtest launch

**Layout:** Two-column (Sidebar + Main Content Area)

**Left Sidebar (fixed, 280px):**
- App logo + nav links
- Navigation: Dashboard | Results | Trades | Compare

**Main Content Area:**
```
┌─────────────────────────────────────────────┐
│  CONFIGURE YOUR BACKTEST                    │
├──────────────┬──────────────────────────────┤
│ Stock Symbol │  [Dropdown: AAPL, MSFT ...]  │
├──────────────┼──────────────────────────────┤
│ Date Range   │  [Start Date] → [End Date]   │
├──────────────┼──────────────────────────────┤
│ Strategy     │  [Dropdown: MA/RSI/MACD/BB]  │
├──────────────┴──────────────────────────────┤
│ STRATEGY PARAMETERS (dynamic)               │
│  [Parameter fields rendered per strategy]   │
├─────────────────────────────────────────────┤
│         [ ▶ RUN BACKTEST ]                  │
└─────────────────────────────────────────────┘
```

**Dynamic Parameter Fields per Strategy:**

| Strategy | Parameters |
|---|---|
| Moving Average (MA) | Short Window (int), Long Window (int) |
| RSI | Period (int), Overbought (int), Oversold (int) |
| MACD | Fast Period, Slow Period, Signal Period |
| Bollinger Bands | Window (int), Std Dev Multiplier (float) |

**Validation Rules:**
- All fields required before enabling Run button
- Date range: Start < End, max 5 years
- Numeric fields: positive integers only
- Button state: disabled (grey) until form valid; enabled (green) when valid

---

### Page 2 — Results
**Route:** `/results/:id`
**Purpose:** Visual performance analysis

**Layout:** Single column, card-based

**Section 1 — Metrics Row (5 cards, horizontal):**
```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Total    │ │ Win      │ │ Sharpe   │ │ Max      │ │ # Trades │
│ Return   │ │ Rate     │ │ Ratio    │ │ Drawdown │ │          │
│ +24.3%   │ │ 61.2%    │ │ 1.42     │ │ -8.7%    │ │   47     │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```
- Total Return: green if positive, red if negative
- Max Drawdown: always red
- Win Rate: green if > 50%

**Section 2 — Equity Curve Chart (full width):**
- Type: Line chart (Recharts `<LineChart>`)
- X-axis: Date
- Y-axis: Portfolio value ($)
- Tooltip: Date + Value on hover
- Color: `#22c55e`
- Benchmark overlay toggle (S&P 500 line, `#94a3b8`)

**Section 3 — Candlestick Chart (full width):**
- Type: Candlestick + volume bars (Chart.js with `chartjs-chart-financial`)
- Overlays: Buy signals (▲ green triangle), Sell signals (▼ red triangle)
- X-axis: Date | Y-axis: Price ($)
- Volume subplot below main chart (20% height)

**Action Bar:**
- `[← Reconfigure]` button → back to Dashboard
- `[View Trade History →]` button → Trade History page
- `[Export CSV]` button → download trade data

---

### Page 3 — Trade History
**Route:** `/trades/:id`
**Purpose:** Detailed log of all executed trades

**Layout:** Full-width table with filters

**Filter Bar (above table):**
- Filter by Type: All | BUY | SELL
- Sort by: Date | PnL | Price
- Search: by date range

**Trade Table:**

| Column | Type | Notes |
|---|---|---|
| # | number | Row index |
| Date | string | Format: YYYY-MM-DD HH:mm |
| Type | badge | BUY (green badge) / SELL (red badge) |
| Entry Price | number | $ formatted |
| Exit Price | number | $ formatted |
| Quantity | number | shares |
| PnL | number | green if > 0, red if < 0 |
| Return % | number | percentage |

**Table Features:**
- Pagination: 25 rows per page
- Row hover highlight
- Sticky header
- Summary row at bottom: Total PnL, Total Trades, Avg Return

---

### Page 4 — Strategy Comparison *(Preferred)*
**Route:** `/compare`
**Purpose:** Side-by-side multi-strategy performance

**Layout:** Two sections — Config Panel + Comparison Chart

**Config Panel:**
```
┌─────────────────────────────────────────────┐
│ Add Strategy  [+ Add]                       │
│  Strategy 1: MA  | Short: 10 | Long: 50    │
│  Strategy 2: RSI | Period: 14 | OB: 70     │
│  Strategy 3: MACD | ...                    │
│         [ ▶ RUN COMPARISON ]               │
└─────────────────────────────────────────────┘
```
- Max 4 strategies simultaneously
- Each strategy row has color indicator dot

**Comparison Chart:**
- Type: Multi-line chart (Recharts)
- Each strategy = distinct line color
- Legend below chart
- Shared X-axis (date), Y-axis (% return)
- Toggle individual strategies on/off via legend click

**Comparison Metrics Table:**

| Metric | Strategy 1 | Strategy 2 | Strategy 3 |
|---|---|---|---|
| Total Return | | | |
| Win Rate | | | |
| Sharpe Ratio | | | |
| Max Drawdown | | | |
| # Trades | | | |

- Best value per row highlighted in green

---

## 3. 🎨 UI/UX Design System

### Color Palette
```
Background (deep):    #0f172a
Surface (cards):      #1e293b
Border:               #334155
Primary/Profit:       #22c55e
Danger/Loss:          #ef4444
Warning:              #f59e0b
Muted text:           #64748b
Primary text:         #f1f5f9
Secondary text:       #94a3b8
Chart line 1:         #22c55e
Chart line 2:         #3b82f6
Chart line 3:         #a855f7
Chart line 4:         #f59e0b
```

### Typography
```
Font family:  'JetBrains Mono' (data/numbers), 'Inter' (UI labels)
H1:           24px, weight 700, #f1f5f9
H2:           18px, weight 600, #f1f5f9
Body:         14px, weight 400, #94a3b8
Metric value: 28px, weight 700, JetBrains Mono
Label:        11px, weight 500, uppercase, letter-spacing 0.1em
```

### Spacing System
```
xs: 4px | sm: 8px | md: 16px | lg: 24px | xl: 32px | 2xl: 48px
Border radius: cards 12px | buttons 8px | badges 4px
```

### Component States
- **Loading:** skeleton pulse animation on cards and charts
- **Error:** red border card with error icon + message
- **Empty:** ghost state with icon + instructional text
- **Hover:** `#334155` background on interactive rows
- **Focus:** `#22c55e` outline ring on inputs

---

## 4. 🧩 Component Breakdown

### Layout Components
```
<Navbar />
  - App name/logo (left)
  - Nav links: Dashboard | Results | Trades | Compare (center)
  - Theme toggle (right, future)
  Props: activePage: string

<Sidebar />
  - Navigation items with icons
  - Collapsible on mobile
  Props: activePage: string, onNavigate: fn
```

### Form Components
```
<StockSelector />
  - Searchable dropdown
  - Shows: ticker + company name
  - Data: static list of 50 top stocks
  Props: value: string, onChange: fn

<DateRangePicker />
  - Two date inputs: Start + End
  - Validation: start < end
  Props: startDate, endDate, onChange: fn

<StrategySelector />
  - Dropdown: MA | RSI | MACD | Bollinger Bands
  - On change: triggers ParameterForm re-render
  Props: value: string, onChange: fn

<ParameterForm />
  - Renders dynamic fields based on strategy
  - Each field: label + number input + tooltip
  - Validates on blur
  Props: strategy: string, params: object, onChange: fn, errors: object

<RunBacktestButton />
  - Full-width CTA
  - States: idle | loading | disabled
  Props: onClick: fn, isLoading: bool, isDisabled: bool
```

### Display Components
```
<MetricsCard />
  - Icon (top right)
  - Metric label
  - Metric value (large, color-coded)
  - Sub-label (e.g., "vs benchmark: +4.2%")
  Props: label: string, value: string|number, type: "profit"|"loss"|"neutral"

<EquityCurveChart />
  - Recharts LineChart
  - Benchmark toggle
  - Responsive container
  Props: data: [{date, value, benchmark?}], showBenchmark: bool

<CandlestickChart />
  - Chart.js financial plugin
  - Buy/sell signal markers
  Props: ohlcData: array, signals: [{date, type}]

<ComparisonChart />
  - Multi-line Recharts
  - Legend with toggle
  Props: strategies: [{name, color, data}]

<TradeTable />
  - Paginated table
  - Filter + sort controls
  Props: trades: array, onFilter: fn, onSort: fn

<FilterBar />
  - Type filter buttons
  - Sort dropdown
  Props: filters: object, onChange: fn
```

### Utility Components
```
<Loader />
  - Full-screen overlay spinner
  - Message prop: "Running backtest..."
  Props: message: string

<SkeletonCard />
  - Pulse animation placeholder
  - Matches MetricsCard dimensions
  Props: count: number

<ErrorBanner />
  - Red surface card
  - Error icon + message + retry button
  Props: message: string, onRetry: fn

<Badge />
  - Small pill label
  Props: type: "buy"|"sell"|"neutral", label: string

<Tooltip />
  - Info icon trigger
  - Hover popover with description
  Props: content: string
```

---

## 5. 📊 Chart Specification

### Chart 1 — Equity Curve
```
Library:     Recharts
Component:   <LineChart>
Container:   <ResponsiveContainer width="100%" height={400}>
X-axis:      <XAxis dataKey="date" tickFormatter={formatDate} />
Y-axis:      <YAxis tickFormatter={formatCurrency} />
Line 1:      Portfolio value — stroke="#22c55e", strokeWidth=2
Line 2:      Benchmark — stroke="#94a3b8", strokeDasharray="4 4"
Tooltip:     Custom: shows Date, Portfolio $, Benchmark $
Grid:        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
Brush:       <Brush> at bottom for date range zoom
```

### Chart 2 — Candlestick + Signals
```
Library:     Chart.js + chartjs-chart-financial + chartjs-plugin-annotation
Canvas:      height: 500px
Datasets:
  - type: "candlestick"
    data: [{x: date, o, h, l, c}]
    color: { up: "#22c55e", down: "#ef4444" }
  - type: "bar" (volume, secondary Y-axis)
    yAxisID: "volume"
Annotations (buy/sell signals):
  type: "point"
  x: signal date
  y: price
  pointStyle: triangle (▲ buy) / triangle rotated (▼ sell)
  radius: 8
  color: buy=#22c55e / sell=#ef4444
```

### Chart 3 — Strategy Comparison
```
Library:     Recharts
Component:   <LineChart>
Multiple Lines: one per strategy, each with unique color from palette
X-axis:      Date (shared)
Y-axis:      Cumulative return %
Legend:      <Legend> with click-to-toggle behavior
Tooltip:     Shows all strategy values at hovered date
```

---

## 6. 🔌 API Integration Plan

### Base URL
```
REACT_APP_API_BASE_URL=http://localhost:8000
```

### Endpoint 1 — Run Backtest
```
Method:  POST
URL:     /run-backtest
Headers: { "Content-Type": "application/json" }

Request Body:
{
  "symbol": "AAPL",
  "start_date": "2022-01-01",
  "end_date": "2023-12-31",
  "strategy": "MA",
  "parameters": {
    "short_window": 10,
    "long_window": 50
  }
}

Response (202 Accepted):
{
  "backtest_id": "uuid-string",
  "status": "running"
}
```

### Endpoint 2 — Get Results
```
Method:  GET
URL:     /results/{backtest_id}

Response (200 OK):
{
  "backtest_id": "uuid-string",
  "status": "completed",
  "metrics": {
    "total_return": 24.3,
    "win_rate": 61.2,
    "sharpe_ratio": 1.42,
    "max_drawdown": -8.7,
    "num_trades": 47
  },
  "equity_curve": [
    { "date": "2022-01-03", "value": 10000 },
    ...
  ],
  "ohlc_data": [
    { "date": "2022-01-03", "open": 182.01, "high": 184.5, "low": 180.6, "close": 183.0 },
    ...
  ],
  "signals": [
    { "date": "2022-02-14", "type": "BUY", "price": 170.5 },
    ...
  ]
}
```

### Endpoint 3 — Get Trades
```
Method:  GET
URL:     /trades/{backtest_id}

Response (200 OK):
{
  "backtest_id": "uuid-string",
  "trades": [
    {
      "id": 1,
      "date": "2022-02-14",
      "type": "BUY",
      "entry_price": 170.5,
      "exit_price": 178.2,
      "quantity": 10,
      "pnl": 77.0,
      "return_pct": 4.51
    },
    ...
  ]
}
```

### Loading & Error States
```
Loading:
  - Show <Loader /> full-screen overlay
  - Poll GET /results/{id} every 2s if status === "running"
  - Stop polling when status === "completed" or "failed"

Error States:
  - Network error → <ErrorBanner message="Cannot reach server. Check connection." />
  - 422 Validation → Highlight form fields with error messages
  - 500 Server error → <ErrorBanner message="Backtest failed. Try again." onRetry />
  - Timeout (>30s) → <ErrorBanner message="Backtest timed out." onRetry />
```

---

## 7. ⚙️ State Management

### Global State (Context API)
```javascript
BacktestContext = {
  // Config
  symbol: string,
  startDate: string,
  endDate: string,
  strategy: string,
  parameters: object,

  // Status
  backtestId: string | null,
  status: "idle" | "loading" | "success" | "error",
  errorMessage: string | null,

  // Results
  metrics: object | null,
  equityCurve: array,
  ohlcData: array,
  signals: array,
  trades: array,

  // Actions
  setConfig: fn,
  runBacktest: fn,
  resetState: fn
}
```

### Local State (per component)
```javascript
// Dashboard
const [formErrors, setFormErrors] = useState({})
const [showTooltip, setShowTooltip] = useState(false)

// TradeTable
const [currentPage, setCurrentPage] = useState(1)
const [sortConfig, setSortConfig] = useState({ key: "date", dir: "asc" })
const [filterType, setFilterType] = useState("ALL")

// ComparisonChart
const [activeLines, setActiveLines] = useState(["MA", "RSI"])
```

### Side Effects (useEffect)
```javascript
// Poll backtest status
useEffect(() => {
  if (status !== "loading") return
  const interval = setInterval(fetchResults, 2000)
  return () => clearInterval(interval)
}, [status, backtestId])

// Redirect to results on completion
useEffect(() => {
  if (status === "success") navigate(`/results/${backtestId}`)
}, [status])
```

---

## 8. 📁 Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── PageWrapper.jsx
│   ├── forms/
│   │   ├── StockSelector.jsx
│   │   ├── DateRangePicker.jsx
│   │   ├── StrategySelector.jsx
│   │   ├── ParameterForm.jsx
│   │   └── RunBacktestButton.jsx
│   ├── charts/
│   │   ├── EquityCurveChart.jsx
│   │   ├── CandlestickChart.jsx
│   │   └── ComparisonChart.jsx
│   ├── display/
│   │   ├── MetricsCard.jsx
│   │   ├── TradeTable.jsx
│   │   ├── FilterBar.jsx
│   │   └── Badge.jsx
│   └── ui/
│       ├── Loader.jsx
│       ├── SkeletonCard.jsx
│       ├── ErrorBanner.jsx
│       └── Tooltip.jsx
├── pages/
│   ├── DashboardPage.jsx
│   ├── ResultsPage.jsx
│   ├── TradeHistoryPage.jsx
│   └── ComparisonPage.jsx
├── context/
│   └── BacktestContext.jsx
├── services/
│   ├── api.js            ← axios instance + base config
│   ├── backtestService.js ← runBacktest(), getResults(), getTrades()
│   └── compareService.js
├── hooks/
│   ├── useBacktest.js    ← wraps context actions
│   ├── usePolling.js     ← polling logic
│   └── useTableSort.js
├── utils/
│   ├── formatters.js     ← formatCurrency, formatDate, formatPct
│   ├── validators.js     ← form validation logic
│   └── strategyConfig.js ← parameter definitions per strategy
├── constants/
│   └── stocks.js         ← static stock list
├── styles/
│   └── globals.css       ← CSS variables, base styles
├── App.jsx               ← Router setup
└── main.jsx              ← Entry point
```

---

## 9. 🚀 User Flow

```
Step 1 — CONFIGURE
  User lands on Dashboard page (/)
  ↓
  Selects stock from dropdown (e.g., AAPL)
  ↓
  Picks date range (e.g., 2022-01-01 to 2023-12-31)
  ↓
  Selects strategy (e.g., RSI)
  ↓
  Parameter form dynamically renders RSI fields
  ↓
  User fills in: Period=14, Overbought=70, Oversold=30
  ↓
  "Run Backtest" button becomes active (green)

Step 2 — SUBMIT
  User clicks "Run Backtest"
  ↓
  POST /run-backtest fires
  ↓
  Full-screen Loader appears: "Running backtest..."
  ↓
  Response: { backtest_id: "abc123", status: "running" }
  ↓
  Frontend begins polling GET /results/abc123 every 2s

Step 3 — RESULTS
  Polling returns status: "completed"
  ↓
  Auto-navigate to /results/abc123
  ↓
  5 MetricsCards animate in (stagger 100ms each)
  ↓
  Equity Curve chart renders with animation
  ↓
  Candlestick chart renders with buy/sell signals

Step 4 — EXPLORE
  User toggles benchmark line on equity chart
  ↓
  User zooms into candlestick chart (brush control)
  ↓
  User clicks "View Trade History →"
  ↓
  Trade History page loads with trade table
  ↓
  User filters by BUY trades, sorts by PnL
  ↓
  User clicks "Export CSV"

Step 5 — COMPARE (optional)
  User navigates to /compare
  ↓
  Adds 2–3 strategies with parameters
  ↓
  Clicks "Run Comparison"
  ↓
  Multi-line chart renders
  ↓
  Metrics comparison table highlights best performer
```

---

## 10. 💡 Antigravity Optimization Notes

### Component Contracts (explicit)
Every component has defined:
- Props with types
- States (idle/loading/error/success)
- Interaction triggers
- Visual output

### No Ambiguity Rules
- Exact hex colors defined (no "greenish")
- Chart library specified per chart
- API response shape fully defined
- Route paths explicitly named
- Folder path for every file specified

### Interaction Specifications
- Button disabled state: `opacity: 0.4, cursor: not-allowed`
- Form error: red border `#ef4444` + error text below field
- Polling interval: exactly 2000ms
- Card animation: `opacity 0 → 1`, `translateY 20px → 0`, stagger 100ms

### Dependencies (npm)
```
react-router-dom     → routing
recharts             → line/comparison charts
chart.js             → candlestick chart
chartjs-chart-financial → OHLC data
chartjs-plugin-annotation → buy/sell markers
axios                → HTTP client
date-fns             → date formatting
tailwindcss          → utility styling
```

### Environment Variables
```
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_POLL_INTERVAL=2000
REACT_APP_MAX_POLL_ATTEMPTS=30
```

---

*PRD Version 1.0 — AlgoBacktest Frontend | Ready for AI-assisted implementation*
