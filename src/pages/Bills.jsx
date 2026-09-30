import React, { useState } from 'react';
import { Plus, MoreHorizontal, Wifi, Zap, Droplets, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

const bills = [
  { id: 1, name: 'Internet', category: 'Utilities', dueDate: 'Sep 28, 2026', amount: 999, status: 'due_soon', icon: Wifi },
  { id: 2, name: 'Electricity', category: 'Utilities', dueDate: 'Sep 30, 2026', amount: 2430, status: 'upcoming', icon: Zap },
  { id: 3, name: 'Water', category: 'Utilities', dueDate: 'Oct 5, 2026', amount: 450, status: 'upcoming', icon: Droplets },
  { id: 4, name: 'Rent', category: 'Housing', dueDate: 'Oct 1, 2026', amount: 20000, status: 'upcoming', icon: Home },
  { id: 5, name: 'Gas', category: 'Utilities', dueDate: 'Sep 15, 2026', amount: 1100, status: 'paid', icon: Zap },
];

const statusConfig = {
  due_soon: { label: 'Due soon', variant: 'warning' },
  upcoming: { label: 'Upcoming', variant: 'default' },
  overdue: { label: 'Overdue', variant: 'danger' },
  paid: { label: 'Paid', variant: 'success' },
};

export default function Bills() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'due_soon', label: 'Due soon' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'paid', label: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-main mb-1">Bills</h1>
          <p className="text-text-muted text-sm">Keep track of what needs to be paid and when.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add bill
        </Button>
      </header>

      <div className="flex space-x-1 border-b border-border mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === tab.id 
                ? 'text-primary' 
                : 'text-text-muted hover:text-text-main hover:bg-muted-background/50'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {bills.map((bill) => {
          const StatusIcon = bill.icon;
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
                    <span className="text-xs text-text-muted">Due {bill.dueDate}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                <div className="text-left sm:text-right">
                  <p className="font-medium text-text-main">₹{bill.amount.toLocaleString()}</p>
                </div>
                <div className="w-24 flex justify-end">
                  <Badge variant={statusConfig[bill.status].variant}>
                    {statusConfig[bill.status].label}
                  </Badge>
                </div>
                <button className="p-2 text-text-muted hover:text-text-main hover:bg-muted-background rounded-sm transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
