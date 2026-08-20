import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-lg border-2 border-surface-200 shadow-sm',
        'hover:shadow-md transition-shadow',
        className
      )}
      {...props}
    />
  )
);

Card.displayName = 'Card';
export default Card;
