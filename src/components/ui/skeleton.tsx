import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-surface-200 animate-pulse rounded',
        className
      )}
      {...props}
    />
  )
);

Skeleton.displayName = 'Skeleton';
export default Skeleton;
