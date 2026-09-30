import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Tv, Music, Cloud } from 'lucide-react';

const subscriptions = [
  { id: 1, name: 'Netflix', category: 'Entertainment', cost: 649, frequency: 'month', nextBilling: 'Sep 30, 2026', icon: Tv },
  { id: 2, name: 'Spotify', category: 'Entertainment', cost: 119, frequency: 'month', nextBilling: 'Oct 3, 2026', icon: Music },
  { id: 3, name: 'Adobe Creative Cloud', category: 'Software', cost: 1675, frequency: 'month', nextBilling: 'Oct 8, 2026', icon: Cloud },
  { id: 4, name: 'Amazon Prime', category: 'Shopping', cost: 1499, frequency: 'year', nextBilling: 'Jan 15, 2027', icon: Tv },
];

export default function Subscriptions() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-main mb-1">Subscriptions</h1>
          <p className="text-text-muted text-sm">See how much your recurring services cost.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add subscription
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-sm text-text-muted mb-2">Monthly subscriptions</p>
          <p className="text-3xl font-semibold text-text-main">₹3,245</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-text-muted mb-2">Annual estimate</p>
          <p className="text-3xl font-semibold text-text-main">₹38,940</p>
        </Card>
      </div>

      <h3 className="font-medium text-text-main mb-4">Active subscriptions</h3>
      
      <div className="space-y-3">
        {subscriptions.map((sub) => {
          const Icon = sub.icon;
          return (
            <Card key={sub.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-sm bg-muted-background flex items-center justify-center text-text-muted">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-text-main">{sub.name}</h3>
                  <p className="text-xs text-text-muted mt-1">{sub.category}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:items-end text-left sm:text-right gap-1">
                <p className="font-medium text-text-main">₹{sub.cost.toLocaleString()} <span className="text-text-muted text-xs font-normal">/ {sub.frequency}</span></p>
                <p className="text-xs text-text-muted">Next billing {sub.nextBilling}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
