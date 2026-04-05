import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { formatCurrency, formatDateShort, formatPct } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Sort payload by value descending
    const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
    
    return (
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        padding: '12px',
        borderRadius: 'var(--radius-card)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
      }}>
        <p className="label text-muted" style={{ marginBottom: '8px' }}>{formatDateShort(label)}</p>
        {sortedPayload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-xl mb-1" style={{ marginBottom: '4px' }}>
            <div className="flex items-center gap-sm">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }} />
              <span className="text-secondary" style={{ fontSize: '13px' }}>{entry.name}</span>
            </div>
            <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {formatPct(entry.value)}
            </strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ComparisonChart = ({ strategies = [] }) => {
  const [hiddenLines, setHiddenLines] = useState({});

  if (!strategies || strategies.length === 0) {
    return (
      <div className="card flex items-center justify-center p-2xl text-muted" style={{ height: '400px' }}>
        Add strategies below to run comparison.
      </div>
    );
  }

  // Flatten logic: assuming strategies prop contains { id, name, color, data: [{date, returnPct}] }
  // We need to merge them into a single data array organized by date
  const dataMap = {};
  strategies.forEach(strat => {
    strat.data.forEach(d => {
      if (!dataMap[d.date]) dataMap[d.date] = { date: d.date };
      dataMap[d.date][strat.id] = d.returnPct;
    });
  });
  
  const mergedData = Object.values(dataMap).sort((a, b) => new Date(a.date) - new Date(b.date));

  const toggleLine = (dataKey) => {
    setHiddenLines(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap', marginTop: 'var(--space-md)' }}>
        {payload.map((entry, index) => (
          <li 
            key={`item-${index}`} 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              opacity: hiddenLines[entry.dataKey] ? 0.4 : 1,
              transition: 'opacity 0.2s',
              fontSize: '13px',
              color: 'var(--text-secondary)'
            }}
            onClick={() => toggleLine(entry.dataKey)}
          >
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: entry.color }} />
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="card w-full" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
      <div className="flex justify-between items-center mb-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        <div>
          <h3 style={{ margin: 0 }}>Comparative Performance</h3>
          <p className="text-secondary" style={{ fontSize: '13px' }}>Cumulative return % across simulated strategies.</p>
        </div>
      </div>
      
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={mergedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              tickFormatter={(val) => `${val}%`} 
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
            
            {strategies.map((strat) => (
              <Line 
                key={strat.id}
                type="monotone" 
                dataKey={strat.id} 
                name={strat.name} 
                stroke={strat.color} 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: strat.color }}
                hide={hiddenLines[strat.id] === true}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;
