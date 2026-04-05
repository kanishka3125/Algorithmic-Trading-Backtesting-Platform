import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageWrapper from './components/layout/PageWrapper';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';
import TradeHistoryPage from './pages/TradeHistoryPage';
import ComparisonPage from './pages/ComparisonPage';
import LandingPage from './pages/LandingPage';

import CustomCursor from './components/ui/CustomCursor';

function App() {
  return (
    <>
      <CustomCursor />
      <Routes>
        {/* Fullscreen Landing Intro */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Application Shell */}
        <Route path="/dashboard/*" element={
          <PageWrapper>
            <Routes>
              <Route index element={<DashboardPage />} />
              <Route path="results/:id" element={<ResultsPage />} />
              <Route path="trades/:id" element={<TradeHistoryPage />} />
              <Route path="compare" element={<ComparisonPage />} />
              <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
          </PageWrapper>
        } />
        
        {/* Navigation catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
