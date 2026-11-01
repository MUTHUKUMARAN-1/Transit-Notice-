import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  RotateCcw, 
  Zap, 
  AlertTriangle, 
  ShieldCheck, 
  Database, 
  Download, 
  Upload, 
  CheckCircle2 
} from 'lucide-react';

interface SimulationControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationControlModal: React.FC<SimulationControlModalProps> = ({ isOpen, onClose }) => {
  const {
    notices,
    lines,
    reports,
    resetToBaseline,
    triggerSimulatedIncident,
    setEmergencyBroadcast,
    emergencyBroadcast,
    operatorRole,
    setOperatorRole,
    showToast
  } = useTransit();

  const [emergencyHeadline, setEmergencyHeadline] = useState('Severe Flash Flood Warning');
  const [emergencyText, setEmergencyText] = useState('All underground Metro lines held at stations due to storm runoff. Surface buses running diverted.');
  const [importJson, setImportJson] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  const handleTriggerEmergency = () => {
    setEmergencyBroadcast({
      headline: emergencyHeadline,
      message: emergencyText
    });
    onClose();
  };

  const handleExportState = () => {
    const data = {
      notices,
      lines,
      reports,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transitnotice-snapshot-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Snapshot Exported', 'Full JSON state downloaded to file.', 'success');
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (parsed.notices && Array.isArray(parsed.notices)) {
        localStorage.setItem('transitnotice_notices_v1', JSON.stringify(parsed.notices));
        if (parsed.lines) localStorage.setItem('transitnotice_lines_v1', JSON.stringify(parsed.lines));
        if (parsed.reports) localStorage.setItem('transitnotice_reports_v1', JSON.stringify(parsed.reports));
        window.location.reload();
      } else {
        alert('Invalid format: JSON must contain "notices" array');
      }
    } catch {
      alert('Invalid JSON syntax');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Platform Operations & Simulation Sandbox"
      subtitle="Interact with realistic scenario generators, audit backups, and dispatch roles"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Role Selector */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Active Dispatcher Identity
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              'Chief Operations Controller',
              'Line Dispatcher (Metro)',
              'Passenger Info Officer'
            ].map((role) => (
              <button
                key={role}
                onClick={() => setOperatorRole(role)}
                className={`text-xs p-2.5 rounded-md border text-left font-medium transition-all ${
                  operatorRole === role
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-semibold truncate">{role.split(' ')[0]}</span>
                </div>
                <span className="text-[11px] text-slate-500 block leading-tight">{role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Scenario Ingestion */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Live Scenario Controls
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 border border-slate-200 rounded-lg bg-white space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Simulate New Disruption</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Injects a random realistic trackside or equipment issue to test live recalculations.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-1"
                onClick={() => {
                  triggerSimulatedIncident();
                  onClose();
                }}
              >
                Inject Incident Notice
              </Button>
            </div>

            <div className="p-3.5 border border-slate-200 rounded-lg bg-white space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <RotateCcw className="w-4 h-4 text-blue-600" />
                <span>Reset to Baseline Data</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Restores standard verified schedule, clearing any custom mock notices or test items.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full mt-1"
                onClick={() => {
                  resetToBaseline();
                  onClose();
                }}
              >
                Restore Default Baseline
              </Button>
            </div>
          </div>
        </div>

        {/* Emergency System-Wide Override */}
        <div className="p-4 border border-rose-200 rounded-lg bg-rose-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-900 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Civil Emergency Broadcast Override</span>
            </div>
            {emergencyBroadcast?.active && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded">
                Currently Active
              </span>
            )}
          </div>
          <p className="text-xs text-rose-800 leading-relaxed">
            Pushes an emergency banner across all passenger interfaces, digital signage, and audio monitors.
          </p>
          
          <div className="space-y-2">
            <input
              type="text"
              value={emergencyHeadline}
              onChange={(e) => setEmergencyHeadline(e.target.value)}
              placeholder="Emergency Headline"
              className="w-full text-xs p-2 rounded border border-rose-300 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <textarea
              rows={2}
              value={emergencyText}
              onChange={(e) => setEmergencyText(e.target.value)}
              placeholder="Passenger advisory message..."
              className="w-full text-xs p-2 rounded border border-rose-300 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="danger"
              size="sm"
              onClick={handleTriggerEmergency}
              className="text-xs"
            >
              Push Emergency Banner
            </Button>
            {emergencyBroadcast?.active && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmergencyBroadcast(null);
                  onClose();
                }}
                className="text-xs"
              >
                Clear Override
              </Button>
            )}
          </div>
        </div>

        {/* Persistence & Data Portability */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Database className="w-4 h-4 text-slate-600" />
              <span>Platform State Storage & Backup</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>LocalStorage persistent</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Currently tracking: <strong className="text-slate-800">{notices.length}</strong> notices,{' '}
            <strong className="text-slate-800">{lines.length}</strong> transit lines,{' '}
            <strong className="text-slate-800">{reports.length}</strong> commuter reports.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleExportState}
            >
              Export JSON Backup
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<Upload className="w-3.5 h-3.5" />}
              onClick={() => setShowImportBox(!showImportBox)}
            >
              Import JSON
            </Button>
          </div>

          {showImportBox && (
            <div className="pt-2 space-y-2 animate-in fade-in duration-200">
              <textarea
                rows={3}
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="Paste valid TransitNotice JSON snapshot..."
                className="w-full text-xs font-mono p-2 border border-slate-300 rounded bg-white"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleImportJson}
                disabled={!importJson.trim()}
              >
                Load Snapshot into Storage
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
