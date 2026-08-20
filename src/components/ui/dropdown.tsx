import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ className, trigger, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div ref={ref} className="relative inline-block" {...props}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-200 hover:bg-surface-50"
        >
          {trigger}
        </button>
        {isOpen && (
          <div
            className={cn(
              'absolute right-0 mt-2 w-48 bg-white rounded-lg border-2 border-surface-200 shadow-lg z-50',
              className
            )}
            onClick={() => setIsOpen(false)}
          >
            {children}
          </div>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';
export default Dropdown;
