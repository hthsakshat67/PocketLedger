import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';

const expenses = [
  { id: 1, date: 'Sep 27, 2026', name: 'Grocery Store', category: 'Food', method: 'Card', amount: 2430 },
  { id: 2, date: 'Sep 26, 2026', name: 'Shell Station', category: 'Transportation', method: 'Card', amount: 3100 },
  { id: 3, date: 'Sep 24, 2026', name: 'Cafe Coffee Day', category: 'Food', method: 'Cash', amount: 450 },
  { id: 4, date: 'Sep 22, 2026', name: 'Amazon', category: 'Shopping', method: 'Card', amount: 1299 },
  { id: 5, date: 'Sep 20, 2026', name: 'Plumber', category: 'Housing', method: 'Bank Transfer', amount: 1500 },
];

export default function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              placeholder="Search expenses..." 
              className="w-full h-9 pl-9 pr-3 rounded-sm border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="secondary" size="sm" className="w-full sm:w-auto">
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
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-border/50 hover:bg-muted-background/50 transition-colors last:border-0">
                  <td className="py-3 px-4 text-text-muted whitespace-nowrap">{expense.date}</td>
                  <td className="py-3 px-4 font-medium text-text-main">{expense.name}</td>
                  <td className="py-3 px-4 text-text-muted">{expense.category}</td>
                  <td className="py-3 px-4 text-text-muted">{expense.method}</td>
                  <td className="py-3 px-4 text-right font-medium text-text-main">₹{expense.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-text-muted bg-surface">
          <span>Showing 1 to 5 of 24 entries</span>
          <div className="flex gap-1">
            <Button variant="secondary" size="sm" disabled>Previous</Button>
            <Button variant="secondary" size="sm">Next</Button>
          </div>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Expense">
        <div className="space-y-4">
          <Input label="Expense name" placeholder="e.g. Grocery Store" />
          <Input label="Amount (₹)" type="number" placeholder="0.00" />
          
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category">
              <option value="">Select category</option>
              <option value="food">Food</option>
              <option value="transportation">Transportation</option>
              <option value="housing">Housing</option>
              <option value="shopping">Shopping</option>
            </Select>
            <Input label="Date" type="date" defaultValue="2026-09-30" />
          </div>
          
          <Select label="Payment method">
            <option value="card">Card</option>
            <option value="cash">Cash</option>
            <option value="bank">Bank Transfer</option>
          </Select>
          
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-main">Description (optional)</label>
            <textarea 
              className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-muted min-h-[80px]"
              placeholder="Add more details about this expense..."
            ></textarea>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsModalOpen(false)}>Add expense</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
