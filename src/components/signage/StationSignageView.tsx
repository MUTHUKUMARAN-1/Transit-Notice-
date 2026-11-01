import React, { useState, useMemo, useEffect } from 'react';
import { useTransit } from '../../context/TransitContext';
import { generateDeparturesForStation } from '../../utils/transitFormatters';
import { audioAnnouncer } from '../../utils/audioAnnouncer';
import { 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Radio, 
  CheckCircle2, 
  Accessibility 
} from 'lucide-react';
import { LiveDeparture } from '../../types/transit';

export const StationSignageView: React.FC = () => {
  const {
    stations,
    lines,
    notices,
    currentTime,
    selectedStationId,
    setSelectedStationId,
    emergencyBroadcast
  } = useTransit();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeAdvisoryIndex, setActiveAdvisoryIndex] = useState(0);

  const currentStation = stations.find(s => s.id === (selectedStationId || 'ST-CENTRAL')) || stations[0];

  const departures = useMemo(() => {
    return generateDeparturesForStation(currentStation, lines, notices, currentTime);
  }, [currentStation, lines, notices, currentTime]);

  const activeNotices = notices.filter(n => 
    n.status === 'active' && 
    (n.affectedStationIds.includes(currentStation.id) || n.affectedLineIds.some(lId => currentStation.lineIds.includes(lId)))
  );

  // Cycle ticker every 8 seconds
  useEffect(() => {
    if (activeNotices.length <= 1) return;
    const interval = setInterval(() => {
      setActiveAdvisoryIndex(prev => (prev + 1) % activeNotices.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [activeNotices.length]);

  const handleAudioAnnouncement = async () => {
    if (isPlayingAudio) {
      audioAnnouncer.stop();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const topDeparture = departures[0];
    const topNotice = activeNotices[0];

    let spoken = `Attention all passengers at ${currentStation.name}. `;
    if (emergencyBroadcast?.active) {
      spoken += `Emergency advisory: ${emergencyBroadcast.headline}. ${emergencyBroadcast.message}`;
    } else if (topNotice) {
      spoken += `Service advisory: ${topNotice.title}. ${topNotice.summary}. ${topNotice.alternativeAdvice || ''}`;
    } else if (topDeparture) {
      spoken += `The next service from ${topDeparture.platform} is for ${topDeparture.destination}, departing in ${topDeparture.minutesAway} minutes.`;
    } else {
      spoken += `All scheduled services are running normally.`;
    }

    try {
      await audioAnnouncer.announceNotice(spoken);
    } catch {
      console.warn('Audio announce failed');
    } finally {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden font-sans">
      {/* Top Station Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg border border-blue-400/30">
            {currentStation.code}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                {currentStation.name}
              </h1>
              <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                Zone {currentStation.zone}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              MetroConnect Transit Authority • Passenger Information Display System (PIDS)
            </p>
          </div>
        </div>

        {/* Station Switcher & Audio Chime */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Station Display:</span>
            <select
              value={currentStation.id}
              onChange={(e) => setSelectedStationId(e.target.value)}
              className="text-xs font-bold bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAudioAnnouncement}
            className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg border transition-all ${
              isPlayingAudio
                ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                : 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border-slate-700'
            }`}
            title="Play Station PA Chime & Voice"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Play Station Chime</span>
              </>
            )}
          </button>

          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-sm font-mono font-bold text-amber-400 tabular-nums">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Emergency Alert Banner if Active */}
      {emergencyBroadcast?.active && (
        <div className="bg-rose-600 text-white px-6 py-3 border-b border-rose-700 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-6 h-6 text-amber-200 shrink-0" />
          <div className="font-sans">
            <span className="font-extrabold uppercase tracking-wide text-xs bg-rose-900 px-2 py-0.5 rounded mr-2">
              EMERGENCY NOTICE
            </span>
            <strong className="text-sm">{emergencyBroadcast.headline}:</strong>{' '}
            <span className="text-sm font-medium text-rose-100">{emergencyBroadcast.message}</span>
          </div>
        </div>
      )}

      {/* Main Grid: Departures + Active Advisories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 min-h-[460px]">
        {/* Left Side: Live Departures Board */}
        <div className="lg:col-span-8 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Upcoming Platform Departures
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Auto-updating in real-time
            </span>
          </div>

          <div className="space-y-2.5">
            {departures.slice(0, 6).map((dep: LiveDeparture, index) => {
              const line = lines.find(l => l.id === dep.lineId);

              return (
                <div
                  key={dep.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                    index === 0
                      ? 'bg-slate-900/90 border-slate-700 shadow-lg'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70'
                  }`}
                >
                  {/* Line pill & Platform */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-3.5 h-10 rounded-sm shrink-0 shadow-sm"
                      style={{ backgroundColor: line?.color || '#2563eb' }}
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                          {line?.code}
                        </span>
                        <span className="text-base font-extrabold text-white truncate font-sans">
                          {dep.destination}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-bold text-amber-300">{dep.platform}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-400">Sched: {dep.scheduledTime}</span>
                        {dep.status === 'delayed' && (
                          <span className="text-rose-400 font-semibold">
                            (+{dep.delayMinutes}m delay)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Countdown pill */}
                  <div className="text-right shrink-0">
                    {dep.status === 'boarding' ? (
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-sm uppercase tracking-wider animate-pulse">
                        Boarding
                      </span>
                    ) : dep.status === 'cancelled' ? (
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 font-bold text-sm uppercase border border-rose-800">
                        Cancelled
                      </span>
                    ) : (
                      <div className="inline-flex flex-col items-end">
                        <span
                          className={`font-black text-xl font-mono tabular-nums leading-none ${
                            dep.minutesAway <= 3 ? 'text-amber-300' : 'text-white'
                          }`}
                        >
                          {dep.minutesAway} <span className="text-xs font-normal text-slate-400">min</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Exp: {dep.expectedTime}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Station Notices & Accessibility Info */}
        <div className="lg:col-span-4 p-6 space-y-4 bg-slate-900/30">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-400" />
              Station Status & Notices
            </h2>
            <span className="text-xs text-slate-500">
              {activeNotices.length} Active
            </span>
          </div>

          {/* Station Accessibility card */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Accessibility className="w-4 h-4 text-emerald-400" />
                Step-Free Access
              </span>
              <span className={`font-semibold px-2 py-0.5 rounded ${
                currentStation.elevatorStatus === 'operational'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {currentStation.elevatorStatus === 'operational' ? 'All Lifts In Service' : 'Lift Outage'}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Tactile paving and automated audio cues operational across all platforms.
            </p>
          </div>

          {/* Station Notices Feed */}
          <div className="space-y-3">
            {activeNotices.length === 0 ? (
              <div className="p-6 text-center text-slate-500 space-y-2 border border-slate-800 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-300 font-medium">
                  Normal Service on all lines serving {currentStation.name}.
                </p>
              </div>
            ) : (
              activeNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-3.5 rounded-xl border border-amber-900/50 bg-amber-950/20 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                      {notice.severity.toUpperCase()}
                    </span>
                    <span className="text-slate-500 text-[11px] font-mono">
                      {notice.id}
                    </span>
                  </div>

                  <h3 className="font-bold text-white leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {notice.summary}
                  </p>

                  {notice.alternativeAdvice && (
                    <div className="p-2 rounded bg-slate-900/90 text-amber-300 border border-amber-800/40 text-[11px]">
                      <strong>Advice:</strong> {notice.alternativeAdvice}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Ticker Marquee */}
      {activeNotices.length > 0 && (
        <div className="bg-amber-400 text-slate-950 px-6 py-2.5 flex items-center gap-3 font-sans font-bold text-xs sm:text-sm">
          <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 text-amber-300 text-xs shrink-0 font-mono">
            ADVISORY {activeAdvisoryIndex + 1}/{activeNotices.length}
          </span>
          <div className="overflow-hidden truncate">
            <span className="truncate">
              {activeNotices[activeAdvisoryIndex]?.title}:{' '}
              <span className="font-medium">{activeNotices[activeAdvisoryIndex]?.summary}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
