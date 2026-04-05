import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBacktest } from '../hooks/useBacktest';
import TradeTable from '../components/display/TradeTable';
import FilterBar from '../components/display/FilterBar';
import { getTrades } from '../services/backtestService';
import TiltCard from '../components/ui/TiltCard';

const TradeHistoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backtestId, trades, setTrades, status } = useBacktest();
  
  const [filterType, setFilterType] = useState('ALL');
  const [sortConfig, setSortConfig] = useState({ key: 'date', dir: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // If the user navigates directly here, we might need to fetch trades if not in context
  useEffect(() => {
    if (!backtestId || backtestId !== id) {
       // Only redirect if we're not in a state where data is expected
       if (status !== 'loading' && status !== 'success') {
         navigate('/dashboard');
         return;
       }
    }

    if (trades.length === 0 && status === 'success') {
      const fetchTrades = async () => {
        setIsLoading(true);
        try {
          const res = await getTrades(backtestId);
          setTrades(res.data.trades);
        } catch (error) {
          console.error("Failed to load trades", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchTrades();
    }
  }, [id, backtestId, trades.length, status, navigate, setTrades]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, sortConfig]);

  const handleExport = () => {
    // Generate CSV stub
    const headers = ['Date', 'Type', 'Entry Price', 'Exit Price', 'Quantity', 'PnL', 'Return %'];
    const rows = trades.map(t => 
      [t.date, t.type, t.entry_price, t.exit_price, t.quantity, t.pnl, t.return_pct].join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `trades_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-col gap-xl w-full" style={{ paddingBottom: 'var(--space-2xl)' }}>
      {/* Header */}
      <div className="flex justify-between items-center w-full animate-in" style={{ animationDelay: '0ms' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Trade Execution Log</h1>
          <p className="text-secondary">Viewing historical trades for simulation <span className="mono text-muted">{id}</span></p>
        </div>
        
        <button className="btn btn-secondary hover-scale btn-active" onClick={() => navigate(`/dashboard/results/${id}`)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Results
        </button>
      </div>

      <div className="animate-in" style={{ animationDelay: '200ms' }}>
        <FilterBar 
          filterType={filterType} 
          setFilterType={setFilterType} 
          sortConfig={sortConfig} 
          setSortConfig={setSortConfig}
          onExport={handleExport}
        />
      </div>

      <div className="animate-in" style={{ animationDelay: '400ms' }}>
        {isLoading ? (
          <div className="card skeleton" style={{ height: '600px', width: '100%' }} />
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <TradeTable 
              trades={trades} 
              filterType={filterType}
              sortConfig={sortConfig}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeHistoryPage;
