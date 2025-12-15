import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress browser extension errors
window.addEventListener('error', (e) => {
  // Only suppress specific browser extension errors, not security-related errors
  if (e.message && e.message.includes('message channel closed') && 
      e.filename && e.filename.includes('extension')) {
    e.preventDefault();
  }
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);