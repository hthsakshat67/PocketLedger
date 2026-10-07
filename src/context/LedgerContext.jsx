import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const LedgerContext = createContext(null);

const today = '2026-10-07';

const initialState = {
  settings: {
    currency: 'USD',
    timezone: 'America/New_York',
    monthStart: '1',
    notifications: {
      billReminders: true,
      budgetAlerts: true,
      subscriptionRenewals: true,
      browser: false
    }
  },
  expenses: [
    { id: 'exp-1', date: '2026-10-05', name: 'Grocery Store', category: 'Food', method: 'Card', amount: 48.25, notes: '' },
    { id: 'exp-2', date: '2026-10-03', name: 'Shell Station', category: 'Transportation', method: 'Card', amount: 36.8, notes: '' },
    { id: 'exp-3', date: '2026-10-02', name: 'Coffee Shop', category: 'Food', method: 'Cash', amount: 6.75, notes: '' },
    { id: 'exp-4', date: '2026-09-29', name: 'Amazon', category: 'Shopping', method: 'Card', amount: 29.99, notes: '' },
    { id: 'exp-5', date: '2026-09-22', name: 'Plumber', category: 'Housing', method: 'Bank Transfer', amount: 120, notes: '' }
  ],
  bills: [
    { id: 'bill-1', name: 'Internet', category: 'Utilities', dueDate: '2026-10-09', amount: 69.99, status: 'due_soon' },
    { id: 'bill-2', name: 'Electricity', category: 'Utilities', dueDate: '2026-10-13', amount: 142.3, status: 'upcoming' },
    { id: 'bill-3', name: 'Water', category: 'Utilities', dueDate: '2026-10-20', amount: 44.5, status: 'upcoming' },
    { id: 'bill-4', name: 'Rent', category: 'Housing', dueDate: '2026-11-01', amount: 1800, status: 'upcoming' },
    { id: 'bill-5', name: 'Gas', category: 'Utilities', dueDate: '2026-09-15', amount: 58.4, status: 'paid' }
  ],
  subscriptions: [
    { id: 'sub-1', name: 'Netflix', category: 'Entertainment', cost: 15.49, frequency: 'month', nextBilling: '2026-10-30' },
    { id: 'sub-2', name: 'Spotify', category: 'Entertainment', cost: 10.99, frequency: 'month', nextBilling: '2026-11-03' },
    { id: 'sub-3', name: 'Adobe Creative Cloud', category: 'Software', cost: 59.99, frequency: 'month', nextBilling: '2026-10-08' },
    { id: 'sub-4', name: 'Amazon Prime', category: 'Shopping', cost: 139, frequency: 'year', nextBilling: '2027-01-15' }
  ],
  budgets: [
    { id: 'budget-1', category: 'Food', limit: 450, color: 'bg-primary' },
    { id: 'budget-2', category: 'Transportation', limit: 220, color: 'bg-status-warning' },
    { id: 'budget-3', category: 'Shopping', limit: 175, color: 'bg-status-danger' },
    { id: 'budget-4', category: 'Entertainment', limit: 160, color: 'bg-status-success' }
  ],
  members: [
    { id: 'member-1', name: 'Akshat', email: 'akshat@example.com', role: 'Owner', initials: 'AK', isCurrentUser: true }
  ],
  notifications: []
};

function storageKey(user) {
  return `pocketledger:${user?.id || 'guest'}:ledger`;
}

function uid(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function cleanText(value, max = 120) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, max);
}

function readAmount(value, label = 'Amount') {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error(`${label} must be greater than $0.`);
  if (amount > 10000000) throw new Error(`${label} is too large.`);
  return Math.round(amount * 100) / 100;
}

function readDate(value, label = 'Date') {
  const date = String(value || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(`${date}T00:00:00`).getTime())) {
    throw new Error(`${label} is required.`);
  }
  return date;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function daysUntil(value) {
  const start = new Date(`${today}T00:00:00`);
  const end = new Date(`${value}T00:00:00`);
  return Math.ceil((end - start) / 86400000);
}

function normalizeBillStatus(bill) {
  if (bill.status === 'paid') return 'paid';
  const days = daysUntil(bill.dueDate);
  if (days < 0) return 'overdue';
  if (days <= 3) return 'due_soon';
  return 'upcoming';
}

function monthKey(date) {
  return String(date).slice(0, 7);
}

export function LedgerProvider({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState(initialState);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey(user));
      setState(stored ? { ...initialState, ...JSON.parse(stored) } : initialState);
    } catch {
      setState(initialState);
    }
  }, [user?.id]);

  useEffect(() => {
    localStorage.setItem(storageKey(user), JSON.stringify(state));
  }, [state, user?.id]);

  const formatMoney = useCallback((value) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: state.settings.currency || 'USD'
  }).format(Number(value || 0)), [state.settings.currency]);

  const pushNotification = useCallback((title, body, type = 'info') => {
    const notification = { id: uid('note'), title, body, type, read: false, createdAt: new Date().toISOString() };
    setState((current) => ({ ...current, notifications: [notification, ...current.notifications].slice(0, 50) }));
    setToast(notification);
    if (state.settings.notifications.browser && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }, [state.settings.notifications.browser]);

  const addExpense = useCallback((payload) => {
    const expense = {
      id: uid('exp'),
      name: cleanText(payload.name),
      amount: readAmount(payload.amount),
      category: cleanText(payload.category) || 'Other',
      method: cleanText(payload.method) || 'Card',
      date: readDate(payload.date),
      notes: cleanText(payload.notes, 280)
    };
    if (!expense.name) throw new Error('Expense name is required.');
    setState((current) => ({ ...current, expenses: [expense, ...current.expenses] }));
    pushNotification('Expense added', `${expense.name} was logged for ${formatMoney(expense.amount)}.`, 'success');
  }, [formatMoney, pushNotification]);

  const addBill = useCallback((payload) => {
    const bill = {
      id: uid('bill'),
      name: cleanText(payload.name),
      category: cleanText(payload.category) || 'Utilities',
      dueDate: readDate(payload.dueDate, 'Due date'),
      amount: readAmount(payload.amount),
      status: 'upcoming'
    };
    if (!bill.name) throw new Error('Bill name is required.');
    bill.status = normalizeBillStatus(bill);
    setState((current) => ({ ...current, bills: [bill, ...current.bills] }));
    pushNotification('Bill reminder created', `${bill.name} is due ${formatDate(bill.dueDate)}.`, 'success');
  }, [pushNotification]);

  const markBillPaid = useCallback((id) => {
    setState((current) => ({
      ...current,
      bills: current.bills.map((bill) => bill.id === id ? { ...bill, status: 'paid' } : bill)
    }));
    pushNotification('Bill marked paid', 'Nice, that bill is now out of the upcoming list.', 'success');
  }, [pushNotification]);

  const addSubscription = useCallback((payload) => {
    const subscription = {
      id: uid('sub'),
      name: cleanText(payload.name),
      category: cleanText(payload.category) || 'Software',
      cost: readAmount(payload.cost, 'Cost'),
      frequency: payload.frequency === 'year' ? 'year' : 'month',
      nextBilling: readDate(payload.nextBilling, 'Next billing date')
    };
    if (!subscription.name) throw new Error('Subscription name is required.');
    setState((current) => ({ ...current, subscriptions: [subscription, ...current.subscriptions] }));
    pushNotification('Subscription added', `${subscription.name} will renew on ${formatDate(subscription.nextBilling)}.`, 'success');
  }, [pushNotification]);

  const addBudget = useCallback((payload) => {
    const budget = {
      id: uid('budget'),
      category: cleanText(payload.category),
      limit: readAmount(payload.limit, 'Budget limit'),
      color: payload.color || 'bg-primary'
    };
    if (!budget.category) throw new Error('Budget category is required.');
    setState((current) => ({ ...current, budgets: [budget, ...current.budgets.filter((item) => item.category !== budget.category)] }));
    pushNotification('Budget saved', `${budget.category} is now budgeted at ${formatMoney(budget.limit)}.`, 'success');
  }, [formatMoney, pushNotification]);

  const inviteMember = useCallback((payload) => {
    const name = cleanText(payload.name);
    const email = cleanText(payload.email).toLowerCase();
    if (!name) throw new Error('Member name is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
    setState((current) => ({
      ...current,
      members: [...current.members, {
        id: uid('member'),
        name,
        email,
        role: 'Invited',
        initials: name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
        isCurrentUser: false
      }]
    }));
    pushNotification('Invitation prepared', `${name} has been added as an invited household member.`, 'success');
  }, [pushNotification]);

  const updateSettings = useCallback((updates) => {
    setState((current) => ({ ...current, settings: { ...current.settings, ...updates } }));
    pushNotification('Settings saved', 'Your preferences were updated.', 'success');
  }, [pushNotification]);

  const updateNotificationSettings = useCallback(async (updates) => {
    let browser = updates.browser;
    if (browser && 'Notification' in window && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      browser = permission === 'granted';
    }
    setState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        notifications: { ...current.settings.notifications, ...updates, browser }
      }
    }));
    pushNotification('Notification settings saved', browser ? 'Browser notifications are enabled.' : 'In-app notifications are active.', 'success');
  }, [pushNotification]);

  const markNotificationRead = useCallback((id) => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((item) => item.id === id ? { ...item, read: true } : item)
    }));
  }, []);

  const derived = useMemo(() => {
    const activeBills = state.bills.map((bill) => ({ ...bill, status: normalizeBillStatus(bill) }));
    const currentMonth = '2026-10';
    const monthlyExpenses = state.expenses.filter((expense) => monthKey(expense.date) === currentMonth);
    const monthlySpending = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
    const monthlySubscriptions = state.subscriptions.reduce((sum, item) => sum + (item.frequency === 'year' ? item.cost / 12 : item.cost), 0);
    const upcomingBills = activeBills.filter((bill) => bill.status !== 'paid').sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    const categoryTotals = monthlyExpenses.reduce((totals, item) => {
      totals[item.category] = (totals[item.category] || 0) + item.amount;
      return totals;
    }, {});
    const budgetRows = state.budgets.map((budget) => ({
      ...budget,
      spent: categoryTotals[budget.category] || 0
    }));
    return {
      bills: activeBills,
      monthlyExpenses,
      monthlySpending,
      monthlyIncome: 5200,
      monthlySubscriptions,
      annualSubscriptions: monthlySubscriptions * 12,
      upcomingBills,
      categoryTotals,
      budgetRows,
      unreadNotifications: state.notifications.filter((item) => !item.read).length
    };
  }, [state]);

  const value = useMemo(() => ({
    ...state,
    ...derived,
    toast,
    setToast,
    formatMoney,
    addExpense,
    addBill,
    markBillPaid,
    addSubscription,
    addBudget,
    inviteMember,
    updateSettings,
    updateNotificationSettings,
    markNotificationRead
  }), [state, derived, toast, formatMoney, addExpense, addBill, markBillPaid, addSubscription, addBudget, inviteMember, updateSettings, updateNotificationSettings, markNotificationRead]);

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

export function useLedger() {
  const context = useContext(LedgerContext);
  if (!context) throw new Error('useLedger must be used inside LedgerProvider.');
  return context;
}

export { formatDate, daysUntil };
