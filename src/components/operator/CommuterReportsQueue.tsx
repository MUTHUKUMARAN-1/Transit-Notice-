import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Button } from '../ui/Button';
import { 
  ThumbsUp, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/transitFormatters';
import { CommuterReport } from '../../types/transit';

export const CommuterReportsQueue: React.FC = () => {
  const {
    reports,
    lines,
    stations,
    updateReportStatus,
    convertReportToNotice,
    upvoteCommuterReport
  } = useTransit();

  const [statusFilter, setStatusFilter] = useState<'all' | CommuterReport['status']>('all');

  const filteredReports = reports.filter(r => 
    statusFilter === 'all' ? true : r.status === statusFilter
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Passenger Crowdsource Triage Desk</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {reports.filter(r => r.status === 'received' || r.status === 'investigating').length} Pending Review
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Field reports submitted by daily commuters awaiting operational verification.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          {(['all', 'received', 'investigating', 'verified_notice_created', 'dismissed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md font-medium capitalize transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No passenger reports in this status.
          </div>
        ) : (
          filteredReports.map((report) => {
            const line = lines.find(l => l.id === report.lineId);
            const station = stations.find(s => s.id === report.stationId);

            return (
              <div
                key={report.id}
                className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-mono text-slate-400 font-semibold text-[11px]">
                      {report.id}
                    </span>

                    {line && (
                      <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                        <span
                          className="w-2 h-2 rounded-xs"
                          style={{ backgroundColor: line.color }}
                        />
                        <span>{line.name}</span>
                      </span>
                    )}

                    {station && (
                      <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {station.name}
                      </span>
                    )}

                    <span className="capitalize text-slate-600 font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[11px]">
                      {report.issueType.replace('_', ' ')}
                    </span>

                    <span className="text-slate-400 text-[11px] tabular-nums">
                      {formatRelativeTime(report.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
                    "{report.description}"
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                    <span>Reported by: <strong className="text-slate-700">{report.reporterName || 'Commuter'}</strong></span>
                    <span>•</span>
                    <button
                      onClick={() => upvoteCommuterReport(report.id)}
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
                      title="Upvote / confirm report"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />
                      <span>{report.upvotes} Confirmations</span>
                    </button>
                    <span>•</span>
                    <span className="font-semibold uppercase text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      Status: {report.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Dispatcher Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                  {report.status !== 'verified_notice_created' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      onClick={() => convertReportToNotice(report.id)}
                    >
                      Convert to Notice
                    </Button>
                  )}

                  {report.status === 'received' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => updateReportStatus(report.id, 'investigating')}
                    >
                      Investigate
                    </Button>
                  )}

                  {report.status !== 'dismissed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<XCircle className="w-3.5 h-3.5" />}
                      onClick={() => updateReportStatus(report.id, 'dismissed')}
                    >
                      Dismiss
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
