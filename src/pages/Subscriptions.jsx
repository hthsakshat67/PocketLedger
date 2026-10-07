import React, { useState } from 'react';
import { Cloud, Music, Plus, Tv } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useLedger, formatDate } from '../context/LedgerContext';

const blankSubscription = {
  name: '',
  category: 'Entertainment',
  cost: '',
  frequency: 'month',
  nextBilling: '2026-10-30'
};

function subscriptionIcon(category) {
  if (category === 'Software') return Cloud;
  if (category === 'Entertainment') return Music;
  return Tv;
}

export default function Subscriptions() {
  const { subscriptions, monthlySubscriptions, annualSubscriptions, addSubscription, formatMoney } = useLedger();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(blankSubscription);
  const [error, setError] = useState('');

  const submitSubscription = (event) => {
    event.preventDefault();
    try {
      addSubscription(form);
      setForm(blankSubscription);
      setError('');
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-main mb-1">Subscriptions</h1>
          <p className="text-text-muted text-sm">See how much your recurring services cost.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add subscription
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-sm text-text-muted mb-2">Monthly subscriptions</p>
          <p className="text-3xl font-semibold text-text-main">{formatMoney(monthlySubscriptions)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-text-muted mb-2">Annual estimate</p>
          <p className="text-3xl font-semibold text-text-main">{formatMoney(annualSubscriptions)}</p>
        </Card>
      </div>

      <h3 className="font-medium text-text-main mb-4">Active subscriptions</h3>

      <div className="space-y-3">
        {subscriptions.map((sub) => {
          const Icon = subscriptionIcon(sub.category);
          return (
            <Card key={sub.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-sm bg-muted-background flex items-center justify-center text-text-muted">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-text-main">{sub.name}</h3>
                  <p className="text-xs text-text-muted mt-1">{sub.category}</p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end text-left sm:text-right gap-1">
                <p className="font-medium text-text-main">{formatMoney(sub.cost)} <span className="text-text-muted text-xs font-normal">/ {sub.frequency}</span></p>
                <p className="text-xs text-text-muted">Next billing {formatDate(sub.nextBilling)}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Subscription">
        <form className="space-y-4" onSubmit={submitSubscription}>
          {error && <p className="text-sm text-status-danger bg-status-danger/10 px-3 py-2 rounded-sm">{error}</p>}
          <Input label="Subscription name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Video service" required />
          <Input label="Cost ($)" value={form.cost} onChange={(event) => setForm({ ...form, cost: event.target.value })} type="number" min="0.01" step="0.01" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {['Entertainment', 'Software', 'Shopping', 'Health', 'Education', 'Other'].map((item) => <option key={item}>{item}</option>)}
            </Select>
            <Select label="Frequency" value={form.frequency} onChange={(event) => setForm({ ...form, frequency: event.target.value })}>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </Select>
          </div>
          <Input label="Next billing date" type="date" value={form.nextBilling} onChange={(event) => setForm({ ...form, nextBilling: event.target.value })} required />
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add subscription</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
