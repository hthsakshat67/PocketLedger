import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeDollarSign, Home, Sparkles, Target, WalletCards } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useLedger } from '../context/LedgerContext';

const steps = [
  { id: 'money', label: 'Money', icon: WalletCards },
  { id: 'income', label: 'Income', icon: BadgeDollarSign },
  { id: 'preferences', label: 'Preferences', icon: Target }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, updateProfile, formatMoney } = useLedger();
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    accountBalance: profile.accountBalance || '',
    monthlyIncome: profile.monthlyIncome || '',
    householdType: profile.householdType || 'Solo',
    mainGoal: profile.mainGoal || 'Build savings',
    spendingStyle: profile.spendingStyle || 'Balanced'
  });

  const preview = useMemo(() => {
    const balance = Number(form.accountBalance || 0);
    const income = Number(form.monthlyIncome || 0);
    const projected = balance + income;
    return { balance, income, projected };
  }, [form.accountBalance, form.monthlyIncome]);

  const currentStep = steps[stepIndex];
  const CurrentIcon = currentStep.icon;

  const next = () => {
    setError('');
    if (stepIndex === 0 && Number(form.accountBalance || 0) < 0) {
      setError('Account balance must be $0 or more.');
      return;
    }
    if (stepIndex === 1 && Number(form.monthlyIncome || 0) <= 0) {
      setError('Monthly income after taxes is required.');
      return;
    }
    if (stepIndex < steps.length - 1) {
      setStepIndex((index) => index + 1);
      return;
    }
    try {
      updateProfile(form, { complete: true });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_16%,rgba(36,92,74,0.16),transparent_28%),radial-gradient(circle_at_86%_14%,rgba(185,128,61,0.16),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.75),rgba(241,241,238,0.8))]" />
      <main className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <section className="rounded-lg border border-border bg-surface/90 p-6 shadow-subtle backdrop-blur sm:p-8">
          <div className="mb-8 flex items-center gap-2 font-semibold text-xl text-text-main">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            PocketLedger
          </div>

          <div className="mb-7 flex items-center gap-2">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const active = index === stepIndex;
              const done = index < stepIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setStepIndex(index)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-sm border px-2 py-2 text-xs font-medium transition-all ${
                    active || done ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border text-text-muted'
                  }`}
                >
                  <StepIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mb-6">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <CurrentIcon className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-text-main">
              {stepIndex === 0 && 'Start with your current balance.'}
              {stepIndex === 1 && 'Add monthly income after taxes.'}
              {stepIndex === 2 && 'Tune PocketLedger to you.'}
            </h1>
            <p className="mt-3 text-sm leading-6 text-text-muted">
              {stepIndex === 0 && 'This becomes your cash-flow starting point and can be edited later.'}
              {stepIndex === 1 && 'Use take-home pay so projections stay realistic.'}
              {stepIndex === 2 && 'These preferences shape the dashboard language, priorities, and alerts.'}
            </p>
          </div>

          {error && <p className="mb-4 rounded-sm border border-status-danger/30 bg-status-danger/5 px-3 py-2 text-sm text-status-danger">{error}</p>}

          <div className="space-y-4">
            {stepIndex === 0 && (
              <Input
                label="Current account balance ($)"
                type="number"
                min="0"
                step="0.01"
                value={form.accountBalance}
                onChange={(event) => setForm({ ...form, accountBalance: event.target.value })}
                placeholder="1250.00"
                autoFocus
              />
            )}

            {stepIndex === 1 && (
              <Input
                label="Monthly income after taxes ($)"
                type="number"
                min="0.01"
                step="0.01"
                value={form.monthlyIncome}
                onChange={(event) => setForm({ ...form, monthlyIncome: event.target.value })}
                placeholder="4200.00"
                autoFocus
              />
            )}

            {stepIndex === 2 && (
              <>
                <Select label="Household setup" value={form.householdType} onChange={(event) => setForm({ ...form, householdType: event.target.value })}>
                  <option>Solo</option>
                  <option>Couple</option>
                  <option>Family</option>
                  <option>Roommates</option>
                </Select>
                <Select label="Primary goal" value={form.mainGoal} onChange={(event) => setForm({ ...form, mainGoal: event.target.value })}>
                  <option>Build savings</option>
                  <option>Pay bills on time</option>
                  <option>Lower spending</option>
                  <option>Track shared household costs</option>
                  <option>Prepare for a big purchase</option>
                </Select>
                <Select label="Spending style" value={form.spendingStyle} onChange={(event) => setForm({ ...form, spendingStyle: event.target.value })}>
                  <option>Careful</option>
                  <option>Balanced</option>
                  <option>Flexible</option>
                  <option>Aggressive saving</option>
                </Select>
              </>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
            <Button type="button" variant="secondary" disabled={stepIndex === 0} onClick={() => setStepIndex((index) => index - 1)}>
              Back
            </Button>
            <Button type="button" onClick={next}>
              {stepIndex === steps.length - 1 ? 'Finish setup' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="relative min-h-[560px] [perspective:1400px]">
          <div className="absolute inset-x-4 top-8 h-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="pocket-orbit absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />
          <div className="pocket-orbit pocket-orbit-slow absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-status-warning/20" />

          <div className="pocket-tilt relative mx-auto mt-8 max-w-xl rounded-lg border border-border bg-surface/90 p-5 shadow-subtle backdrop-blur">
            <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-xs font-semibold uppercase text-primary">Personal cash engine</p>
                <h2 className="mt-1 text-2xl font-semibold text-text-main">Your first-month projection</h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-white">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-sm border border-border bg-background p-4">
                <p className="text-xs text-text-muted">Balance</p>
                <p className="mt-2 text-xl font-semibold text-text-main">{formatMoney(preview.balance)}</p>
              </div>
              <div className="rounded-sm border border-border bg-background p-4">
                <p className="text-xs text-text-muted">After-tax income</p>
                <p className="mt-2 text-xl font-semibold text-text-main">{formatMoney(preview.income)}</p>
              </div>
              <div className="rounded-sm border border-border bg-background p-4">
                <p className="text-xs text-text-muted">Starting power</p>
                <p className="mt-2 text-xl font-semibold text-primary">{formatMoney(preview.projected)}</p>
              </div>
            </div>

            <div className="mt-6 rounded-sm border border-border bg-background p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-text-main">{form.householdType}</span>
                </div>
                <span className="rounded-sm bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{form.spendingStyle}</span>
              </div>
              <div className="space-y-3">
                {[
                  ['Income ready', Math.min(100, preview.income ? 86 : 18)],
                  ['Goal clarity', stepIndex === 2 ? 92 : 46],
                  ['Setup complete', ((stepIndex + 1) / steps.length) * 100]
                ].map(([label, width]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-xs text-text-muted">
                      <span>{label}</span>
                      <span>{Math.round(width)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-sm bg-muted-background">
                      <div className="h-full rounded-sm bg-primary transition-all duration-500" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
