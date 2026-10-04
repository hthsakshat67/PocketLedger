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
import ProtectedRoute from './components/auth/ProtectedRoute';

const privateRoutes = [
  ['/dashboard', Dashboard],
  ['/expenses', Expenses],
  ['/bills', Bills],
  ['/subscriptions', Subscriptions],
  ['/budgets', Budgets],
  ['/analytics', Analytics],
  ['/reports', Reports],
  ['/family', Family],
  ['/settings', Settings]
];

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
        {privateRoutes.map(([path, Page]) => (
          <Route
            key={path}
            path={path}
            element={(
              <ProtectedRoute>
                <AppLayout><Page /></AppLayout>
              </ProtectedRoute>
            )}
          />
        ))}
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
