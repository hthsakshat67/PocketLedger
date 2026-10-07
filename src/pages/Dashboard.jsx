import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLedger, daysUntil, formatDate } from '../context/LedgerContext';

const colors = ['#245C4A', '#6B8F71', '#B9803D', '#576C9D', '#9A6B7D', '#7C7C6F'];

export default function Dashboard() {
  const {
    expenses,
    monthlySpending,
    monthlyIncome,
    upcomingBills,
    categoryTotals,
    monthlySubscriptions,
    formatMoney
  } = useLedger();

  const spendingData = useMemo(() => {
    const buckets = {};
    expenses.forEach((expense) => {
      const day = Number(expense.date.slice(8, 10));
      if (expense.date.startsWith('2026-10')) buckets[day] = (buckets[day] || 0) + expense.amount;
    });
    return [1, 5, 10, 15, 20, 25, 31].map((day) => ({
      date: `Oct ${day}`,
      amount: Object.entries(buckets).reduce((sum, [itemDay, amount]) => Number(itemDay) <= day ? sum + amount : sum, 0)
    }));
  }, [expenses]);

  const categoryData = Object.entries(categoryTotals)
    .map(([name, value], index) => ({ name, value, color: colors[index % colors.length] }))
    .sort((a, b) => b.value - a.value);

  const recentTransactions = expenses.slice(0, 5);
  const remaining = monthlyIncome - monthlySpending - monthlySubscriptions;

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-text-main mb-1">Good morning</h1>
        <p className="text-text-muted text-sm">Here's how your household finances are looking this month.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-sm text-text-muted mb-2">Monthly spending</p>
          <p className="text-3xl font-semibold text-text-main mb-2">{formatMoney(monthlySpending)}</p>
          <div className="flex items-center text-xs text-status-warning">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>Updates as expenses are added</span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-text-muted mb-2">Monthly income</p>
          <p className="text-3xl font-semibold text-text-main mb-2">{formatMoney(monthlyIncome)}</p>
          <div className="flex items-center text-xs text-text-muted">
            <span>Baseline household income</span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-text-muted mb-2">Remaining</p>
          <p className="text-3xl font-semibold text-text-main mb-2">{formatMoney(remaining)}</p>
          <div className={`flex items-center text-xs ${remaining >= 0 ? 'text-status-success' : 'text-status-danger'}`}>
            <ArrowDownRight className="w-3 h-3 mr-1" />
            <span>{remaining >= 0 ? 'Available after tracked costs' : 'Over planned cash flow'}</span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-text-muted mb-2">Upcoming bills</p>
          <p className="text-3xl font-semibold text-text-main mb-2">{upcomingBills.length}</p>
          <div className="flex items-center text-xs text-text-muted">
            <span>{upcomingBills[0] ? `Next due ${formatDate(upcomingBills[0].dueDate)}` : 'Nothing due'}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-medium text-text-main">Spending overview</h3>
              <p className="text-xs text-text-muted">October 2026</p>
            </div>
          </div>
          <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E6E3" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6B6B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6B6B' }} dx={-10} tickFormatter={(value) => `$${value}`} />
                <RechartsTooltip
                  formatter={(value) => formatMoney(value)}
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E6E3', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#171717' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#245C4A" strokeWidth={2} dot={{ r: 3, fill: '#245C4A' }} activeDot={{ r: 5 }} animationDuration={500} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col">
          <h3 className="font-medium text-text-main mb-6">Where your money went</h3>
          <div className="h-[160px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value" animationDuration={500}>
                  {categoryData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip formatter={(value) => formatMoney(value)} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid #E6E6E3' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {categoryData.slice(0, 5).map((cat) => (
              <div key={cat.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-text-muted">{cat.name}</span>
                </div>
                <span className="font-medium text-text-main">{formatMoney(cat.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-text-main">Recent transactions</h3>
            <Link className="text-sm text-primary hover:text-primary-hover" to="/expenses">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-text-muted border-b border-border">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Description</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border/50 hover:bg-muted-background/50 transition-colors last:border-0">
                    <td className="py-3 text-text-muted">{formatDate(tx.date)}</td>
                    <td className="py-3 font-medium text-text-main">{tx.name}</td>
                    <td className="py-3 text-text-muted">{tx.category}</td>
                    <td className="py-3 text-right font-medium text-text-main">{formatMoney(tx.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-text-main">Upcoming bills</h3>
            <Link className="text-sm text-primary hover:text-primary-hover" to="/bills">View all</Link>
          </div>
          <div className="space-y-4">
            {upcomingBills.slice(0, 3).map((bill) => (
              <div key={bill.id} className="flex justify-between items-center group">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-sm bg-muted-background flex items-center justify-center text-text-muted group-hover:bg-primary/5 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-text-main">{bill.name}</p>
                    <p className={`text-xs ${bill.status === 'due_soon' || bill.status === 'overdue' ? 'text-status-warning font-medium' : 'text-text-muted'}`}>
                      {daysUntil(bill.dueDate) >= 0 ? `Due in ${daysUntil(bill.dueDate)} days` : 'Overdue'} ({formatDate(bill.dueDate)})
                    </p>
                  </div>
                </div>
                <p className="font-medium text-sm text-text-main">{formatMoney(bill.amount)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
