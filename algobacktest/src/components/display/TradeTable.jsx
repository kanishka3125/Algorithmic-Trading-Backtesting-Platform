import React from 'react';
import Badge from '../ui/Badge';
import { formatDate, formatCurrency, formatPct, colorClass } from '../../utils/formatters';

const TradeTable = ({ trades, filterType, sortConfig, currentPage, setCurrentPage }) => {
  const pageSize = 25;

  // 1. Filter
  let displayData = [...trades];
  if (filterType !== 'ALL') {
    displayData = displayData.filter(t => t.type.toUpperCase() === filterType);
  }

  // 2. Sort
  displayData.sort((a, b) => {
    let valA, valB;
    if (sortConfig.key === 'date') {
      valA = new Date(a.date).getTime();
      valB = new Date(b.date).getTime();
    } else if (sortConfig.key === 'pnl') {
      valA = a.pnl;
      valB = b.pnl;
    } else if (sortConfig.key === 'price') {
      valA = a.entry_price;
      valB = b.entry_price;
    }

    if (valA < valB) return sortConfig.dir === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.dir === 'asc' ? 1 : -1;
    return 0;
  });

  // Calculate summaries before pagination
  const totalPnL = displayData.reduce((acc, t) => acc + (t.pnl || 0), 0);
  const avgReturn = displayData.length > 0 
    ? displayData.reduce((acc, t) => acc + (t.return_pct || 0), 0) / displayData.length 
    : 0;

  // 3. Paginate
  const totalPages = Math.max(1, Math.ceil(displayData.length / pageSize));
  const pageData = displayData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
              <th className="label" style={{ padding: 'var(--space-md) var(--space-lg)', width: '60px' }}>#</th>
              <th className="label" style={{ padding: 'var(--space-md) var(--space-lg)' }}>Date</th>
              <th className="label" style={{ padding: 'var(--space-md) var(--space-lg)' }}>Type</th>
              <th className="label" style={{ padding: 'var(--space-md) var(--space-lg)', textAlign: 'right' }}>Entry Price</th>
              <th className="label" style={{ padding: 'var(--space-md) var(--space-lg)', textAlign: 'right' }}>Exit Price</th>
              <th className="label" style={{ padding: 'var(--space-md) var(--space-lg)', textAlign: 'right' }}>Quantity</th>
              <th className="label" style={{ padding: 'var(--space-md) var(--space-lg)', textAlign: 'right' }}>PnL</th>
              <th className="label" style={{ padding: 'var(--space-md) var(--space-lg)', textAlign: 'right' }}>Return</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((trade, idx) => (
                <tr 
                  key={trade.id || idx} 
                  style={{ borderBottom: '1px solid var(--border)', animationDelay: `${idx * 40}ms` }}
                  className="card-hover row-animate"
                >
                  <td style={{ padding: '12px var(--space-lg)', color: 'var(--muted)', fontSize: '13px' }}>
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td style={{ padding: '12px var(--space-lg)' }}>
                    {formatDate(trade.date)}
                  </td>
                  <td style={{ padding: '12px var(--space-lg)' }}>
                    <Badge type={trade.type} />
                  </td>
                  <td className="mono" style={{ padding: '12px var(--space-lg)', textAlign: 'right' }}>
                    {formatCurrency(trade.entry_price)}
                  </td>
                  <td className="mono" style={{ padding: '12px var(--space-lg)', textAlign: 'right' }}>
                    {formatCurrency(trade.exit_price)}
                  </td>
                  <td className="mono" style={{ padding: '12px var(--space-lg)', textAlign: 'right' }}>
                    {trade.quantity}
                  </td>
                  <td className={`mono font-bold ${colorClass(trade.pnl)}`} style={{ padding: '12px var(--space-lg)', textAlign: 'right' }}>
                    {trade.pnl > 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                  </td>
                  <td className={`mono ${colorClass(trade.return_pct)}`} style={{ padding: '12px var(--space-lg)', textAlign: 'right' }}>
                    {formatPct(trade.return_pct)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--muted)' }}>
                  No trades found matching filters.
                </td>
              </tr>
            )}
            
            {/* Summary Row */}
            {displayData.length > 0 && (
              <tr style={{ background: 'var(--primary-dim)', borderTop: '2px solid var(--border)' }}>
                <td colSpan="3" style={{ padding: '12px var(--space-lg)' }}><strong>Sum ({displayData.length} trades)</strong></td>
                <td colSpan="3"></td>
                <td className={`mono ${colorClass(totalPnL)}`} style={{ padding: '12px var(--space-lg)', textAlign: 'right', fontWeight: 'bold' }}>
                  {totalPnL > 0 ? '+' : ''}{formatCurrency(totalPnL)}
                </td>
                <td className={`mono ${colorClass(avgReturn)}`} style={{ padding: '12px var(--space-lg)', textAlign: 'right', fontWeight: 'bold' }}>
                  {formatPct(avgReturn)} avg
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center" style={{ padding: 'var(--space-md) var(--space-lg)', borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
          <span className="text-secondary" style={{ fontSize: '13px' }}>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, displayData.length)} of {displayData.length} records
          </span>
          <div className="flex gap-sm">
            <button 
              className="btn btn-secondary btn-sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Previous
            </button>
            <div className="flex items-center justify-center p-sm" style={{ minWidth: '40px', background: 'var(--bg-deep)', borderRadius: 'var(--radius-badge)', fontSize: '13px' }}>
              {currentPage} / {totalPages}
            </div>
            <button 
              className="btn btn-secondary btn-sm" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeTable;
