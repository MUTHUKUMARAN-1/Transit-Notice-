import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { Bell, BellRing, Smartphone, Trash2 } from 'lucide-react';
import { LineSubscription } from '../../types/transit';

export const MySubscriptionsPanel: React.FC = () => {
  const {
    lines,
    subscriptions,
    toggleSubscription,
    updateSubscription,
    showToast
  } = useTransit();

  const handleTestNotification = (lineName: string) => {
    showToast(
      `MCTA Alert: ${lineName}`,
      'Test notification delivered successfully. Service running normally.',
      'info'
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              My Transit Alert Subscriptions
            </h2>
            <p className="text-xs text-slate-500">
              Manage personal push and digest notifications for your daily commute lines.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          {subscriptions.length} Pinned
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {subscriptions.length === 0 ? (
          <div className="p-6 text-center text-slate-500 space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs">
              You haven't pinned any lines yet. Click the bell icon next to any route in the Network Lines list above to receive live alerts.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((sub: LineSubscription) => {
              const line = lines.find(l => l.id === sub.lineId);
              if (!line) return null;

              return (
                <div
                  key={sub.lineId}
                  className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-7 rounded-xs shrink-0"
                        style={{ backgroundColor: line.color }}
                      />
                      <div>
                        <span className="font-bold text-sm text-slate-900">
                          {line.name}
                        </span>
                        <span className="text-xs text-slate-500 block">
                          {line.routeDescription}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTestNotification(line.name)}
                        className="text-xs font-semibold px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                      >
                        Test Alert
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleSubscription(sub.lineId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded"
                        title="Remove subscription"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Notification preference toggles */}
                  <div className="flex flex-wrap items-center gap-3 text-xs pt-2 border-t border-slate-200/60">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sub.pushAlerts}
                        onChange={(e) =>
                          updateSubscription({ ...sub, pushAlerts: e.target.checked })
                        }
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-700 font-medium">Browser Push</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sub.notifyOnMinor}
                        onChange={(e) =>
                          updateSubscription({ ...sub, notifyOnMinor: e.target.checked })
                        }
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-700 font-medium">Include Minor Delays</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sub.notifyOnPlanned}
                        onChange={(e) =>
                          updateSubscription({ ...sub, notifyOnPlanned: e.target.checked })
                        }
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-700 font-medium">Planned Weekend Works</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
