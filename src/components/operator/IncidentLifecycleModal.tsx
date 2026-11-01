import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  DisruptionSeverity 
} from '../../types/transit';
import { 
  formatRelativeTime, 
  formatTime24, 
  formatDateDisplay 
} from '../../utils/transitFormatters';
import { 
  CheckCircle2, 
  Plus, 
  ShieldCheck, 
  Trash2 
} from 'lucide-react';

interface IncidentLifecycleModalProps {
  noticeId: string | null;
  onClose: () => void;
}

export const IncidentLifecycleModal: React.FC<IncidentLifecycleModalProps> = ({
  noticeId,
  onClose
}) => {
  const {
    notices,
    lines,
    updateNotice,
    addIncidentUpdate,
    resolveNotice,
    deleteNotice,
    operatorRole
  } = useTransit();

  const [newLogMessage, setNewLogMessage] = useState('');
  const [newLogAction, setNewLogAction] = useState('');
  const [resolutionNote, setResolutionNote] = useState('All track circuits inspected and verified clear. Trains resuming scheduled speed.');
  const [showResolveBox, setShowResolveBox] = useState(false);

  const notice = notices.find(n => n.id === noticeId);
  if (!notice) return null;

  const noticeLines = lines.filter(l => notice.affectedLineIds.includes(l.id));

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogMessage.trim()) return;

    addIncidentUpdate(notice.id, newLogMessage.trim(), newLogAction.trim() || undefined);
    setNewLogMessage('');
    setNewLogAction('');
  };

  const handleResolve = () => {
    if (!resolutionNote.trim()) return;
    resolveNotice(notice.id, resolutionNote.trim());
    onClose();
  };

  const handleSeverityChange = (newSev: DisruptionSeverity) => {
    updateNotice(notice.id, { severity: newSev });
    addIncidentUpdate(notice.id, `Severity reclassified to ${newSev.toUpperCase()}`);
  };

  return (
    <Modal
      isOpen={Boolean(noticeId)}
      onClose={onClose}
      title={`Incident Control & Dispatcher Log: ${notice.id}`}
      subtitle={`Created ${formatRelativeTime(notice.startTime)} • Current Status: ${notice.status.toUpperCase()}`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Incident Summary Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-slate-900">{notice.title}</h3>
            <div className="flex items-center gap-1.5">
              {noticeLines.map(l => (
                <span
                  key={l.id}
                  className="text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200"
                >
                  {l.name}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{notice.summary}</p>
        </div>

        {/* Severity & Quick Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Severity Classification:</span>
            <select
              value={notice.severity}
              onChange={(e) => handleSeverityChange(e.target.value as DisruptionSeverity)}
              className="p-1 rounded border border-slate-300 font-semibold bg-white"
            >
              <option value="minor">Minor Disruption</option>
              <option value="moderate">Moderate Disruption</option>
              <option value="severe">Severe Disruption</option>
              <option value="suspended">Service Suspended</option>
              <option value="info">Informational</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {notice.status !== 'resolved' && (
              <Button
                variant="primary"
                size="sm"
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                onClick={() => setShowResolveBox(!showResolveBox)}
              >
                Mark Resolved
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => {
                deleteNotice(notice.id);
                onClose();
              }}
            >
              Archive
            </Button>
          </div>
        </div>

        {/* Resolution Prompt */}
        {showResolveBox && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Incident Resolution Debrief Note</span>
            </div>
            <textarea
              rows={2}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="State restoration details (e.g. tracks inspected, scheduled timetables resumed)..."
              className="w-full text-xs p-2 rounded border border-emerald-300 bg-white"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowResolveBox(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleResolve}>
                Confirm Incident Resolution
              </Button>
            </div>
          </div>
        )}

        {/* Append Operational Log */}
        <form onSubmit={handleAddLog} className="p-4 border border-slate-200 rounded-lg bg-slate-50/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Append Dispatcher Incident Update ({operatorRole})</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={newLogMessage}
              onChange={(e) => setNewLogMessage(e.target.value)}
              placeholder="Dispatcher report update / situation progress..."
              className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
              required
            />
            <input
              type="text"
              value={newLogAction}
              onChange={(e) => setNewLogAction(e.target.value)}
              placeholder="Action taken (e.g. Dispatched technician Crew 2)..."
              className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              disabled={!newLogMessage.trim()}
            >
              Post Operational Update
            </Button>
          </div>
        </form>

        {/* Chronological Log Stream */}
        <div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Operational Audit Trail ({notice.updates.length} Updates)
          </span>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {notice.updates.map((up) => (
              <div
                key={up.id}
                className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="font-semibold text-slate-800">{up.authorRole}</span>
                  <span className="tabular-nums">
                    {formatDateDisplay(up.timestamp)} at {formatTime24(up.timestamp)}
                  </span>
                </div>
                <p className="text-slate-900 font-medium">{up.message}</p>
                {up.actionTaken && (
                  <p className="text-blue-800 text-[11px] font-medium">
                    ↳ Action: {up.actionTaken}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Controller Panel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
