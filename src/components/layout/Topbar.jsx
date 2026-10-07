import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLedger } from '../../context/LedgerContext';

export default function Topbar() {
  const { user } = useAuth();
  const { unreadNotifications } = useLedger();
  const initials = user?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'PL';

  return (
    <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-text-main">Dashboard</h2>
      
      <div className="flex items-center gap-4">
        <select className="text-sm border-none bg-transparent font-medium text-text-main focus:ring-0 cursor-pointer">
          <option>October 2026</option>
          <option>September 2026</option>
          <option>August 2026</option>
        </select>
        
        <Link to="/notifications" className="relative p-2 text-text-muted hover:text-text-main transition-colors" aria-label="Open notifications">
          <Bell className="w-5 h-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-status-warning rounded-full text-[10px] leading-4 text-white text-center">
              {unreadNotifications}
            </span>
          )}
        </Link>
        
        <div className="w-8 h-8 rounded-full bg-muted-background flex items-center justify-center text-text-main font-medium text-sm sm:hidden">
          {initials}
        </div>
      </div>
    </header>
  );
}
