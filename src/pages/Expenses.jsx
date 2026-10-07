import React, { useMemo, useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';
import { useLedger, formatDate } from '../context/LedgerContext';

const blankExpense = {
  name: '',
  amount: '',
  category: 'Food',
  method: 'Card',
  date: '2026-10-07',
  notes: ''
};

export default function Expenses() {
  const { expenses, addExpense, formatMoney } = useLedger();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(blankExpense);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => Array.from(new Set(expenses.map((expense) => expense.category))).sort(), [expenses]);
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = `${expense.name} ${expense.category} ${expense.method}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || expense.category === category;
    return matchesSearch && matchesCategory;
  });

  const submitExpense = (event) => {
    event.preventDefault();
    try {
      addExpense(form);
      setForm(blankExpense);
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
          <h1 className="text-2xl font-semibold text-text-main mb-1">Expenses</h1>
          <p className="text-text-muted text-sm">Track and organize your everyday spending.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add expense
        </Button>
      </header>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search expenses..."
              className="w-full h-9 pl-9 pr-3 rounded-sm border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={category} onChange={(event) => setCategory(event.target.value)} className="h-9">
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </Select>
            <Button variant="secondary" size="sm" className="pointer-events-none">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-text-muted bg-muted-background/30 border-b border-border">
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Description</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Payment method</th>
                <th className="py-3 px-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-b border-border/50 hover:bg-muted-background/50 transition-colors last:border-0">
                  <td className="py-3 px-4 text-text-muted whitespace-nowrap">{formatDate(expense.date)}</td>
                  <td className="py-3 px-4 font-medium text-text-main">{expense.name}</td>
                  <td className="py-3 px-4 text-text-muted">{expense.category}</td>
                  <td className="py-3 px-4 text-text-muted">{expense.method}</td>
                  <td className="py-3 px-4 text-right font-medium text-text-main">{formatMoney(expense.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-text-muted bg-surface">
          <span>Showing {filteredExpenses.length} of {expenses.length} expenses</span>
          <span>Total {formatMoney(filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0))}</span>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Expense">
        <form className="space-y-4" onSubmit={submitExpense}>
          {error && <p className="text-sm text-status-danger bg-status-danger/10 px-3 py-2 rounded-sm">{error}</p>}
          <Input label="Expense name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Grocery Store" required />
          <Input label="Amount ($)" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} type="number" min="0.01" step="0.01" placeholder="0.00" required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {['Food', 'Transportation', 'Housing', 'Shopping', 'Entertainment', 'Utilities', 'Other'].map((item) => <option key={item}>{item}</option>)}
            </Select>
            <Input label="Date" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
          </div>

          <Select label="Payment method" value={form.method} onChange={(event) => setForm({ ...form, method: event.target.value })}>
            <option>Card</option>
            <option>Cash</option>
            <option>Bank Transfer</option>
            <option>Mobile Pay</option>
          </Select>

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-main">Description (optional)</label>
            <textarea
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-muted min-h-[80px]"
              placeholder="Add more details about this expense..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
