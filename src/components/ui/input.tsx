import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-surface-900 mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'w-full px-4 py-2 text-base border-2 border-surface-200 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-stark-600 focus:border-transparent',
            'bg-white text-surface-900 placeholder-surface-400',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors',
            error && 'border-red-500 focus:ring-red-600',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
