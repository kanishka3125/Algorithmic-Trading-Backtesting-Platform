import React from 'react';
import { NavLink } from 'react-router-dom';
import { useBacktest } from '../../hooks/useBacktest';

const Sidebar = () => {
  const { backtestId } = useBacktest();

  return (
    <aside 
      className="animate-slide-left"
      style={{
        width: 'var(--sidebar-width)',
        height: 'calc(100vh - var(--navbar-height))',
        borderRight: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(10px)',
        padding: 'var(--space-lg) 0',
        position: 'fixed',
        left: 0,
        top: 'var(--navbar-height)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)',
        zIndex: 90
      }}
    >
      <div style={{ padding: '0 var(--space-lg)' }}>
        <h4 className="label text-muted" style={{ marginBottom: 'var(--space-md)' }}>Menu</h4>
      </div>
      
      <NavLink 
        to="/dashboard" 
        end
        className={({isActive}) => `flex items-center gap-sm ${isActive ? 'text-primary' : 'text-secondary'}`}
        style={({isActive}) => ({
          padding: '10px var(--space-lg)',
          textDecoration: 'none',
          background: isActive ? 'var(--primary-dim)' : 'transparent',
          borderRight: isActive ? '3px solid var(--primary)' : '3px solid transparent',
          fontWeight: 500
        })}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        Dashboard
      </NavLink>

      {backtestId && (
        <>
          <NavLink 
            to={`/dashboard/results/${backtestId}`} 
            className={({isActive}) => `flex items-center gap-sm ${isActive ? 'text-primary' : 'text-secondary'}`}
            style={({isActive}) => ({
              padding: '10px var(--space-lg)',
              textDecoration: 'none',
              background: isActive ? 'var(--primary-dim)' : 'transparent',
              borderRight: isActive ? '3px solid var(--primary)' : '3px solid transparent',
              fontWeight: 500
            })}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Results
          </NavLink>

          <NavLink 
            to={`/dashboard/trades/${backtestId}`} 
            className={({isActive}) => `flex items-center gap-sm ${isActive ? 'text-primary' : 'text-secondary'}`}
            style={({isActive}) => ({
              padding: '10px var(--space-lg)',
              textDecoration: 'none',
              background: isActive ? 'var(--primary-dim)' : 'transparent',
              borderRight: isActive ? '3px solid var(--primary)' : '3px solid transparent',
              fontWeight: 500
            })}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Trades
          </NavLink>
        </>
      )}

      <NavLink 
        to="/dashboard/compare" 
        className={({isActive}) => `flex items-center gap-sm ${isActive ? 'text-primary' : 'text-secondary'}`}
        style={({isActive}) => ({
          padding: '10px var(--space-lg)',
          textDecoration: 'none',
          background: isActive ? 'var(--primary-dim)' : 'transparent',
          borderRight: isActive ? '3px solid var(--primary)' : '3px solid transparent',
          fontWeight: 500
        })}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="14" width="6" height="6"></rect><rect x="15" y="14" width="6" height="6"></rect><rect x="9" y="4" width="6" height="6"></rect><path d="M6 14L12 10L18 14"></path></svg>
        Compare
      </NavLink>
    </aside>
  );
};

export default Sidebar;
