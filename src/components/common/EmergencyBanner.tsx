import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { AlertTriangle, X } from 'lucide-react';
import { formatTime24 } from '../../utils/transitFormatters';

export const EmergencyBanner: React.FC = () => {
  const { emergencyBroadcast, setEmergencyBroadcast } = useTransit();

  if (!emergencyBroadcast || !emergencyBroadcast.active) return null;

  return (
    <div
      role="alert"
      className="bg-rose-600 text-white border-b border-rose-700 px-4 py-2.5 sm:px-6 shadow-md transition-all animate-in slide-in-from-top duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-rose-700/80 rounded-lg shrink-0 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wide uppercase text-xs px-2 py-0.5 bg-rose-800 rounded">
                Civil Transit Emergency
              </span>
              <span className="text-xs text-rose-200">
                Issued {formatTime24(emergencyBroadcast.timestamp)}
              </span>
            </div>
            <p className="text-sm font-semibold mt-0.5">
              {emergencyBroadcast.headline}: <span className="font-normal text-rose-100">{emergencyBroadcast.message}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setEmergencyBroadcast(null)}
          className="text-rose-200 hover:text-white hover:bg-rose-700/60 p-1.5 rounded-lg transition-colors shrink-0"
          title="Dismiss emergency broadcast"
          aria-label="Dismiss emergency broadcast"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
