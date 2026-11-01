import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { 
  Navigation, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';

export const RouteImpactChecker: React.FC = () => {
  const { stations, lines, notices, setSelectedNoticeId } = useTransit();

  const [originId, setOriginId] = useState('ST-AIRPORT-T1');
  const [destinationId, setDestinationId] = useState('ST-MED');

  const originStation = stations.find(s => s.id === originId);
  const destStation = stations.find(s => s.id === destinationId);

  // Find direct or transfer lines between origin and destination
  const originLines = lines.filter(l => originStation?.lineIds.includes(l.id));
  const destLines = lines.filter(l => destStation?.lineIds.includes(l.id));

  // Find direct lines
  const directLines = originLines.filter(ol => destLines.some(dl => dl.id === ol.id));

  // Determine impacted lines
  const candidateLineIds = directLines.length > 0 
    ? directLines.map(l => l.id) 
    : [...originLines.map(l => l.id), ...destLines.map(l => l.id)];

  const activeImpactingNotices = notices.filter(n => 
    n.status === 'active' &&
    n.affectedLineIds.some(lId => candidateLineIds.includes(lId))
  );

  const isImpacted = activeImpactingNotices.length > 0;

  const handleSwap = () => {
    const temp = originId;
    setOriginId(destinationId);
    setDestinationId(temp);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Check Commute Journey Status
            </h2>
            <p className="text-xs text-slate-500">
              Verify if scheduled track maintenance or operational alerts will impact your trip.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Station Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Departing Station (Origin)
            </label>
            <select
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id} disabled={s.id === destinationId}>
                  {s.name} ({s.code}) - Zone {s.zone}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Swap Origin and Destination"
            >
              <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
            </button>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Arriving Station (Destination)
            </label>
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id} disabled={s.id === originId}>
                  {s.name} ({s.code}) - Zone {s.zone}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Box */}
        {originStation && destStation && (
          <div
            className={`p-4 rounded-xl border transition-all ${
              isImpacted
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {isImpacted ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold">
                    {isImpacted
                      ? 'Advisory Alert Affects This Journey'
                      : 'Clear Route — All Lines Running on Schedule'}
                  </h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/80 border border-current">
                    {directLines.length > 0 ? 'Direct Route' : 'Transfer at Central'}
                  </span>
                </div>

                <p className="text-xs leading-relaxed">
                  {isImpacted
                    ? `One or more lines along your planned journey between ${originStation?.name} and ${destStation?.name} have active service advisories.`
                    : `No disruptions currently reported between ${originStation?.name} and ${destStation?.name}. Estimated journey duration: ~18-24 minutes.`}
                </p>

                {isImpacted && (
                  <div className="pt-2 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider block text-amber-900">
                      Active Notice Details & Detours:
                    </span>
                    {activeImpactingNotices.map((notice) => (
                      <div
                        key={notice.id}
                        onClick={() => setSelectedNoticeId(notice.id)}
                        className="p-2.5 rounded-lg bg-white border border-amber-200/90 text-xs shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{notice.title}</span>
                          <span className="text-blue-600 hover:underline">View Details →</span>
                        </div>
                        {notice.alternativeAdvice && (
                          <p className="text-amber-900 font-medium mt-1">
                            💡 Advice: {notice.alternativeAdvice}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
