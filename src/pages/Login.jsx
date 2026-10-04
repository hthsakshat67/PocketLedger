import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: form
      });
      setUser(data.user);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <div className="hidden md:flex flex-col justify-center p-12 lg:p-24 w-1/2 bg-surface border-r border-border">
        <div className="flex items-center gap-2 font-semibold text-xl text-text-main mb-8">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          PocketLedger
        </div>
        <h1 className="text-3xl lg:text-4xl font-semibold text-text-main mb-4 tracking-tight">
          Welcome back
        </h1>
        <p className="text-text-muted text-lg max-w-md">
          Sign in to continue managing your household finances.
        </p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md mx-auto">
          <div className="md:hidden flex items-center gap-2 font-semibold text-xl text-text-main mb-12 justify-center">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            PocketLedger
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-sm border border-status-danger/30 bg-status-danger/5 px-3 py-2 text-sm text-status-danger">
                {error}
              </div>
            )}
            <Input
              label="Email address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            
            <div className="pt-2">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 flex flex-col items-center gap-4 text-sm">
            <button className="text-text-muted hover:text-text-main transition-colors">
              Forgot password?
            </button>
            <div className="text-text-muted">
              Don't have an account?{' '}
              <button onClick={() => navigate('/register')} className="font-medium text-text-main hover:text-primary transition-colors">
                Create one
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
