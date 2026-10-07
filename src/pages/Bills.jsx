import React, { useState } from 'react';
import { CheckCircle2, Droplets, Home, MoreHorizontal, Plus, Wifi, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useLedger, formatDate } from '../context/LedgerContext';

const statusConfig = {
  due_soon: { label: 'Due soon', variant: 'warning' },
  upcoming: { label: 'Upcoming', variant: 'default' },
  overdue: { label: 'Overdue', variant: 'danger' },
  paid: { label: 'Paid', variant: 'success' }
};

const iconByCategory = {
  Utilities: Zap,
  Housing: Home,
  Internet: Wifi,
  Water: Droplets
};

const blankBill = {
  name: '',
  category: 'Utilities',
  dueDate: '2026-10-14',
  amount: ''
};

export default function Bills() {
  const { bills, addBill, markBillPaid, formatMoney } = useLedger();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(blankBill);
  const [error, setError] = useState('');
  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'due_soon', label: 'Due soon' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'paid', label: 'Paid' }
  ];
  const visibleBills = bills.filter((bill) => bill.status === activeTab);

  const submitBill = (event) => {
    event.preventDefault();
    try {
      addBill(form);
      setForm(blankBill);
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
          <h1 className="text-2xl font-semibold text-text-main mb-1">Bills</h1>
          <p className="text-text-muted text-sm">Keep track of what needs to be paid and when.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add bill
        </Button>
      </header>

      <div className="flex space-x-1 border-b border-border mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-primary' : 'text-text-muted hover:text-text-main hover:bg-muted-background/50'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visibleBills.map((bill) => {
          const StatusIcon = iconByCategory[bill.name] || iconByCategory[bill.category] || MoreHorizontal;
          return (
            <Card key={bill.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:-translate-y-[1px] transition-transform duration-150 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm bg-muted-background flex items-center justify-center text-text-muted group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  <StatusIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-text-main">{bill.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-text-muted">{bill.category}</span>
                    <span className="text-xs text-border">•</span>
                    <span className="text-xs text-text-muted">Due {formatDate(bill.dueDate)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-1/2">
                <p className="font-medium text-text-main">{formatMoney(bill.amount)}</p>
                <div className="w-24 flex justify-end">
                  <Badge variant={statusConfig[bill.status].variant}>{statusConfig[bill.status].label}</Badge>
                </div>
                {bill.status !== 'paid' ? (
                  <Button variant="secondary" size="sm" onClick={() => markBillPaid(bill.id)}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Paid
                  </Button>
                ) : (
                  <span className="text-xs text-status-success w-20 text-right">Settled</span>
                )}
              </div>
            </Card>
          );
        })}
        {visibleBills.length === 0 && (
          <Card className="p-8 text-center text-text-muted border-dashed bg-muted-background/30">
            No bills in this status.
          </Card>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Bill">
        <form className="space-y-4" onSubmit={submitBill}>
          {error && <p className="text-sm text-status-danger bg-status-danger/10 px-3 py-2 rounded-sm">{error}</p>}
          <Input label="Bill name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Internet" required />
          <Input label="Amount ($)" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} type="number" min="0.01" step="0.01" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {['Utilities', 'Housing', 'Insurance', 'Loans', 'Education', 'Other'].map((item) => <option key={item}>{item}</option>)}
            </Select>
            <Input label="Due date" type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} required />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add bill</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
