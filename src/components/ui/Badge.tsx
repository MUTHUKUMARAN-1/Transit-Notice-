import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-800 border-rose-200/80',
    info: 'bg-blue-50 text-blue-800 border-blue-200/80',
    outline: 'bg-transparent text-slate-700 border-slate-300'
  };

  const dotColors = {
    default: 'bg-slate-400',
    neutral: 'bg-slate-400',
    success: 'bg-emerald-600',
    warning: 'bg-amber-500',
    danger: 'bg-rose-600',
    info: 'bg-blue-600',
    outline: 'bg-slate-500'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1 font-semibold'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border tracking-tight transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
