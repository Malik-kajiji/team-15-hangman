import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AlertContext from './context/AlertContext';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AlertContext>
      <React.StrictMode>
        <App />
      </React.StrictMode>
  </AlertContext>
);


