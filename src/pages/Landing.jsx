import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
        <div className="flex items-center gap-2 font-semibold text-lg text-text-main">
          <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          PocketLedger
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">
            Sign in
          </button>
          <Button onClick={() => navigate('/register')} size="sm">Start for free</Button>
        </div>
      </header>

      <main>
        <section className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-text-main mb-6 tracking-tight">
            Know where your money goes.
          </h1>
          <p className="text-lg text-text-muted mb-10 max-w-2xl mx-auto">
            Track bills, expenses, and subscriptions in one simple place. Designed for households that want clarity without the complexity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => navigate('/register')} size="lg" className="w-full sm:w-auto">Start for free</Button>
            <Button onClick={() => navigate('/dashboard')} variant="secondary" size="lg" className="w-full sm:w-auto">View demo</Button>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="rounded-lg border border-border bg-surface shadow-subtle overflow-hidden">
            <div className="border-b border-border bg-muted-background/50 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E5E5E5]"></div>
              <div className="w-3 h-3 rounded-full bg-[#E5E5E5]"></div>
              <div className="w-3 h-3 rounded-full bg-[#E5E5E5]"></div>
            </div>
            <div className="aspect-video bg-muted-background/20 relative">
              <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm">
                Dashboard Interface Preview
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-24 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <h3 className="font-semibold text-text-main mb-3 text-lg">Clear Analytics</h3>
              <p className="text-text-muted text-sm leading-relaxed">Understand your spending patterns without navigating complex financial jargon.</p>
            </div>
            <div>
              <h3 className="font-semibold text-text-main mb-3 text-lg">Bill Reminders</h3>
              <p className="text-text-muted text-sm leading-relaxed">Never miss a due date. See exactly what needs to be paid this month.</p>
            </div>
            <div>
              <h3 className="font-semibold text-text-main mb-3 text-lg">Family Sharing</h3>
              <p className="text-text-muted text-sm leading-relaxed">Manage shared household expenses while keeping private spending private.</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border bg-surface py-8 text-center text-sm text-text-muted">
        <p>&copy; 2026 PocketLedger. All rights reserved.</p>
      </footer>
    </div>
  );
}
