import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface Tab {
  label: string;
  value: string;
  content: React.ReactNode;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[];
  defaultValue?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs, defaultValue = tabs[0]?.value, className, ...props }, ref) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className="flex gap-2 border-b-2 border-surface-200 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'px-4 py-2 font-medium text-sm transition-colors',
                activeTab === tab.value
                  ? 'text-stark-600 border-b-2 border-stark-600'
                  : 'text-surface-600 hover:text-surface-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {tabs.map((tab) => (
          activeTab === tab.value && (
            <div key={tab.value}>{tab.content}</div>
          )
        ))}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';
export default Tabs;
