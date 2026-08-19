import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { SessionProvider } from './context/SessionContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AddressProvider } from './context/AddressContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SessionProvider>
          <AddressProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AddressProvider>
        </SessionProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);