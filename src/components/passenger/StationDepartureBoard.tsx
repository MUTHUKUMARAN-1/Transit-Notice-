import React, { useState, useMemo } from 'react';
import { useTransit } from '../../context/TransitContext';
import { generateDeparturesForStation } from '../../utils/transitFormatters';
import { audioAnnouncer } from '../../utils/audioAnnouncer';
import { 
  Tv, 
  Volume2, 
  VolumeX, 
  Accessibility, 
  AlertCircle, 
  Clock 
} from 'lucide-react';
import { LiveDeparture } from '../../types/transit';

export const StationDepartureBoard: React.FC = () => {
  const {
    stations,
    lines,
    notices,
    currentTime,
    selectedStationId,
    setSelectedStationId,
    setSelectedNoticeId
  } = useTransit();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentStation = stations.find(s => s.id === (selectedStationId || 'ST-CENTRAL')) || stations[0];

  // Generate departures dynamically
  const departures = useMemo(() => {
    return generateDeparturesForStation(currentStation, lines, notices, currentTime);
  }, [currentStation, lines, notices, currentTime]);

  const handleAudioAnnouncement = async () => {
    if (isPlayingAudio) {
      audioAnnouncer.stop();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const topDeparture = departures[0];
    const text = topDeparture
      ? `Attention passengers at ${currentStation.name}. The next service from ${topDeparture.platform} is for ${topDeparture.destination}, arriving in ${topDeparture.minutesAway} minutes.`
      : `Attention passengers at ${currentStation.name}. All transit services are running to scheduled timetables.`;

    try {
      await audioAnnouncer.announceNotice(text);
    } catch {
      console.warn('Audio announce failed');
    } finally {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-blue-400">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight text-white font-sans">
                Station Departure Concourse
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Next scheduled train and bus movements at this terminal.
            </p>
          </div>
        </div>

        {/* Station Select Dropdown & Audio Chime */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={currentStation.id}
            onChange={(e) => setSelectedStationId(e.target.value)}
            className="text-xs bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code}) - Zone {s.zone}
              </option>
            ))}
          </select>

          <button
            onClick={handleAudioAnnouncement}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              isPlayingAudio
                ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                : 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border-slate-700'
            }`}
            title="Play Station PA Announcement"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Platform PA Chime</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Station Metadata Strip */}
      <div className="px-4 py-2.5 bg-slate-800/90 text-slate-300 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-slate-700">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-bold text-white">
            {currentStation.name}
          </span>
          <span className="text-slate-400">Station Code: <strong className="text-white">{currentStation.code}</strong></span>
          <span className="text-slate-400">Zone: <strong className="text-white">{currentStation.zone}</strong></span>
          <div className="flex items-center gap-1 text-slate-300">
            <Accessibility className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Elevator: {currentStation.elevatorStatus === 'operational' ? (
                <span className="text-emerald-400 font-medium">Operational</span>
              ) : (
                <span className="text-rose-400 font-medium">{currentStation.elevatorStatus.replace('_', ' ')}</span>
              )}
            </span>
          </div>
        </div>

        <div className="text-slate-400 flex items-center gap-1.5 tabular-nums">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Clock: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </div>

      {/* Live Departures Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-4">Line / Mode</th>
              <th className="py-2.5 px-4">Destination</th>
              <th className="py-2.5 px-4">Platform</th>
              <th className="py-2.5 px-4">Scheduled</th>
              <th className="py-2.5 px-4">Expected</th>
              <th className="py-2.5 px-4 text-center">Countdown</th>
              <th className="py-2.5 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {departures.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-500">
                  No upcoming departures registered for this station.
                </td>
              </tr>
            ) : (
              departures.map((dep: LiveDeparture) => {
                const line = lines.find(l => l.id === dep.lineId);

                return (
                  <tr
                    key={dep.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-default"
                  >
                    <td className="py-3 px-4 font-semibold whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-6 rounded-xs shrink-0"
                          style={{ backgroundColor: line?.color || '#000' }}
                        />
                        <span className="text-slate-900">{line?.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">
                      {dep.destination}
                    </td>

                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {dep.platform}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                      {dep.scheduledTime}
                    </td>

                    <td className="py-3 px-4 font-mono tabular-nums">
                      <span className={dep.status === 'delayed' ? 'text-rose-600 font-bold' : 'text-slate-900 font-medium'}>
                        {dep.expectedTime}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md font-extrabold text-xs tabular-nums ${
                          dep.minutesAway <= 2
                            ? 'bg-amber-100 text-amber-950 border border-amber-300 animate-pulse'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {dep.status === 'boarding' ? 'BOARDING' : `${dep.minutesAway} min`}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {dep.status === 'delayed' ? (
                        <div className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>+{dep.delayMinutes}m delay</span>
                          {dep.advisoryId && (
                            <button
                              onClick={() => setSelectedNoticeId(dep.advisoryId!)}
                              className="underline text-[10px] ml-1 text-blue-600 hover:text-blue-800"
                            >
                              Advisory
                            </button>
                          )}
                        </div>
                      ) : dep.status === 'boarding' ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Boarding Now
                        </span>
                      ) : dep.status === 'cancelled' ? (
                        <span className="text-red-700 font-bold bg-red-100 px-2 py-0.5 rounded border border-red-300">
                          Cancelled
                        </span>
                      ) : (
                        <span className="text-slate-700 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          On Time
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
