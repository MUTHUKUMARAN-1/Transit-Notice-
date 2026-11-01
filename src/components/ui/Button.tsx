import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'transit-dark';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, icon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none rounded-lg';

    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm focus-visible:ring-blue-500 border border-transparent',
      secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 border border-slate-200/80 focus-visible:ring-slate-400',
      outline: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 active:bg-slate-100 shadow-xs focus-visible:ring-blue-500',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm focus-visible:ring-rose-500 border border-transparent',
      ghost: 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400',
      'transit-dark': 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 border border-slate-800 shadow-sm focus-visible:ring-slate-700'
    };

    const sizeStyles = {
      sm: 'text-xs h-8 px-2.5 gap-1.5',
      md: 'text-sm h-9 px-3.5 gap-2',
      lg: 'text-base h-11 px-5 gap-2.5'
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
