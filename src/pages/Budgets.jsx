import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Plus } from 'lucide-react';
import { useLedger } from '../context/LedgerContext';

const blankBudget = {
  category: 'Food',
  limit: '',
  color: 'bg-primary'
};

export default function Budgets() {
  const { budgetRows, addBudget, formatMoney } = useLedger();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(blankBudget);
  const [error, setError] = useState('');

  const submitBudget = (event) => {
    event.preventDefault();
    try {
      addBudget(form);
      setForm(blankBudget);
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
          <h1 className="text-2xl font-semibold text-text-main mb-1">Monthly budgets</h1>
          <p className="text-text-muted text-sm">Keep your spending in check.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create budget
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgetRows.map((budget) => {
          const percent = Math.min(Math.round((budget.spent / budget.limit) * 100), 100);
          const isOver = budget.spent > budget.limit;

          return (
            <Card key={budget.id} className="p-5">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <h3 className="font-medium text-text-main">{budget.category}</h3>
                  <p className="text-sm text-text-muted mt-1">
                    {formatMoney(budget.spent)} / {formatMoney(budget.limit)}
                  </p>
                </div>
                <span className={`text-sm font-medium ${isOver ? 'text-status-danger' : 'text-text-main'}`}>
                  {Math.round((budget.spent / budget.limit) * 100)}%
                </span>
              </div>

              <div className="h-1.5 w-full bg-muted-background rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isOver ? 'bg-status-danger' : budget.color}`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {isOver && (
                <p className="text-xs text-status-danger mt-3">You've exceeded this budget by {formatMoney(budget.spent - budget.limit)}.</p>
              )}
            </Card>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Budget">
        <form className="space-y-4" onSubmit={submitBudget}>
          {error && <p className="text-sm text-status-danger bg-status-danger/10 px-3 py-2 rounded-sm">{error}</p>}
          <Select label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            {['Food', 'Transportation', 'Housing', 'Shopping', 'Entertainment', 'Utilities', 'Other'].map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Input label="Monthly limit ($)" value={form.limit} onChange={(event) => setForm({ ...form, limit: event.target.value })} type="number" min="0.01" step="0.01" required />
          <Select label="Color" value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })}>
            <option value="bg-primary">Green</option>
            <option value="bg-status-warning">Gold</option>
            <option value="bg-status-success">Blue green</option>
            <option value="bg-status-danger">Red</option>
          </Select>
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save budget</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
