import React from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  size = 'md'
}) => {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-md font-medium transition-all select-none',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs sm:text-sm',
              isActive
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px] font-bold tracking-tight',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-200 text-slate-700'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
