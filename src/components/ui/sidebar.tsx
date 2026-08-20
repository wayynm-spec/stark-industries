import React from 'react';
import { cn } from '@/lib/utils';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, isOpen = true, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        'h-screen bg-surface-50 border-r-2 border-surface-200 overflow-y-auto',
        'transition-all duration-200',
        !isOpen && 'hidden',
        className
      )}
      {...props}
    />
  )
);

Sidebar.displayName = 'Sidebar';
export default Sidebar;
