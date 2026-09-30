import React from 'react';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const spendingData = [
  { date: 'Sep 1', amount: 1200 },
  { date: 'Sep 5', amount: 2100 },
  { date: 'Sep 10', amount: 1800 },
  { date: 'Sep 15', amount: 3400 },
  { date: 'Sep 20', amount: 2800 },
  { date: 'Sep 25', amount: 4100 },
  { date: 'Sep 30', amount: 3800 },
];

const categoryData = [
  { name: 'Housing', value: 20000, color: '#245C4A' },
  { name: 'Food', value: 7200, color: '#3A7D64' },
  { name: 'Transport', value: 4850, color: '#52A082' },
  { name: 'Subs', value: 3245, color: '#73B89E' },
  { name: 'Utilities', value: 3100, color: '#9CD2BD' },
];

const recentTransactions = [
  { id: 1, date: 'Sep 27', desc: 'Grocery Store', category: 'Food', method: 'Card', amount: -2430 },
  { id: 2, date: 'Sep 26', desc: 'Netflix', category: 'Subscription', method: 'Card', amount: -649 },
  { id: 3, date: 'Sep 25', desc: 'Salary', category: 'Income', method: 'Bank', amount: 75000 },
  { id: 4, date: 'Sep 24', desc: 'Electricity', category: 'Utilities', method: 'Bank', amount: -2120 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-text-main mb-1">Good morning, Akshat</h1>
        <p className="text-text-muted text-sm">Here's how your household finances are looking this month.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-sm text-text-muted mb-2">Monthly spending</p>
          <p className="text-3xl font-semibold text-text-main mb-2">₹42,850</p>
          <div className="flex items-center text-xs text-status-warning">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>8.4% from August</span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-text-muted mb-2">Monthly income</p>
          <p className="text-3xl font-semibold text-text-main mb-2">₹75,000</p>
          <div className="flex items-center text-xs text-text-muted">
            <span>Consistent with August</span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-text-muted mb-2">Remaining</p>
          <p className="text-3xl font-semibold text-text-main mb-2">₹32,150</p>
          <div className="flex items-center text-xs text-status-success">
            <ArrowDownRight className="w-3 h-3 mr-1" />
            <span>Safe to spend</span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-text-muted mb-2">Upcoming bills</p>
          <p className="text-3xl font-semibold text-text-main mb-2">5</p>
          <div className="flex items-center text-xs text-text-muted">
            <span>Next due in 2 days</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Chart */}
        <Card className="lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-medium text-text-main">Spending overview</h3>
              <p className="text-xs text-text-muted">September 2026</p>
            </div>
            <div className="flex gap-2">
              {['1M', '3M', '6M', '1Y'].map(tf => (
                <button key={tf} className={`text-xs px-2 py-1 rounded-sm ${tf === '1M' ? 'bg-muted-background font-medium text-text-main' : 'text-text-muted hover:text-text-main'}`}>
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E6E3" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6B6B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6B6B' }} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E6E3', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#171717' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#245C4A" strokeWidth={2} dot={{ r: 3, fill: '#245C4A' }} activeDot={{ r: 5 }} animationDuration={500} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categories */}
        <Card className="flex flex-col">
          <h3 className="font-medium text-text-main mb-6">Where your money went</h3>
          <div className="h-[160px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={500}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid #E6E6E3' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {categoryData.slice(0, 4).map(cat => (
              <div key={cat.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-text-muted">{cat.name}</span>
                </div>
                <span className="font-medium text-text-main">₹{cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-text-main">Recent transactions</h3>
            <Button variant="tertiary" size="sm">View all &rarr;</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-text-muted border-b border-border">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Description</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border/50 hover:bg-muted-background/50 transition-colors last:border-0">
                    <td className="py-3 text-text-muted">{tx.date}</td>
                    <td className="py-3 font-medium text-text-main">{tx.desc}</td>
                    <td className="py-3 text-text-muted">{tx.category}</td>
                    <td className={`py-3 text-right font-medium ${tx.amount > 0 ? 'text-status-success' : 'text-text-main'}`}>
                      {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Upcoming Bills */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-text-main">Upcoming bills</h3>
            <Button variant="tertiary" size="sm">View all &rarr;</Button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center group">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-sm bg-muted-background flex items-center justify-center text-text-muted group-hover:bg-primary/5 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-text-main">Internet</p>
                  <p className="text-xs text-status-warning font-medium">Due in 2 days (Sep 28)</p>
                </div>
              </div>
              <p className="font-medium text-sm text-text-main">₹999</p>
            </div>
            
            <div className="flex justify-between items-center group">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-sm bg-muted-background flex items-center justify-center text-text-muted group-hover:bg-primary/5 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-text-main">Electricity</p>
                  <p className="text-xs text-text-muted">Due in 4 days (Sep 30)</p>
                </div>
              </div>
              <p className="font-medium text-sm text-text-main">₹2,430</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
