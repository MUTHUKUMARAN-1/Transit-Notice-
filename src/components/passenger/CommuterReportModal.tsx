import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CommuterReport } from '../../types/transit';

interface CommuterReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommuterReportModal: React.FC<CommuterReportModalProps> = ({ isOpen, onClose }) => {
  const { lines, stations, submitCommuterReport } = useTransit();

  const [lineId, setLineId] = useState(lines[0]?.id || 'L-RED');
  const [stationId, setStationId] = useState('');
  const [issueType, setIssueType] = useState<CommuterReport['issueType']>('delay');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');

  const selectedLine = lines.find(l => l.id === lineId);
  const eligibleStations = stations.filter(s => selectedLine?.stationIds.includes(s.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitCommuterReport({
      lineId,
      stationId: stationId || undefined,
      issueType,
      description: description.trim(),
      reporterName: reporterName.trim() || 'Anonymous Commuter'
    });

    setDescription('');
    setStationId('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report a Service Condition or Delay"
      subtitle="Your feedback helps Transit Operations controllers verify field conditions in real-time."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Affected Transit Line *
          </label>
          <select
            value={lineId}
            onChange={(e) => {
              setLineId(e.target.value);
              setStationId('');
            }}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {lines.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.mode.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Station / Location (Optional)
          </label>
          <select
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- General Line Observation --</option>
            {eligibleStations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Issue Category *
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: 'delay', label: 'Unscheduled Delay' },
              { id: 'overcrowding', label: 'Platform Overcrowding' },
              { id: 'elevator_fault', label: 'Elevator / Lift Outage' },
              { id: 'audio_fault', label: 'Audio / PA Inaudible' },
              { id: 'cleanliness', label: 'Cleanliness / Hazard' },
              { id: 'safety', label: 'Safety Concern' }
            ].map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setIssueType(cat.id as CommuterReport['issueType'])}
                className={`p-2 rounded-md border text-left font-medium transition-colors ${
                  issueType === cat.id
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Description of Condition *
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g., Westbound train held at red signal for 10 minutes, conductor announcement says awaiting single track clearance..."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Your Name or Commuter ID (Optional)
          </label>
          <input
            type="text"
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
            placeholder="E.g., Marcus T. or leave blank for Anonymous"
            className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={!description.trim()}>
            Submit to Operations
          </Button>
        </div>
      </form>
    </Modal>
  );
};
