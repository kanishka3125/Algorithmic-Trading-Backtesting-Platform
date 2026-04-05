import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine 
} from 'recharts';
import { formatCurrency, formatDateShort } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        padding: '12px',
        borderRadius: 'var(--radius-card)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
      }}>
        <p className="label text-muted" style={{ marginBottom: '8px' }}>{formatDateShort(label)}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-xl mb-1" style={{ marginBottom: '4px' }}>
            <div className="flex items-center gap-sm">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }} />
              <span className="text-secondary" style={{ fontSize: '13px' }}>{entry.name}</span>
            </div>
            <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {formatCurrency(entry.value)}
            </strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const LiveDot = (props) => {
  const { cx, cy, stroke, payload, index, data } = props;
  // Only render for the very last point to simulate "live" data
  if (index === data.length - 1) {
    return (
      <svg x={cx - 10} y={cy - 10} width={20} height={20} style={{ overflow: 'visible' }}>
        {/* Simple static high-contrast dot for performance */}
        <circle cx="10" cy="10" r="5" fill="var(--primary)" stroke="white" strokeWidth={1.5} />
      </svg>
    );
  }
  return null;
};

const EquityCurveChart = ({ data = [], showBenchmark = true }) => {
  const [hoveredData, setHoveredData] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="card flex items-center justify-center p-2xl text-muted" style={{ height: '400px' }}>
        No equity curve data available.
      </div>
    );
  }

  // Calculate domains for Y-axis to give some padding
  const minValue = Math.min(...data.map(d => Math.min(d.value, d.benchmark || Infinity)));
  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.benchmark || -Infinity)));
  const buffer = (maxValue - minValue) * 0.05;

  return (
    <div className="card w-full animate-in" style={{ padding: 'var(--space-lg) var(--space-xl)', animationDelay: '400ms' }}>
      <div className="flex justify-between items-center mb-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        <div>
          <h3 style={{ margin: 0 }}>Portfolio Value (Equity Curve)</h3>
          <p className="text-secondary" style={{ fontSize: '13px' }}>Simulated performance vs. benchmark asset.</p>
        </div>
      </div>
      
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            onMouseMove={(e) => {
              if (e.activePayload) {
                setHoveredData(e.activePayload[0].payload);
              }
            }}
            onMouseLeave={() => setHoveredData(null)}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis 
              dataKey="date" 
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
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px' }}/>
            
            <Line 
              type="monotone" 
              dataKey="value" 
              name="Strategy Value" 
              stroke="var(--primary)" 
              strokeWidth={3} 
              dot={<LiveDot data={data} />}
              activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary)' }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="cubic-bezier(0.4, 0, 0.2, 1)"
            />
            
            {showBenchmark && (
              <Line 
                type="monotone" 
                dataKey="benchmark" 
                name="S&P 500 Benchmark" 
                stroke="var(--muted)" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                dot={false}
                activeDot={false}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="cubic-bezier(0.4, 0, 0.2, 1)"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EquityCurveChart;
