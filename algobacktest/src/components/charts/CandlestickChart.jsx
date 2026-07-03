import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  createChart,
  createSeriesMarkers,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
} from 'lightweight-charts';
import { formatCurrency, formatDate } from '../../utils/formatters';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAIN_HEIGHT = 380;
const RSI_HEIGHT = 120;
const SPEED_MAP = { '1x': 80, '2x': 40, '4x': 20 };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toTime = (dateStr) => Math.floor(new Date(dateStr).getTime() / 1000);

const calcSMA = (data, period) => {
  const out = [];
  for (let i = period - 1; i < data.length; i++) {
    const avg = data.slice(i - period + 1, i + 1).reduce((s, d) => s + d.close, 0) / period;
    out.push({ time: data[i].time, value: avg });
  }
  return out;
};

const calcRSI = (data, period = 14) => {
  if (data.length < period + 1) return [];
  const result = [];
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const d = data[i].close - data[i - 1].close;
    if (d >= 0) gains += d; else losses -= d;
  }
  let avgGain = gains / period, avgLoss = losses / period;
  for (let i = period; i < data.length; i++) {
    if (i > period) {
      const d = data[i].close - data[i - 1].close;
      avgGain = (avgGain * (period - 1) + Math.max(0, d)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.max(0, -d)) / period;
    }
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push({ time: data[i].time, value: parseFloat((100 - 100 / (1 + rs)).toFixed(2)) });
  }
  return result;
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────
const Tooltip = ({ info, visible }) => {
  if (!info) return null;
  const isUp = info.close >= info.open;
  const color = isUp ? '#22c55e' : '#ef4444';
  const change = info.open ? ((info.close - info.open) / info.open * 100).toFixed(2) : null;

  return (
    <div style={{
      position: 'absolute', top: 12, left: 12, zIndex: 10,
      background: 'rgba(10,10,16,0.95)',
      backdropFilter: 'blur(16px)',
      border: `1px solid ${color}44`,
      borderRadius: '10px',
      padding: '10px 14px',
      minWidth: '220px',
      boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${color}18`,
      pointerEvents: 'none',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(0.97)',
      transition: 'opacity 0.15s ease, transform 0.15s ease',
    }}>
      <p style={{ color: '#71717a', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
        {info.date}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px' }}>
        {[['Open', info.open], ['High', info.high], ['Low', info.low], ['Close', info.close]].map(([lbl, val]) => (
          <div key={lbl} style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: '#52525b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{lbl}</span>
            <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: lbl === 'Close' ? color : '#f4f4f5', fontWeight: lbl === 'Close' ? 700 : 500 }}>
              {formatCurrency(val)}
            </span>
          </div>
        ))}
      </div>
      {change !== null && (
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #27272a', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', color: '#52525b' }}>Change</span>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color, fontWeight: 700 }}>
            {isUp ? '+' : ''}{change}%
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Replay Controls ──────────────────────────────────────────────────────────
const ReplayControls = ({ state, speed, onPlay, onPause, onReset, onSpeedChange, progress }) => {
  const isIdle = state === 'idle';
  const isPlaying = state === 'playing';
  const isDone = state === 'done';

  const btnBase = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '6px', border: 'none', cursor: 'pointer', borderRadius: '8px',
    fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '12px',
    transition: 'all 0.15s ease', letterSpacing: '0.04em',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      {/* Progress bar */}
      {!isIdle && (
        <div style={{ position: 'relative', width: '80px', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #06b6d4, #22c55e)',
            borderRadius: '4px',
            transition: 'width 0.1s linear',
            boxShadow: '0 0 6px rgba(6,182,212,0.5)',
          }} />
        </div>
      )}

      {/* Play / Pause */}
      {(isIdle || isDone) ? (
        <button onClick={onPlay} title="Start Replay" style={{
          ...btnBase, padding: '7px 14px',
          background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
          color: '#03050a',
          boxShadow: '0 0 16px rgba(6,182,212,0.35)',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
          {isDone ? 'Replay' : 'Replay'}
        </button>
      ) : (
        <button onClick={isPlaying ? onPause : onPlay} title={isPlaying ? 'Pause' : 'Resume'} style={{
          ...btnBase, padding: '7px 12px',
          background: isPlaying ? 'rgba(245,158,11,0.15)' : 'rgba(6,182,212,0.12)',
          color: isPlaying ? '#f59e0b' : '#06b6d4',
          border: `1px solid ${isPlaying ? 'rgba(245,158,11,0.3)' : 'rgba(6,182,212,0.3)'}`,
        }}>
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
          )}
          {isPlaying ? 'Pause' : 'Resume'}
        </button>
      )}

      {/* Reset */}
      {!isIdle && (
        <button onClick={onReset} title="Reset" style={{
          ...btnBase, padding: '7px 10px',
          background: 'rgba(239,68,68,0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239,68,68,0.25)',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5"/></svg>
        </button>
      )}

      {/* Speed */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        {Object.keys(SPEED_MAP).map(s => (
          <button key={s} onClick={() => onSpeedChange(s)} style={{
            ...btnBase, padding: '5px 10px', borderRadius: 0,
            background: speed === s ? 'rgba(6,182,212,0.2)' : 'transparent',
            color: speed === s ? '#06b6d4' : '#52525b',
            fontSize: '11px',
          }}>{s}</button>
        ))}
      </div>
    </div>
  );
};

// ─── Signal Badge ─────────────────────────────────────────────────────────────
const SignalCount = ({ signals }) => {
  if (!signals?.length) return null;
  const buys = signals.filter(s => s.type === 'BUY').length;
  const sells = signals.filter(s => s.type === 'SELL').length;
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {buys > 0 && <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>▲ {buys} Buy</span>}
      {sells > 0 && <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>▼ {sells} Sell</span>}
    </div>
  );
};

// ─── MA Legend ────────────────────────────────────────────────────────────────
const Legend = ({ showMA20, showMA50, onToggleMA20, onToggleMA50 }) => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
    {[
      { label: 'MA 20', color: '#f59e0b', active: showMA20, toggle: onToggleMA20 },
      { label: 'MA 50', color: '#8b5cf6', active: showMA50, toggle: onToggleMA50 },
    ].map(({ label, color, active, toggle }) => (
      <button key={label} onClick={toggle} style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        background: 'transparent', border: 'none', cursor: 'pointer',
        padding: '4px 8px', borderRadius: '6px',
        opacity: active ? 1 : 0.3, transition: 'opacity 0.2s ease',
      }}>
        <div style={{ width: '20px', height: '2px', background: color, borderRadius: '2px' }} />
        <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
      </button>
    ))}
  </div>
);

// ─── Live Price Dot ───────────────────────────────────────────────────────────
const LivePriceDot = ({ price }) => {
  if (!price) return null;
  return (
    <div style={{
      position: 'absolute', top: 12, right: 16, zIndex: 5,
      display: 'flex', alignItems: 'center', gap: '6px',
      pointerEvents: 'none',
    }}>
      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#06b6d4', fontWeight: 600, letterSpacing: '0.04em' }}>
        LIVE {formatCurrency(price)}
      </span>
      <div style={{ position: 'relative', width: '8px', height: '8px' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: '#06b6d4',
          animation: 'pricePing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite',
          opacity: 0.4,
        }} />
        <div style={{
          position: 'absolute', inset: '2px', borderRadius: '50%',
          background: '#06b6d4',
          boxShadow: '0 0 6px rgba(6,182,212,0.8)',
        }} />
      </div>
    </div>
  );
};

// ─── CSS Keyframes injection ──────────────────────────────────────────────────
const CHART_STYLES = `
@keyframes pricePing {
  0% { transform: scale(1); opacity: 0.6; }
  70% { transform: scale(2.4); opacity: 0; }
  100% { transform: scale(2.4); opacity: 0; }
}
@keyframes replayDone {
  0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
  70% { box-shadow: 0 0 0 10px rgba(34,197,94,0); }
  100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
}
`;

const injectStyles = () => {
  if (document.getElementById('candlestick-chart-styles')) return;
  const el = document.createElement('style');
  el.id = 'candlestick-chart-styles';
  el.textContent = CHART_STYLES;
  document.head.appendChild(el);
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CandlestickChart = ({ data = [], signals = [] }) => {
  const mainContainerRef = useRef(null);
  const rsiContainerRef = useRef(null);
  const mainChartRef = useRef(null);
  const rsiChartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const markersPluginRef = useRef(null);
  const ma20Ref = useRef(null);
  const ma50Ref = useRef(null);
  const initAttemptRef = useRef(null);
  const replayTimerRef = useRef(null);
  const replayIndexRef = useRef(0);

  const [tooltipInfo, setTooltipInfo] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [latestPrice, setLatestPrice] = useState(null);

  // Replay state
  const [replayState, setReplayState] = useState('idle'); // idle | playing | paused | done
  const [replaySpeed, setReplaySpeed] = useState('1x');
  const [replayIndex, setReplayIndex] = useState(0);

  // Pre-process chart data
  const chartData = React.useMemo(() => {
    if (!data?.length) return [];
    return data
      .map(d => ({ time: toTime(d.x), open: d.o, high: d.h, low: d.l, close: d.c }))
      .sort((a, b) => a.time - b.time);
  }, [data]);

  const signalMap = React.useMemo(() => {
    const map = {};
    signals?.forEach(s => { map[toTime(s.date)] = s.type; });
    return map;
  }, [signals]);

  // Build all markers once
  const allMarkers = React.useMemo(() => (
    chartData
      .filter(d => signalMap[d.time])
      .map(d => {
        const isBuy = signalMap[d.time] === 'BUY';
        return {
          time: d.time,
          position: isBuy ? 'belowBar' : 'aboveBar',
          color: isBuy ? '#22c55e' : '#ef4444',
          shape: isBuy ? 'arrowUp' : 'arrowDown',
          text: isBuy ? 'BUY' : 'SELL',
          size: 1.5,
        };
      })
  ), [chartData, signalMap]);

  const destroyCharts = useCallback(() => {
    if (initAttemptRef.current) { cancelAnimationFrame(initAttemptRef.current); initAttemptRef.current = null; }
    if (replayTimerRef.current) { clearInterval(replayTimerRef.current); replayTimerRef.current = null; }
    try { if (mainChartRef.current) { mainChartRef.current.remove(); mainChartRef.current = null; } } catch (_) {}
    try { if (rsiChartRef.current) { rsiChartRef.current.remove(); rsiChartRef.current = null; } } catch (_) {}
    candleSeriesRef.current = null;
    markersPluginRef.current = null;
    ma20Ref.current = null;
    ma50Ref.current = null;
  }, []);

  const initCharts = useCallback(() => {
    if (!mainContainerRef.current || !rsiContainerRef.current || !chartData.length) return;
    const rect = mainContainerRef.current.getBoundingClientRect();
    const width = Math.floor(rect.width);
    if (width <= 0) { initAttemptRef.current = requestAnimationFrame(initCharts); return; }

    destroyCharts();
    injectStyles();
    setError(null);

    try {
      const sharedLayout = {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#52525b',
        fontFamily: "'JetBrains Mono','Fira Code',monospace",
        fontSize: 11,
      };
      const sharedGrid = {
        vertLines: { color: 'rgba(39,39,42,0.5)', style: LineStyle.Dotted },
        horzLines: { color: 'rgba(39,39,42,0.5)', style: LineStyle.Dotted },
      };
      const sharedCrosshair = {
        mode: CrosshairMode.Normal,
        vertLine: { color: 'rgba(6,182,212,0.4)', width: 1, style: LineStyle.Dashed, labelBackgroundColor: '#06b6d4' },
        horzLine: { color: 'rgba(6,182,212,0.4)', width: 1, style: LineStyle.Dashed, labelBackgroundColor: '#06b6d4' },
      };

      // Main chart
      const mainChart = createChart(mainContainerRef.current, {
        width, height: MAIN_HEIGHT,
        layout: sharedLayout, grid: sharedGrid, crosshair: sharedCrosshair,
        rightPriceScale: { borderColor: '#27272a', scaleMargins: { top: 0.08, bottom: 0.08 } },
        timeScale: { borderColor: '#27272a', timeVisible: true, secondsVisible: false, fixLeftEdge: true, visible: false },
        handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true },
        handleScale: { mouseWheel: true, pinch: true },
      });
      mainChartRef.current = mainChart;

      // RSI chart
      const rsiChart = createChart(rsiContainerRef.current, {
        width, height: RSI_HEIGHT,
        layout: sharedLayout, grid: sharedGrid, crosshair: sharedCrosshair,
        rightPriceScale: { borderColor: '#27272a', scaleMargins: { top: 0.1, bottom: 0.1 } },
        timeScale: { borderColor: '#27272a', timeVisible: true, secondsVisible: false, fixLeftEdge: true, fixRightEdge: false },
        handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true },
        handleScale: { mouseWheel: true, pinch: true },
      });
      rsiChartRef.current = rsiChart;

      // Sync time scales
      mainChart.timeScale().subscribeVisibleLogicalRangeChange(range => {
        if (range && rsiChartRef.current) rsiChartRef.current.timeScale().setVisibleLogicalRange(range);
      });
      rsiChart.timeScale().subscribeVisibleLogicalRangeChange(range => {
        if (range && mainChartRef.current) mainChartRef.current.timeScale().setVisibleLogicalRange(range);
      });

      // Candlestick
      const candleSeries = mainChart.addSeries(CandlestickSeries, {
        upColor: '#22c55e', downColor: '#ef4444',
        borderUpColor: '#22c55e', borderDownColor: '#ef4444',
        wickUpColor: '#22c55e', wickDownColor: '#ef4444',
      });
      candleSeries.setData(chartData);
      candleSeriesRef.current = candleSeries;

      // All markers
      if (allMarkers.length > 0) {
        markersPluginRef.current = createSeriesMarkers(candleSeries, allMarkers);
      }

      // MA 20
      const ma20 = mainChart.addSeries(LineSeries, {
        color: '#f59e0b', lineWidth: 1.5, lineStyle: LineStyle.Solid,
        crosshairMarkerVisible: false, priceLineVisible: false, lastValueVisible: false, title: 'MA 20',
      });
      ma20.setData(calcSMA(chartData, 20));
      ma20Ref.current = ma20;

      // MA 50
      const ma50 = mainChart.addSeries(LineSeries, {
        color: '#8b5cf6', lineWidth: 1.5, lineStyle: LineStyle.Solid,
        crosshairMarkerVisible: false, priceLineVisible: false, lastValueVisible: false, title: 'MA 50',
      });
      ma50.setData(calcSMA(chartData, 50));
      ma50Ref.current = ma50;

      // RSI
      const rsiData = calcRSI(chartData);
      if (rsiData.length > 0) {
        const rsiHisto = rsiChart.addSeries(HistogramSeries, { priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false });
        rsiHisto.setData(rsiData.map(d => ({ time: d.time, value: d.value, color: d.value >= 70 ? 'rgba(239,68,68,0.14)' : d.value <= 30 ? 'rgba(34,197,94,0.14)' : 'rgba(6,182,212,0.06)' })));

        const rsiLine = rsiChart.addSeries(LineSeries, { color: '#06b6d4', lineWidth: 1.5, priceLineVisible: false, lastValueVisible: true, title: 'RSI 14' });
        rsiLine.setData(rsiData);

        [{ val: 70, color: 'rgba(239,68,68,0.4)' }, { val: 30, color: 'rgba(34,197,94,0.4)' }].forEach(({ val, color }) => {
          const s = rsiChart.addSeries(LineSeries, { color, lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false });
          s.setData(rsiData.map(d => ({ time: d.time, value: val })));
        });
      }

      mainChart.timeScale().fitContent();
      setLatestPrice(chartData[chartData.length - 1]?.close ?? null);

      // Crosshair tooltip
      mainChart.subscribeCrosshairMove((param) => {
        if (!param.time || !param.seriesData) { setTooltipVisible(false); return; }
        const bar = param.seriesData.get(candleSeries);
        if (bar) {
          setTooltipInfo({
            date: formatDate(new Date(param.time * 1000).toISOString(), 'MMM d, yyyy'),
            open: bar.open, high: bar.high, low: bar.low, close: bar.close,
          });
          setTooltipVisible(true);
        } else {
          setTooltipVisible(false);
        }
      });

      // Resize observer
      const ro = new ResizeObserver(entries => {
        for (const entry of entries) {
          const w = Math.floor(entry.contentRect.width);
          if (w > 0) {
            if (mainChartRef.current) mainChartRef.current.applyOptions({ width: w });
            if (rsiChartRef.current) rsiChartRef.current.applyOptions({ width: w });
          }
        }
      });
      ro.observe(mainContainerRef.current);

      setTimeout(() => setReady(true), 60);
      return () => ro.disconnect();
    } catch (err) {
      console.error('[CandlestickChart] init error:', err);
      setError(err.message || 'Chart failed to initialize.');
    }
  }, [chartData, allMarkers, destroyCharts]);

  useEffect(() => {
    if (!chartData.length) return;
    initAttemptRef.current = requestAnimationFrame(initCharts);
    return destroyCharts;
  }, [chartData, initCharts, destroyCharts]);

  // MA visibility toggles
  useEffect(() => { ma20Ref.current?.applyOptions({ visible: showMA20 }); }, [showMA20]);
  useEffect(() => { ma50Ref.current?.applyOptions({ visible: showMA50 }); }, [showMA50]);

  // ── Replay Engine ───────────────────────────────────────────────────────────
  const stopReplayTimer = useCallback(() => {
    if (replayTimerRef.current) { clearInterval(replayTimerRef.current); replayTimerRef.current = null; }
  }, []);

  const startReplayTimer = useCallback((fromIndex) => {
    const chart = mainChartRef.current;
    const series = candleSeriesRef.current;
    if (!chart || !series || !chartData.length) return;

    stopReplayTimer();
    replayIndexRef.current = fromIndex;

    const totalCandles = chartData.length;
    const windowSize = Math.min(60, Math.floor(totalCandles * 0.3)); // Show ~30% at first

    replayTimerRef.current = setInterval(() => {
      const idx = replayIndexRef.current;
      if (idx >= totalCandles) {
        stopReplayTimer();
        setReplayState('done');
        // Restore all markers
        if (allMarkers.length > 0) {
          try { createSeriesMarkers(series, allMarkers); } catch (_) {}
        }
        return;
      }

      // Reveal candles up to current index
      const visibleData = chartData.slice(0, idx + 1);
      series.setData(visibleData);

      // Reveal markers up to current candle time
      const currentTime = chartData[idx].time;
      const visibleMarkers = allMarkers.filter(m => m.time <= currentTime);
      try { createSeriesMarkers(series, visibleMarkers); } catch (_) {}

      // Scroll to keep current candle in view
      const startIdx = Math.max(0, idx - windowSize);
      chart.timeScale().setVisibleLogicalRange({ from: startIdx, to: idx + 4 });

      // Update MAs to match visible data
      if (ma20Ref.current && visibleData.length >= 20) {
        ma20Ref.current.setData(calcSMA(visibleData, 20));
      }
      if (ma50Ref.current && visibleData.length >= 50) {
        ma50Ref.current.setData(calcSMA(visibleData, 50));
      }

      // Update live price
      setLatestPrice(chartData[idx].close);

      replayIndexRef.current = idx + 1;
      setReplayIndex(idx + 1);
    }, SPEED_MAP[replaySpeed]);
  }, [chartData, allMarkers, replaySpeed, stopReplayTimer]);

  const handleReplayPlay = useCallback(() => {
    const series = candleSeriesRef.current;
    if (!series) return;

    const startFrom = replayState === 'done' ? 0 : replayIndexRef.current;

    if (replayState === 'done' || replayState === 'idle') {
      // Full reset
      series.setData([]);
      if (ma20Ref.current) ma20Ref.current.setData([]);
      if (ma50Ref.current) ma50Ref.current.setData([]);
      try { createSeriesMarkers(series, []); } catch (_) {}
      replayIndexRef.current = 0;
      setReplayIndex(0);
    }

    setReplayState('playing');
    startReplayTimer(startFrom);
  }, [replayState, startReplayTimer]);

  const handleReplayPause = useCallback(() => {
    stopReplayTimer();
    setReplayState('paused');
  }, [stopReplayTimer]);

  const handleReplayReset = useCallback(() => {
    stopReplayTimer();
    setReplayState('idle');
    replayIndexRef.current = 0;
    setReplayIndex(0);

    const series = candleSeriesRef.current;
    if (!series) return;
    series.setData(chartData);
    if (ma20Ref.current) ma20Ref.current.setData(calcSMA(chartData, 20));
    if (ma50Ref.current) ma50Ref.current.setData(calcSMA(chartData, 50));
    if (allMarkers.length > 0) { try { createSeriesMarkers(series, allMarkers); } catch (_) {} }
    if (mainChartRef.current) mainChartRef.current.timeScale().fitContent();
    setLatestPrice(chartData[chartData.length - 1]?.close ?? null);
  }, [chartData, allMarkers, stopReplayTimer]);

  const handleSpeedChange = useCallback((s) => {
    setReplaySpeed(s);
    if (replayState === 'playing') {
      // Restart timer with new speed
      stopReplayTimer();
      setTimeout(() => startReplayTimer(replayIndexRef.current), 0);
    }
  }, [replayState, startReplayTimer, stopReplayTimer]);

  // Update interval when speed changes while playing
  useEffect(() => {
    if (replayState === 'playing') {
      stopReplayTimer();
      startReplayTimer(replayIndexRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replaySpeed]);

  if (!data?.length) return null;

  if (error) {
    return (
      <div className="card w-full" style={{ padding: 'var(--space-lg) var(--space-xl)', minHeight: '100px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span className="text-secondary" style={{ fontSize: '14px' }}>Chart error: {error}</span>
      </div>
    );
  }

  const progress = chartData.length > 0 ? replayIndex / chartData.length : 0;

  return (
    <div className="card w-full animate-in" style={{ padding: 'var(--space-lg) var(--space-xl)', animationDelay: '400ms', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0 }}>Underlying Asset — Price Action</h3>
          <p className="text-secondary" style={{ fontSize: '13px', marginTop: '4px' }}>
            OHLC candlestick · MA overlays · RSI panel · execution signals
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <SignalCount signals={signals} />
          <Legend showMA20={showMA20} showMA50={showMA50} onToggleMA20={() => setShowMA20(v => !v)} onToggleMA50={() => setShowMA50(v => !v)} />
        </div>
      </div>

      {/* Replay controls */}
      <div style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid rgba(39,39,42,0.6)' }}>
        <ReplayControls
          state={replayState}
          speed={replaySpeed}
          progress={progress}
          onPlay={handleReplayPlay}
          onPause={handleReplayPause}
          onReset={handleReplayReset}
          onSpeedChange={handleSpeedChange}
        />
      </div>

      {/* Charts */}
      <div style={{ opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(10px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
        <div style={{ position: 'relative' }}>
          <Tooltip info={tooltipInfo} visible={tooltipVisible} />
          <LivePriceDot price={latestPrice} />
          <div ref={mainContainerRef} style={{ width: '100%', height: `${MAIN_HEIGHT}px` }} />
        </div>

        {/* RSI label strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0 0' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#06b6d4', padding: '2px 8px', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '4px', background: 'rgba(6,182,212,0.07)', whiteSpace: 'nowrap' }}>RSI 14</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '10px', color: 'rgba(239,68,68,0.7)', fontWeight: 600 }}>OB 70</span>
          <span style={{ fontSize: '10px', color: 'rgba(34,197,94,0.7)', fontWeight: 600 }}>OS 30</span>
        </div>

        <div ref={rsiContainerRef} style={{ width: '100%', height: `${RSI_HEIGHT}px` }} />
      </div>
    </div>
  );
};

export default CandlestickChart;
