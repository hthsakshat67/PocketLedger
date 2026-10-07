import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { LedgerProvider } from './context/LedgerContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <LedgerProvider>
        <App />
      </LedgerProvider>
    </AuthProvider>
  </React.StrictMode>,
)
