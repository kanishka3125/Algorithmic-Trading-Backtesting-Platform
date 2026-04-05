import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { BacktestProvider } from './context/BacktestContext';
import { ThemeProvider } from './context/ThemeContext';

import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <BacktestProvider>
          <App />
        </BacktestProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
