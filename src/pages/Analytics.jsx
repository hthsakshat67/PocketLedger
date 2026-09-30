import React from 'react';
import { Card } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const trendData = [
  { month: 'Apr', spent: 38500 },
  { month: 'May', spent: 41200 },
  { month: 'Jun', spent: 39800 },
  { month: 'Jul', spent: 45000 },
  { month: 'Aug', spent: 42100 },
  { month: 'Sep', spent: 42850 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-text-main mb-1">Analytics</h1>
        <p className="text-text-muted text-sm">Understand how your spending changes over time.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <div className="mb-6">
            <h3 className="font-medium text-text-main">6-month spending trend</h3>
            <p className="text-xs text-text-muted">April - September 2026</p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E6E3" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6B6B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6B6B' }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#F1F1EE' }}
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E6E3', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Spent']}
                />
                <Bar dataKey="spent" fill="#245C4A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="mb-6">
            <h3 className="font-medium text-text-main">Largest expenses this month</h3>
            <p className="text-xs text-text-muted">Top individual transactions</p>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Rent Payment', date: 'Sep 1', amount: 20000, category: 'Housing' },
              { name: 'Car Insurance (Annual)', date: 'Sep 12', amount: 8500, category: 'Transportation' },
              { name: 'Grocery Run', date: 'Sep 15', amount: 4250, category: 'Food' },
              { name: 'Electricity Bill', date: 'Sep 30', amount: 2430, category: 'Utilities' },
            ].map((expense, i) => (
              <div key={i} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-sm text-text-main">{expense.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-text-muted">{expense.date}</span>
                    <span className="text-xs text-border">•</span>
                    <span className="text-xs text-text-muted">{expense.category}</span>
                  </div>
                </div>
                <span className="font-medium text-sm text-text-main">₹{expense.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
