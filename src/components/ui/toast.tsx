import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ message, type = 'info', duration = 3000, onClose, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const typeStyles = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-stark-600 text-white',
      warning: 'bg-yellow-500 text-white',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50',
          'animate-slide-up',
          typeStyles[type]
        )}
        {...props}
      >
        {message}
      </div>
    );
  }
);

Toast.displayName = 'Toast';
export default Toast;
