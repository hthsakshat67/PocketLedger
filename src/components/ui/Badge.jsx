import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-muted-background text-text-main',
    success: 'bg-status-success/10 text-status-success',
    warning: 'bg-status-warning/10 text-status-warning',
    danger: 'bg-status-danger/10 text-status-danger',
    primary: 'bg-primary/10 text-primary',
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
