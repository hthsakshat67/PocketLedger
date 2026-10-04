import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [step, setStep] = useState('details');
  const [form, setForm] = useState({ name: '', email: '', password: '', code: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: {
          name: form.name,
          email: form.email,
          password: form.password
        }
      });
      setMessage(data.message);
      setStep('verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRequest('/api/auth/verify', {
        method: 'POST',
        body: {
          email: form.email,
          code: form.code
        }
      });
      setUser(data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface border border-border rounded-lg shadow-subtle p-8 sm:p-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 font-semibold text-xl text-text-main cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            PocketLedger
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-text-main text-center mb-6">
          {step === 'details' ? 'Create an account' : 'Verify your email'}
        </h1>

        {message && (
          <div className="mb-4 rounded-sm border border-status-success/30 bg-status-success/5 px-3 py-2 text-sm text-status-success">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-sm border border-status-danger/30 bg-status-danger/5 px-3 py-2 text-sm text-status-danger">
            {error}
          </div>
        )}

        {step === 'details' ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              autoComplete="name"
              required
            />
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
              placeholder="At least 12 characters"
              autoComplete="new-password"
              minLength={12}
              required
            />
            <p className="text-xs text-text-muted">
              Use at least 12 characters with uppercase, lowercase, and a number.
            </p>
            
            <div className="flex items-start gap-2 mt-4">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 w-4 h-4 rounded-sm border-border text-primary focus:ring-primary focus:ring-offset-0" 
                required
              />
              <label htmlFor="terms" className="text-sm text-text-muted">
                I agree to the Terms of Service and Privacy Policy.
              </label>
            </div>
            
            <div className="pt-4">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Sending code...' : 'Create account'}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-text-muted text-center">
              Enter the 6-digit code sent to {form.email}.
            </p>
            <Input
              label="Verification code"
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="123456"
              autoComplete="one-time-code"
              required
            />
            <div className="pt-4">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify and continue'}
              </Button>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep('details');
                setMessage('');
                setError('');
              }}
              className="w-full text-sm text-text-muted hover:text-text-main transition-colors"
            >
              Use a different email
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="font-medium text-text-main hover:text-primary transition-colors">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
