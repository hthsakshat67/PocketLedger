import React from 'react';
import { cn } from '../../lib/utils';

const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("bg-surface border border-border rounded-md shadow-subtle p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export { Card };
