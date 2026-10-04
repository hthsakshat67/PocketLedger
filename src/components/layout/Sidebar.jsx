import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, CreditCard, FileText, Repeat, PieChart, BarChart2, Users, Bell, Settings, ArrowUpCircle, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Overview', items: [{ name: 'Dashboard', path: '/dashboard', icon: Home }] },
  { label: 'Money', items: [
    { name: 'Expenses', path: '/expenses', icon: CreditCard },
    { name: 'Bills', path: '/bills', icon: FileText },
    { name: 'Subscriptions', path: '/subscriptions', icon: Repeat },
    { name: 'Budgets', path: '/budgets', icon: PieChart }
  ]},
  { label: 'Insights', items: [
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Reports', path: '/reports', icon: FileText }
  ]},
  { label: 'Household', items: [
    { name: 'Family', path: '/family', icon: Users },
    { name: 'Notifications', path: '/notifications', icon: Bell }
  ]}
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const initials = user?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'PL';

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 bg-background border-r border-border h-screen sticky top-0 flex-col hidden sm:flex">
      <div className="p-6 pb-2">
        <h1 className="font-semibold text-lg flex items-center gap-2 text-text-main">
          <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          PocketLedger
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {navItems.map((section, idx) => (
          <div key={idx}>
            <p className="px-2 text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "w-full flex items-center gap-3 px-2 py-2 rounded-sm text-sm font-medium transition-colors duration-150",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-text-muted hover:bg-muted-background hover:text-text-main"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border space-y-1">
        <NavLink to="/settings" className={({ isActive }) => cn(
          "w-full flex items-center gap-3 px-2 py-2 rounded-sm text-sm font-medium transition-colors duration-150",
          isActive ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-muted-background hover:text-text-main"
        )}>
          <Settings className="w-4 h-4" />
          Settings
        </NavLink>
        <NavLink to="/upgrade" className={({ isActive }) => cn(
          "w-full flex items-center gap-3 px-2 py-2 rounded-sm text-sm font-medium transition-colors duration-150",
          isActive ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-muted-background hover:text-text-main"
        )}>
          <ArrowUpCircle className="w-4 h-4" />
          Upgrade
        </NavLink>
        
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-muted-background flex items-center justify-center text-text-main font-medium text-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-main truncate">{user?.name}</p>
            <p className="text-xs text-text-muted truncate">Free Plan</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-sm text-sm font-medium text-text-muted hover:bg-muted-background hover:text-text-main transition-colors duration-150"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
