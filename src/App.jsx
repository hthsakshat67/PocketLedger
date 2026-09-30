import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Bills from './pages/Bills';
import Subscriptions from './pages/Subscriptions';
import Budgets from './pages/Budgets';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Family from './pages/Family';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Authenticated Routes */}
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/expenses" element={<AppLayout><Expenses /></AppLayout>} />
        <Route path="/bills" element={<AppLayout><Bills /></AppLayout>} />
        <Route path="/subscriptions" element={<AppLayout><Subscriptions /></AppLayout>} />
        <Route path="/budgets" element={<AppLayout><Budgets /></AppLayout>} />
        <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
        <Route path="/reports" element={<AppLayout><Reports /></AppLayout>} />
        <Route path="/family" element={<AppLayout><Family /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
