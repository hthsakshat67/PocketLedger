import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

const budgets = [
  { id: 1, category: 'Food', spent: 6200, limit: 8000, color: 'bg-primary' },
  { id: 2, category: 'Transportation', spent: 4500, limit: 5000, color: 'bg-status-warning' },
  { id: 3, category: 'Shopping', spent: 3200, limit: 3000, color: 'bg-status-danger' },
  { id: 4, category: 'Entertainment', spent: 1500, limit: 4000, color: 'bg-status-success' },
];

export default function Budgets() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-main mb-1">Monthly budgets</h1>
          <p className="text-text-muted text-sm">Keep your spending in check.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create budget
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const percent = Math.min(Math.round((budget.spent / budget.limit) * 100), 100);
          const isOver = budget.spent > budget.limit;
          
          return (
            <Card key={budget.id} className="p-5">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <h3 className="font-medium text-text-main">{budget.category}</h3>
                  <p className="text-sm text-text-muted mt-1">
                    ₹{budget.spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}
                  </p>
                </div>
                <span className={`text-sm font-medium ${isOver ? 'text-status-danger' : 'text-text-main'}`}>
                  {Math.round((budget.spent / budget.limit) * 100)}%
                </span>
              </div>
              
              {/* Progress bar container */}
              <div className="h-1.5 w-full bg-muted-background rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isOver ? 'bg-status-danger' : budget.color}`} 
                  style={{ width: `${percent}%` }}
                />
              </div>
              
              {isOver && (
                <p className="text-xs text-status-danger mt-3">You've exceeded your budget by ₹{(budget.spent - budget.limit).toLocaleString()}</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
