import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';
import { useLedger } from '../context/LedgerContext';

export default function Settings() {
  const { user } = useAuth();
  const { settings, updateSettings, updateNotificationSettings } = useLedger();
  const [activeTab, setActiveTab] = useState('profile');
  const [preferences, setPreferences] = useState(settings);

  useEffect(() => {
    setPreferences(settings);
  }, [settings]);

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    { id: 'subscription', label: 'Subscription' }
  ];

  const initials = user?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'PL';

  return (
    <div className="space-y-6 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-text-main mb-1">Settings</h1>
        <p className="text-text-muted text-sm">Manage your account and preferences.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium rounded-sm transition-colors whitespace-nowrap text-left ${
                  activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text-main hover:bg-muted-background'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <Card className="p-6">
              <h3 className="font-medium text-text-main mb-6 pb-4 border-b border-border">Profile Information</h3>
              <div className="space-y-4 max-w-md">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-muted-background flex items-center justify-center text-text-main font-medium text-xl">
                    {initials}
                  </div>
                </div>
                <Input label="Full name" value={user?.name || ''} readOnly />
                <Input label="Email address" value={user?.email || ''} type="email" readOnly />
                <p className="text-xs text-text-muted">Profile identity is tied to your verified login account.</p>
              </div>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card className="p-6">
              <h3 className="font-medium text-text-main mb-6 pb-4 border-b border-border">Preferences</h3>
              <div className="space-y-4 max-w-md">
                <Select label="Currency" value={preferences.currency} onChange={(event) => setPreferences({ ...preferences, currency: event.target.value })}>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </Select>
                <Select label="Timezone" value={preferences.timezone} onChange={(event) => setPreferences({ ...preferences, timezone: event.target.value })}>
                  <option value="America/New_York">America/New_York (ET)</option>
                  <option value="America/Chicago">America/Chicago (CT)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PT)</option>
                </Select>
                <Select label="Start of month" value={preferences.monthStart} onChange={(event) => setPreferences({ ...preferences, monthStart: event.target.value })}>
                  <option value="1">1st of month</option>
                  <option value="15">15th of month</option>
                  <option value="last">Last day of month</option>
                </Select>

                <div className="pt-4 mt-6 border-t border-border">
                  <Button onClick={() => updateSettings(preferences)}>Save preferences</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-6">
              <h3 className="font-medium text-text-main mb-6 pb-4 border-b border-border">Notification Rules</h3>
              <div className="space-y-4 max-w-lg">
                {[
                  ['billReminders', 'Bill reminders', 'Alert when bills are due soon or overdue.'],
                  ['budgetAlerts', 'Budget alerts', 'Alert when budget usage crosses the limit.'],
                  ['subscriptionRenewals', 'Subscription renewals', 'Alert before recurring charges renew.'],
                  ['browser', 'Browser notifications', 'Use your browser notification permission for alerts.']
                ].map(([key, label, description]) => (
                  <label key={key} className="flex items-start justify-between gap-4 p-3 border border-border rounded-sm">
                    <span>
                      <span className="block text-sm font-medium text-text-main">{label}</span>
                      <span className="block text-xs text-text-muted mt-1">{description}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.notifications[key]}
                      onChange={(event) => updateNotificationSettings({ [key]: event.target.checked })}
                      className="mt-1"
                    />
                  </label>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-6">
              <h3 className="font-medium text-text-main mb-4">Security</h3>
              <p className="text-sm text-text-muted max-w-xl">
                Sign-in uses a server-side HTTP-only session cookie, same-origin request checks, password hashing, and login rate limiting. Financial entries are validated before saving and stored locally per signed-in account on this device.
              </p>
            </Card>
          )}

          {activeTab === 'subscription' && (
            <Card className="p-6">
              <h3 className="font-medium text-text-main mb-4">Subscription</h3>
              <p className="text-sm text-text-muted">Current plan: Free. Household collaboration and exports can be layered onto the same ledger data model.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
