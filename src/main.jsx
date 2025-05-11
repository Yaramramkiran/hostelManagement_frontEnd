import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { HostelProvider } from './context/HostelContext';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <HostelProvider>
        <App />
        <ToastContainer position="top-center" autoClose={3000} />
      </HostelProvider>
    </AuthProvider>
  </React.StrictMode>
);