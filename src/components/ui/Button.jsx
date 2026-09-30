import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none rounded-sm";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-surface text-text-main border border-border hover:bg-muted-background",
    tertiary: "text-primary hover:text-primary-hover hover:bg-muted-background/50",
    danger: "bg-surface text-status-danger border border-border hover:bg-status-danger hover:text-white"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
