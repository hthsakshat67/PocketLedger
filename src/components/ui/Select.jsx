import React from 'react';
import { cn } from '../../lib/utils';

const Select = React.forwardRef(({ className, label, error, children, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-main">{label}</label>}
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text-main",
          "transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-status-danger focus:border-status-danger focus:ring-status-danger",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-status-danger mt-1">{error}</p>}
    </div>
  );
});
Select.displayName = 'Select';

export { Select };
