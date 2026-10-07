import React from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useLedger } from '../context/LedgerContext';

export default function Notifications() {
  const { notifications, markNotificationRead, settings, updateNotificationSettings } = useLedger();

  return (
    <div className="space-y-6 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-text-main mb-1">Notifications</h1>
        <p className="text-text-muted text-sm">Review alerts from bills, budgets, subscriptions, and account actions.</p>
      </header>

      <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-text-main">Browser notifications</h3>
            <p className="text-sm text-text-muted">Get bill and budget alerts even when the notifications page is not open.</p>
          </div>
        </div>
        <Button
          variant={settings.notifications.browser ? 'secondary' : 'primary'}
          onClick={() => updateNotificationSettings({ browser: !settings.notifications.browser })}
        >
          {settings.notifications.browser ? 'Turn off' : 'Enable'}
        </Button>
      </Card>

      <div className="space-y-3">
        {notifications.map((item) => (
          <Card key={item.id} className={`p-4 flex items-start justify-between gap-4 ${item.read ? 'bg-surface' : 'bg-primary/5'}`}>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-text-main">{item.title}</h3>
                {!item.read && <span className="w-2 h-2 rounded-full bg-status-warning" />}
              </div>
              <p className="text-sm text-text-muted mt-1">{item.body}</p>
              <p className="text-xs text-text-muted mt-2">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
            {!item.read && (
              <Button variant="secondary" size="sm" onClick={() => markNotificationRead(item.id)}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Read
              </Button>
            )}
          </Card>
        ))}
        {notifications.length === 0 && (
          <Card className="p-10 text-center border-dashed bg-muted-background/30 text-text-muted">
            No notifications yet. Add an expense, bill, subscription, or budget to see activity here.
          </Card>
        )}
      </div>
    </div>
  );
}
