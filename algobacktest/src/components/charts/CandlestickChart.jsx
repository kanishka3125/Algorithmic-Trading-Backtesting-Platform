import React from 'react';
import { 
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, Brush, Scatter 
} from 'recharts';
import { formatCurrency, formatDateShort } from '../../utils/formatters';

const CandlestickShape = (props) => {
  const { x, y, width, height, payload, yAxis, xAxis } = props;
  
  if (!payload) return null;
  
  const { o, h, l, c } = payload;
  
  if (o === undefined || h === undefined || l === undefined || c === undefined) {
    return null; // fallback if bad data
  }

  // Calculate pixel coordinates mapping to values
  // In a real chart we'd hook into Rechart's scale, but since we are passed the raw rect parameters
  // from the Bar component, y is the top of the body, height is absolute value of (open-close)
  
  const isUp = c >= o;
  const color = isUp ? 'var(--primary)' : 'var(--danger)';

  // yAxis.scale is a function mapping data value to pixel Y coordinate
  if (!yAxis || !yAxis.scale) return null;
  
  const scale = yAxis.scale;
  const topHigh = scale(h);
  const bottomLow = scale(l);
  const bodyTop = scale(Math.max(o, c));
  const bodyBottom = scale(Math.min(o, c));
  
  const centerX = x + width / 2;

  return (
    <g stroke={color} fill={color}>
      {/* Wick */}
      <line x1={centerX} y1={topHigh} x2={centerX} y2={bottomLow} />
      {/* Body */}
      <rect 
        x={x} 
        y={bodyTop} 
        width={width} 
        height={Math.max(bodyBottom - bodyTop, 1)} 
        fill={isUp ? 'transparent' : color} 
        strokeWidth={2}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isUp = data.c >= data.o;
    const color = isUp ? 'var(--primary)' : 'var(--danger)';

    return (
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        padding: '12px',
        borderRadius: 'var(--radius-card)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
      }}>
        <p className="label text-muted" style={{ marginBottom: '8px' }}>{formatDateShort(label || data.x)}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '13px' }}>
          <div className="flex justify-between gap-sm">
            <span className="text-secondary">Open:</span>
            <span className="mono">{formatCurrency(data.o)}</span>
          </div>
          <div className="flex justify-between gap-sm">
            <span className="text-secondary">High:</span>
            <span className="mono">{formatCurrency(data.h)}</span>
          </div>
          <div className="flex justify-between gap-sm">
            <span className="text-secondary">Low:</span>
            <span className="mono">{formatCurrency(data.l)}</span>
          </div>
          <div className="flex justify-between gap-sm">
            <span className="text-secondary">Close:</span>
            <strong className="mono" style={{ color }}>{formatCurrency(data.c)}</strong>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const TradeMarker = (props) => {
  const { cx, cy, payload } = props;
  if (!payload || (!payload.isBuy && !payload.isSell)) return null;

  if (payload.isBuy) {
    return (
      <svg x={cx - 10} y={cy} width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)" stroke="var(--bg-elevated)" strokeWidth="1">
        <path d="M12 2L22 20H2L12 2Z"></path>
      </svg>
    );
  } else if (payload.isSell) {
    return (
      <svg x={cx - 10} y={cy - 20} width="20" height="20" viewBox="0 0 24 24" fill="var(--danger)" stroke="var(--bg-elevated)" strokeWidth="1">
        <path d="M12 22L2 4H22L12 22Z"></path>
      </svg>
    );
  }
  return null;
};

const CandlestickChart = ({ data = [], signals = [] }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Map signals onto the main data array based on date matching
  const processedData = data.map(d => {
    const candleDate = new Date(d.x).toISOString().split('T')[0];
    const trade = signals?.find(s => s.date === candleDate);
    
    if (trade) {
      return { 
        ...d, 
        isBuy: trade.type === 'BUY', 
        isSell: trade.type === 'SELL',
        markerY: trade.type === 'BUY' ? d.l : d.h  // Place marker at the high or low of the candle
      };
    }
    return d;
  });

  // Calculate domains
  const minValue = Math.min(...processedData.map(d => d.l));
  const maxValue = Math.max(...processedData.map(d => d.h));
  const buffer = (maxValue - minValue) * 0.1;

  return (
    <div className="card w-full animate-in" style={{ padding: 'var(--space-lg) var(--space-xl)', animationDelay: '400ms' }}>
      <div className="flex justify-between items-center mb-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        <div>
          <h3 style={{ margin: 0 }}>Underlying Asset Data</h3>
          <p className="text-secondary" style={{ fontSize: '13px' }}>OHLC price action with simulated execution signals.</p>
        </div>
      </div>
      
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={processedData}
            margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis 
              dataKey="x" 
              tickFormatter={formatDateShort} 
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              tickMargin={10}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
              minTickGap={50}
            />
            <YAxis 
              domain={[minValue - buffer, maxValue + buffer]} 
              tickFormatter={(val) => formatCurrency(val, 0)} 
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* The bar maps to a custom shape representing the candle */}
            <Bar dataKey="c" shape={<CandlestickShape />} />
            
            {/* Custom Trade Markers overlaid on the High/Low */}
            <Scatter dataKey="markerY" shape={<TradeMarker />} />
            
            {/* Interactive Zoom Brush */}
            <Brush 
              dataKey="x" 
              height={30} 
              stroke="var(--primary)" 
              fill="var(--bg-elevated)"
              tickFormatter={formatDateShort}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CandlestickChart;
