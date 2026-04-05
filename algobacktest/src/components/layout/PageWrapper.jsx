import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const PageWrapper = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', position: 'relative', background: 'var(--bg-deep)', overflow: 'hidden' }}>
      {/* Ambient Moving Background (CSS Grid) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(var(--border) 1.5px, transparent 1.5px), linear-gradient(90deg, var(--border) 1.5px, transparent 1.5px)',
        backgroundSize: '80px 80px',
        opacity: 0.08,
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, var(--primary-dim) 0%, transparent 60%)',
        opacity: 0.2,
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      <Navbar style={{ zIndex: 100 }} />
      <div style={{ display: 'flex', flex: 1, position: 'relative', zIndex: 10 }}>
        <Sidebar />
        <main style={{ 
          flex: 1, 
          marginLeft: 'var(--sidebar-width)', 
          padding: 'var(--space-2xl)',
          width: 'calc(100% - var(--sidebar-width))',
          minHeight: 'calc(100vh - var(--navbar-height))',
        }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageWrapper;
