import React from 'react';
import { Card } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLedger, formatDate } from '../context/LedgerContext';

export default function Analytics() {
  const { expenses, categoryTotals, formatMoney } = useLedger();
  const trendData = Object.entries(categoryTotals)
    .map(([category, spent]) => ({ category, spent }))
    .sort((a, b) => b.spent - a.spent);
  const largestExpenses = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-text-main mb-1">Analytics</h1>
        <p className="text-text-muted text-sm">Understand how your spending changes over time.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <div className="mb-6">
            <h3 className="font-medium text-text-main">Category spending</h3>
            <p className="text-xs text-text-muted">October 2026</p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E6E3" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6B6B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6B6B' }} dx={-10} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  cursor={{ fill: '#F1F1EE' }}
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E6E3', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value) => [formatMoney(value), 'Spent']}
                />
                <Bar dataKey="spent" fill="#245C4A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="mb-6">
            <h3 className="font-medium text-text-main">Largest expenses</h3>
            <p className="text-xs text-text-muted">Top individual transactions</p>
          </div>
          <div className="space-y-4">
            {largestExpenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-sm text-text-main">{expense.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-text-muted">{formatDate(expense.date)}</span>
                    <span className="text-xs text-border">•</span>
                    <span className="text-xs text-text-muted">{expense.category}</span>
                  </div>
                </div>
                <span className="font-medium text-sm text-text-main">{formatMoney(expense.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
