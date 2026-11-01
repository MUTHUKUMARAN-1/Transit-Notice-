import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  DisruptionSeverity, 
  AdvisoryCategory, 
  BroadcastChannels 
} from '../../types/transit';
import { Eye, Check } from 'lucide-react';

interface NoticeComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLineId?: string;
}

export const NoticeComposerModal: React.FC<NoticeComposerModalProps> = ({
  isOpen,
  onClose,
  initialLineId
}) => {
  const { lines, stations, createNotice } = useTransit();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [detail, setDetail] = useState('');
  const [severity, setSeverity] = useState<DisruptionSeverity>('moderate');
  const [category, setCategory] = useState<AdvisoryCategory>('delays');
  const [selectedLines, setSelectedLines] = useState<string[]>(
    initialLineId ? [initialLineId] : [lines[0]?.id || 'L-RED']
  );
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [cause, setCause] = useState('Trackside telemetry anomaly');
  const [effect, setEffect] = useState('Reduced frequency and single-track sequencing');
  const [alternativeAdvice, setAlternativeAdvice] = useState('');
  const [broadcastChannels, setBroadcastChannels] = useState<BroadcastChannels>({
    webPortal: true,
    stationSignage: true,
    passengerPush: true,
    gtfsRealtime: true,
    operatorAuditFeed: true
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const handleLineToggle = (lineId: string) => {
    setSelectedLines(prev => 
      prev.includes(lineId) 
        ? (prev.length > 1 ? prev.filter(id => id !== lineId) : prev) 
        : [...prev, lineId]
    );
  };

  const handleStationToggle = (stationId: string) => {
    setSelectedStations(prev => 
      prev.includes(stationId)
        ? prev.filter(id => id !== stationId)
        : [...prev, stationId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || selectedLines.length === 0) return;

    createNotice({
      title: title.trim(),
      summary: summary.trim(),
      detail: detail.trim() || summary.trim(),
      severity,
      category,
      status: 'active',
      affectedLineIds: selectedLines,
      affectedStationIds: selectedStations,
      startTime: new Date().toISOString(),
      cause: cause.trim(),
      effect: effect.trim(),
      alternativeAdvice: alternativeAdvice.trim() || undefined,
      broadcastChannels,
      priorityOrder: severity === 'severe' || severity === 'suspended' ? 1 : 2
    });

    onClose();
  };

  // Pre-fill quick template helper
  const applyTemplate = (type: 'signal' | 'door' | 'weather') => {
    if (type === 'signal') {
      setTitle('Red Line: Interlocking Automation Reset at Financial District');
      setSummary('Trains held momentarily while signal computers perform automated reset cycle.');
      setDetail('Supervisory control system detected transient voltage loss. Signals restored to normal operating state. Expect 4-6 minute residual spacing.');
      setSeverity('minor');
      setCategory('delays');
      setCause('Transient substation voltage drop');
      setEffect('4-6 min headway spacing');
      setAlternativeAdvice('Commuters connecting to Commuter Rail at Central should allow 5 extra minutes.');
    } else if (type === 'door') {
      setTitle('Blue Line: Platform Screen Gate Fault at Airport T1');
      setSummary('Eastbound departures docking at Platform 2 only. Platform marshals assisting.');
      setDetail('Contractor maintenance team recalibrating optical screen gate sensors. All scheduled departures operating.');
      setSeverity('minor');
      setCategory('delays');
      setCause('Obstacle detection infrared tolerance misalignment');
      setEffect('Eastbound departures consolidated onto Platform 2');
      setAlternativeAdvice('Follow overhead yellow directional signs at Airport Concourse.');
    } else if (type === 'weather') {
      setTitle('Regional Transit: High Wind Speed Restrictions on Elevated Viaducts');
      setSummary('Elevated rail speed capped at 40 km/h due to gusting winds. 8-12 min delays.');
      setDetail('Met Office issued wind advisory exceeding 65 km/h. Automated train speed governors enforced on bridge and viaduct sections for passenger safety.');
      setSeverity('moderate');
      setCategory('weather');
      setCause('Sustained wind gusts exceeding safety threshold');
      setEffect('Viaduct speed restrictions');
      setAlternativeAdvice('Underground metro segments unaffected.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dispatch Incident Advisory Composer"
      subtitle="Publish verified notices to Passenger Portal, Station Signage, and GTFS-Realtime"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Sub-header: Quick Template Pills & Edit/Preview tab */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-500">Quick Incident Templates:</span>
            <button
              type="button"
              onClick={() => applyTemplate('signal')}
              className="text-xs px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium"
            >
              Signal Reset
            </button>
            <button
              type="button"
              onClick={() => applyTemplate('door')}
              className="text-xs px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium"
            >
              Door Sensor
            </button>
            <button
              type="button"
              onClick={() => applyTemplate('weather')}
              className="text-xs px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium"
            >
              High Wind
            </button>
          </div>

          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`text-xs px-3 py-1 rounded-md font-semibold transition-all ${
                activeTab === 'edit'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Composer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`text-xs px-3 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Passenger Preview</span>
            </button>
          </div>
        </div>

        {activeTab === 'edit' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Advisory Headline / Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Green Line: Track Circuit Maintenance between Civic and Med Center"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Severity & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Disruption Severity *
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as DisruptionSeverity)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="minor">Minor Disruption (3-7 min delays)</option>
                  <option value="moderate">Moderate Disruption (8-15 min delays)</option>
                  <option value="severe">Severe Disruption (15-30+ min delays)</option>
                  <option value="suspended">Service Suspended (No trains operating)</option>
                  <option value="info">Informational Advisory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Advisory Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AdvisoryCategory)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="delays">Track & Speed Delays</option>
                  <option value="maintenance">Infrastructure & Maintenance</option>
                  <option value="station_closure">Station / Platform Closure</option>
                  <option value="elevator">Elevator / Accessibility Outage</option>
                  <option value="weather">Severe Weather Condition</option>
                  <option value="crowding">Special Event & Overcrowding</option>
                </select>
              </div>
            </div>

            {/* Affected Lines Multi-Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Impacted Transit Lines (Select all that apply) *
              </label>
              <div className="flex flex-wrap gap-2">
                {lines.map((line) => {
                  const isSelected = selectedLines.includes(line.id);
                  return (
                    <button
                      type="button"
                      key={line.id}
                      onClick={() => handleLineToggle(line.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-xs shrink-0"
                        style={{ backgroundColor: line.color }}
                      />
                      <span>{line.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 ml-1 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Affected Stations Multi-Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Impacted Stations / Terminals (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                {stations.map((st) => {
                  const isSelected = selectedStations.includes(st.id);
                  return (
                    <button
                      type="button"
                      key={st.id}
                      onClick={() => handleStationToggle(st.id)}
                      className={`text-[11px] px-2 py-0.5 rounded font-medium border transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st.name} ({st.code})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Passenger Headline Summary *
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Concise summary shown on mobile app feeds and station monitors..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Operations Detail & Alternative Advice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Root Cause
                </label>
                <input
                  type="text"
                  value={cause}
                  onChange={(e) => setCause(e.target.value)}
                  placeholder="E.g., Automated signal failsafe trip"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Effect
                </label>
                <input
                  type="text"
                  value={effect}
                  onChange={(e) => setEffect(e.target.value)}
                  placeholder="E.g., 10-15 minute headway widening"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Alternative Commuter Guidance */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Alternative Commuter Routing Advice
              </label>
              <textarea
                rows={2}
                value={alternativeAdvice}
                onChange={(e) => setAlternativeAdvice(e.target.value)}
                placeholder="E.g., Passengers for University Square should transfer to Bus 42 at Central Concourse Bay 3..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Broadcast Channel Toggles */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Target Broadcast Channels
              </span>
              <div className="flex flex-wrap gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={broadcastChannels.webPortal}
                    onChange={(e) => setBroadcastChannels({ ...broadcastChannels, webPortal: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Web Portal</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={broadcastChannels.stationSignage}
                    onChange={(e) => setBroadcastChannels({ ...broadcastChannels, stationSignage: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Station Displays</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={broadcastChannels.gtfsRealtime}
                    onChange={(e) => setBroadcastChannels({ ...broadcastChannels, gtfsRealtime: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>GTFS-RT Feed</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={broadcastChannels.passengerPush}
                    onChange={(e) => setBroadcastChannels({ ...broadcastChannels, passengerPush: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Push Alerts</span>
                </label>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={!title.trim() || !summary.trim()}>
                Publish Advisory Broadcast
              </Button>
            </div>
          </form>
        ) : (
          /* Preview Tab */
          <div className="space-y-4 p-4 border border-slate-200 rounded-xl bg-slate-50/70">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Live Passenger Presentation Preview
            </span>

            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  {severity.toUpperCase()} DISRUPTION
                </span>
                <span className="text-xs text-slate-400">Preview ID: ADV-PREVIEW</span>
              </div>

              <h4 className="text-base font-bold text-slate-900">
                {title || 'Untitled Advisory'}
              </h4>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {summary || 'No summary text entered yet.'}
              </p>

              {alternativeAdvice && (
                <div className="p-2.5 rounded bg-blue-50 text-blue-900 border border-blue-200 text-xs font-medium">
                  <strong>Alternative Route Advice:</strong> {alternativeAdvice}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setActiveTab('edit')}>
                Back to Edit
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
