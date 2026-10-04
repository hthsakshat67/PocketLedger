import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  Check,
  CreditCard,
  LockKeyhole,
  PieChart,
  ShieldCheck,
  Users
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const features = [
  {
    icon: CreditCard,
    title: 'Expense tracking',
    body: 'Log everyday spending, organize it by category, and see what changed from last month.'
  },
  {
    icon: CalendarCheck,
    title: 'Bill planning',
    body: 'Keep upcoming payments, due dates, and recurring costs in one calm monthly view.'
  },
  {
    icon: Users,
    title: 'Household budgets',
    body: 'Coordinate shared spending with family members without mixing up personal and shared money.'
  },
  {
    icon: ShieldCheck,
    title: 'Verified accounts',
    body: 'New users verify their email before entering the app, and sessions stay protected by secure cookies.'
  }
];

const steps = [
  'Create a verified account',
  'Add bills and recurring subscriptions',
  'Track expenses as they happen',
  'Review trends before the month gets away'
];

export default function Landing() {
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: previewRef,
    offset: ['start end', 'end start']
  });
  const previewY = useTransform(scrollYProgress, [0, 1], [48, -36]);
  const previewScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.96, 1, 0.98]);
  const barOne = useTransform(scrollYProgress, [0, 1], ['42%', '78%']);
  const barTwo = useTransform(scrollYProgress, [0, 1], ['66%', '48%']);
  const barThree = useTransform(scrollYProgress, [0, 1], ['34%', '70%']);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-semibold text-lg text-text-main"
          >
            <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            PocketLedger
          </button>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-text-muted">
            <a href="#features" className="hover:text-text-main transition-colors">Features</a>
            <a href="#security" className="hover:text-text-main transition-colors">Security</a>
            <a href="#workflow" className="hover:text-text-main transition-colors">Workflow</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">
              Sign in
            </button>
            <Button onClick={() => navigate('/register')} size="sm">
              Start free
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="flex flex-col justify-center"
            >
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-sm border border-border bg-surface px-3 py-1 text-sm text-text-muted">
                <LockKeyhole className="h-4 w-4 text-primary" />
                Email-verified household finance
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-text-main md:text-6xl">
                PocketLedger
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-text-muted">
                Track expenses, bills, subscriptions, budgets, and shared household money from one secure account that follows you between sessions.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => navigate('/register')} size="lg" className="w-full gap-2 sm:w-auto">
                  Create your account
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} variant="secondary" size="lg" className="w-full sm:w-auto">
                  Explore features
                </Button>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-border pt-6">
                <div>
                  <p className="text-2xl font-semibold text-text-main">$3.2k</p>
                  <p className="mt-1 text-xs text-text-muted">monthly spend view</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-text-main">14</p>
                  <p className="mt-1 text-xs text-text-muted">upcoming bills</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-text-main">6</p>
                  <p className="mt-1 text-xs text-text-muted">shared budgets</p>
                </div>
              </div>
            </motion.div>

            <div ref={previewRef} className="relative min-h-[520px] lg:min-h-[620px]">
              <motion.div style={{ y: previewY, scale: previewScale }} className="sticky top-28">
                <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-subtle">
                  <div className="flex items-center justify-between border-b border-border bg-muted-background/60 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-status-danger/70" />
                      <div className="h-3 w-3 rounded-full bg-status-warning/80" />
                      <div className="h-3 w-3 rounded-full bg-status-success/80" />
                    </div>
                    <span className="text-xs font-medium text-text-muted">Household overview</span>
                  </div>
                  <div className="grid gap-4 p-5 md:grid-cols-[0.85fr_1.15fr]">
                    <div className="space-y-4">
                      <div className="rounded-sm border border-border bg-background p-4">
                        <p className="text-xs font-medium uppercase text-text-muted">September cash flow</p>
                        <p className="mt-3 text-3xl font-semibold text-text-main">$1,248</p>
                        <p className="mt-1 text-sm text-status-success">Left after planned bills</p>
                      </div>
                      {[
                        ['Mortgage', '$1,850', 'Paid'],
                        ['Utilities', '$214', 'Due Friday'],
                        ['Streaming', '$38', 'Renews Oct 9']
                      ].map(([name, amount, status]) => (
                        <div key={name} className="flex items-center justify-between rounded-sm border border-border bg-surface p-3">
                          <div>
                            <p className="text-sm font-medium text-text-main">{name}</p>
                            <p className="text-xs text-text-muted">{status}</p>
                          </div>
                          <p className="text-sm font-semibold text-text-main">{amount}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-sm border border-border bg-background p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-text-main">Spending pulse</p>
                          <p className="text-xs text-text-muted">Scroll to watch categories update</p>
                        </div>
                        <PieChart className="h-5 w-5 text-primary" />
                      </div>
                      <div className="mt-7 space-y-5">
                        {[
                          ['Groceries', barOne, '$642'],
                          ['Transport', barTwo, '$318'],
                          ['Home', barThree, '$489']
                        ].map(([label, width, amount]) => (
                          <div key={label}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span className="font-medium text-text-main">{label}</span>
                              <span className="text-text-muted">{amount}</span>
                            </div>
                            <div className="h-3 overflow-hidden rounded-sm bg-muted-background">
                              <motion.div style={{ width }} className="h-full rounded-sm bg-primary" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 grid grid-cols-2 gap-3">
                        <div className="rounded-sm bg-surface p-3">
                          <BarChart3 className="mb-3 h-5 w-5 text-primary" />
                          <p className="text-xs text-text-muted">Monthly trend</p>
                          <p className="text-lg font-semibold text-text-main">-8.4%</p>
                        </div>
                        <div className="rounded-sm bg-surface p-3">
                          <CalendarCheck className="mb-3 h-5 w-5 text-primary" />
                          <p className="text-xs text-text-muted">Next bill</p>
                          <p className="text-lg font-semibold text-text-main">Oct 6</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-primary">Everything connected</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-main md:text-4xl">
              Built for the way household money actually moves.
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.07, duration: 0.4 }}
                className="rounded-lg border border-border bg-surface p-5 shadow-subtle"
              >
                <feature.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-5 text-lg font-semibold text-text-main">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-muted">{feature.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="security" className="border-y border-border bg-surface">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase text-primary">Secure by default</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-main">
                Accounts are private, verified, and persistent.
              </h2>
              <p className="mt-5 text-text-muted leading-7">
                PocketLedger now requires a verified email before creating a session. Passwords are hashed, sessions use HTTP-only cookies, and protected pages redirect signed-out visitors.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                'Email OTP required at signup',
                'Minimum 12-character passwords',
                'Password hashes use per-user salts',
                'HTTP-only session cookies',
                'Rate limits on failed sign-ins',
                'No demo accounts or shared credentials'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-sm border border-border bg-background p-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-text-main">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase text-primary">Simple flow</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-main">
                Start with your account, then build your money picture.
              </h2>
            </div>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: index * 0.08, duration: 0.35 }}
                  className="flex items-center gap-4 border-b border-border pb-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-lg font-medium text-text-main">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 PocketLedger. All rights reserved.</p>
          <button onClick={() => navigate('/register')} className="w-fit font-medium text-text-main hover:text-primary transition-colors">
            Create an account
          </button>
        </div>
      </footer>
    </div>
  );
}
