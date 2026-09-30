import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/dashboard');
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

        <h1 className="text-2xl font-semibold text-text-main text-center mb-6">Create an account</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input label="Full name" type="text" placeholder="Akshat" required />
          <Input label="Email address" type="email" placeholder="you@example.com" required />
          <Input label="Password" type="password" placeholder="••••••••" required />
          
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
            <Button className="w-full" type="submit">Create account</Button>
          </div>
        </form>
        
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
