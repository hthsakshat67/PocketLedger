import React, { useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Download, FileText } from 'lucide-react';
import { useLedger } from '../context/LedgerContext';

export default function Reports() {
  const { expenses, monthlySpending, monthlyIncome, categoryTotals, formatMoney } = useLedger();
  const [generated, setGenerated] = useState(false);
  const [type, setType] = useState('Comprehensive summary');
  const categories = useMemo(() => Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]), [categoryTotals]);

  const exportCsv = () => {
    const rows = [
      ['Date', 'Description', 'Category', 'Payment Method', 'Amount'],
      ...expenses.map((expense) => [expense.date, expense.name, expense.category, expense.method, expense.amount])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pocketledger-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-text-main mb-1">Reports</h1>
        <p className="text-text-muted text-sm">Generate a clear summary of your household spending.</p>
      </header>

      <Card className="p-6">
        <h3 className="font-medium text-text-main mb-4">Report Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Select label="Date range">
            <option>This month</option>
            <option>Last 30 days</option>
            <option>This year</option>
          </Select>
          <Select label="Report type" value={type} onChange={(event) => setType(event.target.value)}>
            <option>Comprehensive summary</option>
            <option>Expenses only</option>
            <option>Income vs Expenses</option>
            <option>Category breakdown</option>
          </Select>
          <Select label="Category filter">
            <option>All categories</option>
            {categories.map(([category]) => <option key={category}>{category}</option>)}
          </Select>
          <Select label="Account">
            <option>All accounts</option>
            <option>Household cash flow</option>
          </Select>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button onClick={() => setGenerated(true)}>Generate report</Button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {!generated ? (
          <div className="p-12 flex flex-col items-center justify-center text-center bg-muted-background/30 border-dashed">
            <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-medium text-text-main mb-1">No report generated</h3>
            <p className="text-sm text-text-muted max-w-sm mb-6">
              Configure your settings above and click generate to see a preview of your financial report.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-4">
              <div>
                <h3 className="font-medium text-text-main">{type}</h3>
                <p className="text-sm text-text-muted">October 2026</p>
              </div>
              <Button variant="secondary" onClick={exportCsv}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-text-muted">Income</p>
                <p className="text-xl font-semibold text-text-main">{formatMoney(monthlyIncome)}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Expenses</p>
                <p className="text-xl font-semibold text-text-main">{formatMoney(monthlySpending)}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Net</p>
                <p className="text-xl font-semibold text-text-main">{formatMoney(monthlyIncome - monthlySpending)}</p>
              </div>
            </div>
            <div className="space-y-3">
              {categories.map(([category, amount]) => (
                <div key={category} className="flex justify-between text-sm pb-3 border-b border-border/50 last:border-0">
                  <span className="text-text-muted">{category}</span>
                  <span className="font-medium text-text-main">{formatMoney(amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
