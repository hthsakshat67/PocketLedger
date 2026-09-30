import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    { id: 'subscription', label: 'Subscription' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-text-main mb-1">Settings</h1>
        <p className="text-text-muted text-sm">Manage your account and preferences.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium rounded-sm transition-colors whitespace-nowrap text-left ${
                  activeTab === tab.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-muted hover:text-text-main hover:bg-muted-background'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="md:pt-4 md:mt-4 md:border-t md:border-border">
              <button className="px-3 py-2 text-sm font-medium rounded-sm transition-colors text-status-danger hover:bg-status-danger/10 text-left w-full">
                Danger zone
              </button>
            </div>
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <Card className="p-6">
              <h3 className="font-medium text-text-main mb-6 pb-4 border-b border-border">Profile Information</h3>
              <div className="space-y-4 max-w-md">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-muted-background flex items-center justify-center text-text-main font-medium text-xl">
                    AK
                  </div>
                  <Button variant="secondary" size="sm">Change avatar</Button>
                </div>
                
                <Input label="Full name" defaultValue="Akshat" />
                <Input label="Email address" defaultValue="akshat@example.com" type="email" />
                
                <div className="pt-4 mt-6 border-t border-border">
                  <Button>Save changes</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card className="p-6">
              <h3 className="font-medium text-text-main mb-6 pb-4 border-b border-border">Preferences</h3>
              <div className="space-y-4 max-w-md">
                <Select label="Currency">
                  <option>Indian Rupee (₹)</option>
                  <option>US Dollar ($)</option>
                  <option>Euro (€)</option>
                  <option>British Pound (£)</option>
                </Select>
                <Select label="Timezone">
                  <option>Asia/Kolkata (IST)</option>
                  <option>America/New_York (EST)</option>
                  <option>Europe/London (GMT)</option>
                </Select>
                <Select label="Start of month">
                  <option>1st of month</option>
                  <option>Last day of month</option>
                  <option>Custom date</option>
                </Select>
                
                <div className="pt-4 mt-6 border-t border-border">
                  <Button>Save preferences</Button>
                </div>
              </div>
            </Card>
          )}
          
          {/* Mock states for other tabs */}
          {['notifications', 'security', 'subscription'].includes(activeTab) && (
            <Card className="p-12 flex flex-col items-center justify-center text-center text-text-muted bg-muted-background/30 border-dashed">
              <p>Settings for {activeTab} will appear here.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
