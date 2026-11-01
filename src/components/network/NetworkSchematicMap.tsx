import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { TransitStation, TransitLine } from '../../types/transit';
import { Layers, CheckCircle2, ChevronRight } from 'lucide-react';

export const NetworkSchematicMap: React.FC = () => {
  const {
    lines,
    stations,
    notices,
    selectedStationId,
    setSelectedStationId,
    setSelectedNoticeId
  } = useTransit();

  const [activeFilterLine, setActiveFilterLine] = useState<string | null>(null);
  const [hoveredStation, setHoveredStation] = useState<TransitStation | null>(null);

  const selectedStation = stations.find(s => s.id === selectedStationId) || stations[0];

  // Check which lines are disrupted
  const disruptedLineIds = notices
    .filter(n => n.status === 'active' && (n.severity === 'severe' || n.severity === 'moderate'))
    .flatMap(n => n.affectedLineIds);

  const activeStationNotices = notices.filter(n => 
    n.status === 'active' && 
    (n.affectedStationIds.includes(selectedStation.id) || n.affectedLineIds.some(lId => selectedStation.lineIds.includes(lId)))
  );

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Interactive Network Schematic Map</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Metropolitan transit lines and real-time track condition indicators. Click stations to inspect platform service.
          </p>
        </div>

        {/* Line filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <button
            onClick={() => setActiveFilterLine(null)}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeFilterLine === null
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Routes
          </button>
          {lines.map((line) => (
            <button
              key={line.id}
              onClick={() => setActiveFilterLine(activeFilterLine === line.id ? null : line.id)}
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md font-semibold border transition-all ${
                activeFilterLine === line.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span
                className="w-2 h-2 rounded-xs"
                style={{ backgroundColor: line.color }}
              />
              <span>{line.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Schematic Canvas */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 border-b border-slate-800 pb-2">
            <span className="font-mono uppercase tracking-wider text-[11px]">
              MCTA Schematic Transit Cartography • Scale: Metro Standard
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Normal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Active Delay
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto flex justify-center py-4">
            <svg
              viewBox="0 0 620 560"
              className="w-full max-w-[620px] h-auto select-none"
              style={{ minWidth: '480px' }}
            >
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background grid lines */}
              <g stroke="#1e293b" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.4">
                <line x1="100" y1="0" x2="100" y2="560" />
                <line x1="300" y1="0" x2="300" y2="560" />
                <line x1="520" y1="0" x2="520" y2="560" />
                <line x1="0" y1="220" x2="620" y2="220" />
                <line x1="0" y1="310" x2="620" y2="310" />
                <line x1="0" y1="400" x2="620" y2="400" />
              </g>

              {/* Transit Line Tracks */}
              {lines.map((line: TransitLine) => {
                const lineStations = line.stationIds
                  .map(sId => stations.find(s => s.id === sId))
                  .filter((s): s is TransitStation => Boolean(s));

                if (lineStations.length < 2) return null;

                const pointsStr = lineStations
                  .map(s => `${s.coordinates.x},${s.coordinates.y}`)
                  .join(' ');

                const isDisrupted = disruptedLineIds.includes(line.id);
                const isDimmed = activeFilterLine !== null && activeFilterLine !== line.id;

                return (
                  <g key={`track-${line.id}`} opacity={isDimmed ? 0.2 : 1}>
                    {/* Disruption Glow Halo if impacted */}
                    {isDisrupted && (
                      <polyline
                        points={pointsStr}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.3"
                        className="animate-pulse"
                      />
                    )}

                    {/* Main Track Line */}
                    <polyline
                      points={pointsStr}
                      fill="none"
                      stroke={line.color}
                      strokeWidth={line.mode === 'bus' ? 4 : line.mode === 'ferry' ? 3 : 7}
                      strokeDasharray={line.mode === 'bus' ? '8 4' : line.mode === 'ferry' ? '6 6' : undefined}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                );
              })}

              {/* Station Nodes */}
              {stations.map((station) => {
                const isSelected = selectedStation.id === station.id;
                const isHovered = hoveredStation?.id === station.id;
                const hasStationNotice = notices.some(n => 
                  n.status === 'active' && 
                  (n.affectedStationIds.includes(station.id) || n.affectedLineIds.some(lId => station.lineIds.includes(lId)))
                );

                return (
                  <g
                    key={station.id}
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedStationId(station.id)}
                    onMouseEnter={() => setHoveredStation(station)}
                    onMouseLeave={() => setHoveredStation(null)}
                  >
                    {/* Outer Selection Ring */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={station.coordinates.x}
                        cy={station.coordinates.y}
                        r={station.isInterchange ? 14 : 10}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeDasharray="3 2"
                        className="animate-spin"
                        style={{ transformOrigin: `${station.coordinates.x}px ${station.coordinates.y}px` }}
                      />
                    )}

                    {/* Delay Pulse Ring */}
                    {hasStationNotice && (
                      <circle
                        cx={station.coordinates.x}
                        cy={station.coordinates.y}
                        r={station.isInterchange ? 12 : 8}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        className="animate-ping"
                        opacity="0.75"
                        style={{ transformOrigin: `${station.coordinates.x}px ${station.coordinates.y}px` }}
                      />
                    )}

                    {/* Station Marker */}
                    <circle
                      cx={station.coordinates.x}
                      cy={station.coordinates.y}
                      r={station.isInterchange ? 7 : 5}
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth={station.isInterchange ? 2.5 : 1.5}
                    />

                    {/* Station Name Label */}
                    <text
                      x={station.coordinates.x + 10}
                      y={station.coordinates.y + 4}
                      fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                      fontSize={station.isInterchange ? 11 : 9}
                      fontWeight={station.isInterchange ? 'bold' : 'normal'}
                      fontFamily="Inter, sans-serif"
                      className="transition-colors pointer-events-none select-none"
                    >
                      {station.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Station Details Inspector Sidebar */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Selected Station Inspector
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {selectedStation.name}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-100 text-slate-800">
              {selectedStation.code}
            </span>
          </div>

          {/* Station Metadata */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Fare Zone</span>
              <span className="font-bold text-slate-800">Zone {selectedStation.zone}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Type</span>
              <span className="font-bold text-slate-800">
                {selectedStation.isInterchange ? 'Interchange Hub' : 'Standard Stop'}
              </span>
            </div>
          </div>

          {/* Lines Serving Station */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Lines Serving This Station
            </span>
            <div className="space-y-1.5">
              {lines
                .filter(l => selectedStation.lineIds.includes(l.id))
                .map(line => (
                  <div
                    key={line.id}
                    className="p-2 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-6 rounded-xs shrink-0"
                        style={{ backgroundColor: line.color }}
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{line.name}</span>
                        <span className="text-[10px] text-slate-500 capitalize">{line.mode}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600">
                      Every {line.headwayMinutes}m
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Active Advisories at Station */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Active Alerts for this Station ({activeStationNotices.length})
            </span>

            {activeStationNotices.length === 0 ? (
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>All lines serving this station are operating normally.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {activeStationNotices.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNoticeId(n.id)}
                    className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/60 text-xs space-y-1 hover:border-amber-400 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between font-bold text-amber-950">
                      <span>{n.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
                    </div>
                    <p className="text-amber-900 line-clamp-2">{n.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
