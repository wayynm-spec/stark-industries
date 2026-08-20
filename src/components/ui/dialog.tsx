import React from 'react';
import { cn } from '@/lib/utils';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ isOpen = false, onClose, title, className, children, ...props }, ref) => {
    if (!isOpen) return null;

    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div
          ref={ref}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-md transform rounded-lg bg-white p-6',
            '-translate-x-1/2 -translate-y-1/2 shadow-lg',
            className
          )}
          {...props}
        >
          {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
          {children}
        </div>
      </>
    );
  }
);

Dialog.displayName = 'Dialog';
export default Dialog;
