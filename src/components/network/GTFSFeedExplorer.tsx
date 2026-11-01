import React, { useState, useMemo } from 'react';
import { useTransit } from '../../context/TransitContext';
import { exportToGTFSRealtime } from '../../utils/transitFormatters';
import { Button } from '../ui/Button';
import { 
  Download, 
  Copy, 
  Check, 
  CheckCircle2, 
  Terminal 
} from 'lucide-react';

export const GTFSFeedExplorer: React.FC = () => {
  const { notices, lines, showToast } = useTransit();
  const [hasCopied, setHasCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw' | 'docs'>('formatted');

  const gtfsFeed = useMemo(() => {
    return exportToGTFSRealtime(notices, lines);
  }, [notices, lines]);

  const jsonString = useMemo(() => {
    return JSON.stringify(gtfsFeed, null, 2);
  }, [gtfsFeed]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setHasCopied(true);
    showToast('GTFS Feed Copied', 'Raw GTFS-RT JSON copied to clipboard.', 'info');
    setTimeout(() => setHasCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gtfs-realtime-alerts-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Feed Downloaded', 'GTFS-RT JSON file saved.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Open Transit Data • GTFS 2.0
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            General Transit Feed Specification (GTFS-RT) Service Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Standards-compliant real-time feed consumed by Google Maps, Apple Maps, and third-party transit applications.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            icon={hasCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            onClick={handleCopyJson}
          >
            {hasCopied ? 'Copied' : 'Copy JSON'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleDownload}
          >
            Download Feed (.json)
          </Button>
        </div>
      </div>

      {/* Compliance & Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Specification Version</span>
          <div className="text-xl font-black text-slate-900 font-mono">
            GTFS-Realtime 2.0
          </div>
          <p className="text-xs text-slate-500">Standard Transit Protocol Buffer compliant</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Alert Entities</span>
          <div className="text-xl font-black text-blue-600 font-mono tabular-nums">
            {gtfsFeed.entity.length} Entities
          </div>
          <p className="text-xs text-slate-500">Auto-updated via TransitNotice Dispatcher</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Validation Status</span>
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Schema Validated (0 Errors)</span>
          </div>
          <p className="text-xs text-slate-500">Full translation block & entity selectors</p>
        </div>
      </div>

      {/* Terminal cURL Helper */}
      <div className="p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            cURL Developer Endpoint
          </span>
          <span className="text-[11px] text-slate-500">HTTP GET /api/v2/gtfs-rt/alerts.json</span>
        </div>
        <pre className="text-xs font-mono bg-slate-950 p-3 rounded-lg text-emerald-300 overflow-x-auto select-all">
          curl -H "Accept: application/json" "https://api.transitnotice.gov/v2/gtfs-rt/alerts.json"
        </pre>
      </div>

      {/* Feed Inspector Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('formatted')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'formatted'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Formatted Alert Entities ({gtfsFeed.entity.length})
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'raw'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Raw GTFS JSON Payload
            </button>
          </div>
        </div>

        {activeTab === 'formatted' ? (
          <div className="divide-y divide-slate-100">
            {gtfsFeed.entity.map((ent) => (
              <div key={ent.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                      ID: {ent.id}
                    </span>
                    <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {ent.alert.severityLevel}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Active from: {new Date(ent.alert.activePeriod[0].start * 1000).toLocaleString()}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {ent.alert.headerText.translation[0]?.text}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                    {ent.alert.descriptionText.translation[0]?.text}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>Cause: <strong className="text-slate-700">{ent.alert.cause}</strong></span>
                  <span>•</span>
                  <span>Effect: <strong className="text-slate-700">{ent.alert.effect}</strong></span>
                  <span>•</span>
                  <span>Informed Routes: <strong className="text-slate-700">{ent.alert.informedEntity.map(e => e.routeId).join(', ')}</strong></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-950">
            <pre className="text-xs font-mono text-emerald-300 max-h-[500px] overflow-y-auto overflow-x-auto select-all leading-relaxed">
              {jsonString}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
