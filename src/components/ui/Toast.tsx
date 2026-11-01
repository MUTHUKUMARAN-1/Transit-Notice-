import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const ToastContainer: React.FC = () => {
  const { activeToast, dismissToast } = useTransit();

  if (!activeToast) return null;

  const icons = {
    info: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    alert: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
  };

  const borders = {
    info: 'border-blue-200 bg-white text-slate-800',
    success: 'border-emerald-200 bg-white text-slate-800',
    alert: 'border-rose-300 bg-rose-50 text-rose-950'
  };

  return (
    <div
      className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-in slide-in-from-bottom-4 fade-in duration-200"
      role="status"
      aria-live="polite"
    >
      <div className={cn('p-4 rounded-xl shadow-xl border flex items-start gap-3', borders[activeToast.type])}>
        {icons[activeToast.type]}
        <div className="flex-1 pr-2">
          <p className="text-sm font-semibold leading-tight">{activeToast.title}</p>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{activeToast.message}</p>
        </div>
        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
