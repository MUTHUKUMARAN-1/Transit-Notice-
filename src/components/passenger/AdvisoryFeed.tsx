import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { 
  getSeverityDisplay, 
  formatRelativeTime 
} from '../../utils/transitFormatters';
import { TransitNotice, TransitMode, DisruptionSeverity } from '../../types/transit';
import { 
  ChevronRight, 
  Filter, 
  CheckCircle2, 
  Train, 
  Bus, 
  Sailboat, 
  Compass 
} from 'lucide-react';

interface AdvisoryFeedProps {
  onSelectNotice: (id: string) => void;
  selectedLineId: string | null;
}

export const AdvisoryFeed: React.FC<AdvisoryFeedProps> = ({
  onSelectNotice,
  selectedLineId
}) => {
  const {
    notices,
    lines,
    stations,
    filterMode,
    setFilterMode,
    filterSeverity,
    setFilterSeverity,
    searchQuery,
    setSearchQuery
  } = useTransit();

  // Mode tabs
  const modeOptions: Array<{ id: TransitMode | 'all'; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'All Modes', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'metro', label: 'Metro', icon: <Train className="w-3.5 h-3.5" /> },
    { id: 'bus', label: 'Bus', icon: <Bus className="w-3.5 h-3.5" /> },
    { id: 'rail', label: 'Rail', icon: <Train className="w-3.5 h-3.5" /> },
    { id: 'ferry', label: 'Ferry', icon: <Sailboat className="w-3.5 h-3.5" /> }
  ];

  // Severity filter options
  const severityOptions: Array<{ id: DisruptionSeverity | 'all'; label: string }> = [
    { id: 'all', label: 'All Severities' },
    { id: 'severe', label: 'Severe / Suspended' },
    { id: 'moderate', label: 'Moderate' },
    { id: 'minor', label: 'Minor' },
    { id: 'info', label: 'Informational' }
  ];

  // Filter notices
  const filteredNotices = notices.filter((notice) => {
    // Status must be active or resolving
    if (notice.status === 'archived' || notice.status === 'resolved') {
      return false;
    }

    // Line filter from parent
    if (selectedLineId && !notice.affectedLineIds.includes(selectedLineId)) {
      return false;
    }

    // Mode filter
    if (filterMode !== 'all') {
      const noticeModes = lines
        .filter(l => notice.affectedLineIds.includes(l.id))
        .map(l => l.mode);
      if (!noticeModes.includes(filterMode)) return false;
    }

    // Severity filter
    if (filterSeverity !== 'all') {
      if (filterSeverity === 'severe') {
        if (notice.severity !== 'severe' && notice.severity !== 'suspended') return false;
      } else if (notice.severity !== filterSeverity) {
        return false;
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const lineNames = lines
        .filter(l => notice.affectedLineIds.includes(l.id))
        .map(l => l.name.toLowerCase())
        .join(' ');
      const stationNames = stations
        .filter(s => notice.affectedStationIds.includes(s.id))
        .map(s => s.name.toLowerCase())
        .join(' ');

      const matchesText =
        notice.id.toLowerCase().includes(q) ||
        notice.title.toLowerCase().includes(q) ||
        notice.summary.toLowerCase().includes(q) ||
        notice.detail.toLowerCase().includes(q) ||
        notice.cause.toLowerCase().includes(q) ||
        lineNames.includes(q) ||
        stationNames.includes(q);

      if (!matchesText) return false;
    }

    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Feed Filters Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Live Service Advisories & Disruption Notices</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {filteredNotices.length} Active
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified passenger announcements issued by Central Operations Controllers.
            </p>
          </div>

          {(filterMode !== 'all' || filterSeverity !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setFilterMode('all');
                setFilterSeverity('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Modes */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {modeOptions.map((opt) => {
              const isActive = filterMode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setFilterMode(opt.id)}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Severities */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Severity:
            </span>
            {severityOptions.map((opt) => {
              const isActive = filterSeverity === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setFilterSeverity(opt.id)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all font-medium ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notice List */}
      <div className="divide-y divide-slate-100">
        {filteredNotices.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              No Active Advisories Matching Current Filter
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All routes in this selection are operating normally with scheduled timetables.
            </p>
          </div>
        ) : (
          filteredNotices.map((notice: TransitNotice) => {
            const severityStyle = getSeverityDisplay(notice.severity);
            const noticeLines = lines.filter(l => notice.affectedLineIds.includes(l.id));

            return (
              <div
                key={notice.id}
                onClick={() => onSelectNotice(notice.id)}
                className="p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Header tags */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      {noticeLines.map((line) => (
                        <span
                          key={line.id}
                          className="inline-flex items-center gap-1.5 font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-xs shrink-0"
                            style={{ backgroundColor: line.color }}
                          />
                          <span>{line.name}</span>
                        </span>
                      ))}

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold border ${severityStyle.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${severityStyle.dotClass}`} />
                        <span>{severityStyle.label}</span>
                      </span>

                      <span className="text-slate-400 text-[11px] tabular-nums">
                        Updated {formatRelativeTime(notice.lastUpdated)}
                      </span>
                    </div>

                    {/* Notice Title & Summary */}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {notice.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed line-clamp-2">
                        {notice.summary}
                      </p>
                    </div>

                    {/* Alternative Advice Callout Snippet */}
                    {notice.alternativeAdvice && (
                      <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-900 bg-blue-50/80 px-2.5 py-1 rounded border border-blue-200/60 max-w-xl truncate">
                        <span className="font-bold text-[10px] uppercase tracking-wide bg-blue-200/70 text-blue-800 px-1.5 py-0.2 rounded">
                          Alt Route
                        </span>
                        <span className="truncate">{notice.alternativeAdvice}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Arrow */}
                  <div className="shrink-0 pt-2">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all text-slate-500">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
