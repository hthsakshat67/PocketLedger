import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-main">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text-main",
          "transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-status-danger focus:border-status-danger focus:ring-status-danger",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-status-danger mt-1">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
