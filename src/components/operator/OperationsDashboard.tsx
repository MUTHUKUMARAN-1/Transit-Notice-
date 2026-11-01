import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Button } from '../ui/Button';
import { NoticeComposerModal } from './NoticeComposerModal';
import { IncidentLifecycleModal } from './IncidentLifecycleModal';
import { CommuterReportsQueue } from './CommuterReportsQueue';
import { 
  getSeverityDisplay, 
  formatRelativeTime 
} from '../../utils/transitFormatters';
import { 
  Plus, 
  AlertTriangle, 
  Activity, 
  Radio, 
  MessageSquare 
} from 'lucide-react';
import { TransitNotice } from '../../types/transit';

export const OperationsDashboard: React.FC = () => {
  const {
    notices,
    lines,
    reports,
    subscriptions,
    operatorRole
  } = useTransit();

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'incidents' | 'reports' | 'logs'>('incidents');

  // Operational metrics
  const activeNotices = notices.filter(n => n.status === 'active' || n.status === 'updating');
  const normalLinesCount = lines.filter(l => l.operationalStatus === 'good_service').length;
  const networkAvailabilityScore = Math.round((normalLinesCount / lines.length) * 100);
  const pendingReportsCount = reports.filter(r => r.status === 'received' || r.status === 'investigating').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Controller Status */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Operations Control Center • Active Dispatch
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
            Incident Command & Advisory Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Logged in as <strong className="text-white">{operatorRole}</strong>. Changes synchronize to Passenger Web Portal and GTFS-RT feed.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsComposerOpen(true)}
          >
            Create Advisory Notice
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Disruptions</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {activeNotices.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Across {lines.length - normalLinesCount} impacted routes
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Service Availability</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {networkAvailabilityScore}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {normalLinesCount} of {lines.length} lines on normal schedule
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Commuter Reports</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {pendingReportsCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Crowdsource items in triage queue
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Push Subscribers</span>
            <Radio className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {subscriptions.length * 1420 + 384}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Direct commuter broadcast reach
          </p>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('incidents')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors ${
            activeTab === 'incidents'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Active Incident Advisories ({activeNotices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors ${
            activeTab === 'reports'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Commuter Field Reports ({pendingReportsCount})</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'incidents' ? (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Operational Incident Registry
              </h2>
              <p className="text-xs text-slate-500">
                Click any record to manage status, escalate severity, or append official dispatcher logs.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Advisory ID</th>
                  <th className="py-3 px-4">Line & Corridor</th>
                  <th className="py-3 px-4">Incident Title</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Lifecycle</th>
                  <th className="py-3 px-4">Last Update</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {notices.map((notice: TransitNotice) => {
                  const severityStyle = getSeverityDisplay(notice.severity);
                  const noticeLines = lines.filter(l => notice.affectedLineIds.includes(l.id));

                  return (
                    <tr
                      key={notice.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedIncidentId(notice.id)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {notice.id}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {noticeLines.map(l => (
                            <span
                              key={l.id}
                              className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200"
                            >
                              <span
                                className="w-2 h-2 rounded-xs"
                                style={{ backgroundColor: l.color }}
                              />
                              <span>{l.code}</span>
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        {notice.title}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold border ${severityStyle.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${severityStyle.dotClass}`} />
                          <span>{severityStyle.label}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            notice.status === 'active'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : notice.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {notice.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap tabular-nums">
                        {formatRelativeTime(notice.lastUpdated)}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIncidentId(notice.id);
                          }}
                        >
                          Manage Incident
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <CommuterReportsQueue />
      )}

      {/* Composer Modal */}
      <NoticeComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
      />

      {/* Lifecycle Controller Modal */}
      <IncidentLifecycleModal
        noticeId={selectedIncidentId}
        onClose={() => setSelectedIncidentId(null)}
      />
    </div>
  );
};
