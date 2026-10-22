import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// The HTML splash prevents a first-paint flash; hand control to the React
// preloader as soon as the application has mounted.
requestAnimationFrame(() => {
  document.getElementById('toomakt-initial-splash')?.remove();
});
