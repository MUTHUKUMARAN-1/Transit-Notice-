import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { getHealthDisplay } from '../../utils/transitFormatters';
import { Bell, BellOff, ArrowRight } from 'lucide-react';
import { TransitLine } from '../../types/transit';

interface LineStatusOverviewProps {
  onSelectLine: (lineId: string | null) => void;
  selectedLineId: string | null;
}

export const LineStatusOverview: React.FC<LineStatusOverviewProps> = ({
  onSelectLine,
  selectedLineId
}) => {
  const { lines, subscriptions, toggleSubscription } = useTransit();

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Metropolitan Network Lines</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {lines.length} Routes
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any line to filter notices, or toggle the bell icon to pin custom mobile/email notifications.
          </p>
        </div>

        {selectedLineId && (
          <button
            onClick={() => onSelectLine(null)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
          >
            Clear Line Filter
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {lines.map((line: TransitLine) => {
          const isSelected = selectedLineId === line.id;
          const health = getHealthDisplay(line.operationalStatus);
          const isSubscribed = subscriptions.some(s => s.lineId === line.id);

          return (
            <div
              key={line.id}
              className={`p-3.5 sm:px-5 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/60'
                  : 'hover:bg-slate-50'
              }`}
              onClick={() => onSelectLine(isSelected ? null : line.id)}
            >
              {/* Line indicator and name */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-3 h-8 rounded-sm shrink-0 shadow-2xs"
                  style={{ backgroundColor: line.color }}
                  aria-hidden="true"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {line.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {line.code}
                    </span>
                    <span className="text-[11px] text-slate-500 capitalize hidden sm:inline">
                      • {line.mode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {line.routeDescription}
                  </p>
                </div>
              </div>

              {/* Status and actions */}
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${health.bg} ${health.text} ${health.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${health.dotColor} shrink-0`} />
                  <span>{health.label}</span>
                </span>

                {/* Subscription quick toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSubscription(line.id);
                  }}
                  className={`p-1.5 rounded-lg border transition-all ${
                    isSubscribed
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-400 hover:text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  title={isSubscribed ? 'Subscribed to alerts for this line' : 'Subscribe to alerts for this line'}
                  aria-label={isSubscribed ? `Unsubscribe from ${line.name}` : `Subscribe to ${line.name}`}
                >
                  {isSubscribed ? (
                    <Bell className="w-4 h-4 fill-current" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </button>

                <ArrowRight className={`w-4 h-4 transition-transform hidden sm:block ${
                  isSelected ? 'text-blue-600 translate-x-1' : 'text-slate-300'
                }`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
