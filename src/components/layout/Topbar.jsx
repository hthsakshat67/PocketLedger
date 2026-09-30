import React from 'react';
import { Bell } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-text-main">Dashboard</h2>
      
      <div className="flex items-center gap-4">
        <select className="text-sm border-none bg-transparent font-medium text-text-main focus:ring-0 cursor-pointer">
          <option>September 2026</option>
          <option>August 2026</option>
          <option>July 2026</option>
        </select>
        
        <button className="relative p-2 text-text-muted hover:text-text-main transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-status-warning rounded-full"></span>
        </button>
        
        <div className="w-8 h-8 rounded-full bg-muted-background flex items-center justify-center text-text-main font-medium text-sm sm:hidden">
          AK
        </div>
      </div>
    </header>
  );
}
