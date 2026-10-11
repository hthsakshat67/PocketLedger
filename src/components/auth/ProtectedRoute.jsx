import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLedger } from '../../context/LedgerContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { profile, ledgerReady } = useLedger();
  const location = useLocation();

  if (loading || (user && !ledgerReady)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm text-text-muted">
        Checking your session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!profile.onboardingComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (profile.onboardingComplete && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
