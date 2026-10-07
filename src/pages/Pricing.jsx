import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
        <div className="flex items-center gap-2 font-semibold text-lg text-text-main cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          PocketLedger
        </div>
        <Button onClick={() => navigate('/login')} variant="secondary" size="sm">Sign in</Button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-text-main mb-4 tracking-tight">
            Simple plans for different households.
          </h1>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 flex flex-col">
            <h3 className="text-xl font-medium text-text-main mb-2">Free</h3>
            <p className="text-3xl font-semibold text-text-main mb-1">$0<span className="text-lg text-text-muted font-normal">/month</span></p>
            <p className="text-sm text-text-muted mb-6">For individuals starting out.</p>
            
            <ul className="space-y-3 mb-8 flex-1">
              {['Track up to 50 expenses/mo', 'Basic budgeting', 'Bill reminders', 'Email support'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-text-muted">
                  <Check className="w-4 h-4 text-text-main" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button variant="secondary" className="w-full" onClick={() => navigate('/register')}>Get started</Button>
          </Card>

          {/* Premium Plan */}
          <Card className="p-8 flex flex-col border-primary/20 shadow-md relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
              Recommended
            </div>
            <h3 className="text-xl font-medium text-text-main mb-2">Premium</h3>
            <p className="text-3xl font-semibold text-text-main mb-1">$9<span className="text-lg text-text-muted font-normal">/month</span></p>
            <p className="text-sm text-text-muted mb-6">For active household management.</p>
            
            <ul className="space-y-3 mb-8 flex-1">
              {['Unlimited expenses', 'Advanced analytics', 'Custom report export', 'Priority support', 'Unlimited budgets'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-text-muted">
                  <Check className="w-4 h-4 text-text-main" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button className="w-full" onClick={() => navigate('/register')}>Start 14-day trial</Button>
          </Card>

          {/* Family Plan */}
          <Card className="p-8 flex flex-col">
            <h3 className="text-xl font-medium text-text-main mb-2">Family</h3>
            <p className="text-3xl font-semibold text-text-main mb-1">$19<span className="text-lg text-text-muted font-normal">/month</span></p>
            <p className="text-sm text-text-muted mb-6">For shared household tracking.</p>
            
            <ul className="space-y-3 mb-8 flex-1">
              {['Everything in Premium', 'Up to 5 family members', 'Shared & private expenses', 'Member role management'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-text-muted">
                  <Check className="w-4 h-4 text-text-main" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button variant="secondary" className="w-full" onClick={() => navigate('/register')}>Start 14-day trial</Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
