import React from 'react';

const FilterBar = ({ filterType, setFilterType, sortConfig, setSortConfig, onExport }) => {
  return (
    <div className="flex justify-between items-center w-full card" style={{ padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
      {/* Type Filters */}
      <div className="flex items-center gap-sm">
        <span className="text-secondary label" style={{ marginRight: '8px' }}>Filter:</span>
        <button 
          className={`btn btn-sm ${filterType === 'ALL' ? 'btn-secondary text-primary' : 'btn-ghost'}`}
          onClick={() => setFilterType('ALL')}
          style={{ borderColor: filterType === 'ALL' ? 'var(--primary)' : 'transparent' }}
        >
          All
        </button>
        <button 
          className={`btn btn-sm ${filterType === 'BUY' ? 'btn-secondary text-primary' : 'btn-ghost'}`}
          onClick={() => setFilterType('BUY')}
          style={{ borderColor: filterType === 'BUY' ? 'var(--primary)' : 'transparent' }}
        >
          Buy
        </button>
        <button 
          className={`btn btn-sm ${filterType === 'SELL' ? 'btn-secondary text-primary' : 'btn-ghost'}`}
          onClick={() => setFilterType('SELL')}
          style={{ borderColor: filterType === 'SELL' ? 'var(--primary)' : 'transparent' }}
        >
          Sell
        </button>
      </div>
      
      <div className="flex items-center gap-md">
        {/* Sort Controls */}
        <div className="flex items-center gap-sm">
          <span className="text-secondary label">Sort By:</span>
          <select 
            className="form-select" 
            style={{ padding: '6px 30px 6px 12px', fontSize: '13px', width: 'auto' }}
            value={sortConfig.key}
            onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value })}
          >
            <option value="date">Date</option>
            <option value="pnl">PnL</option>
            <option value="price">Execution Price</option>
          </select>
          <button 
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px' }}
            onClick={() => setSortConfig({ ...sortConfig, dir: sortConfig.dir === 'asc' ? 'desc' : 'asc' })}
            title={sortConfig.dir === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortConfig.dir === 'asc' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
            )}
          </button>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>

        {/* Export Action */}
        <button className="btn btn-secondary btn-sm" onClick={onExport}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
