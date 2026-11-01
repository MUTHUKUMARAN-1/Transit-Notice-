import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  getSeverityDisplay, 
  formatRelativeTime, 
  formatTime24, 
  formatDateDisplay 
} from '../../utils/transitFormatters';
import { audioAnnouncer } from '../../utils/audioAnnouncer';
import { 
  Volume2, 
  VolumeX, 
  Share2, 
  Check, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  Radio 
} from 'lucide-react';

interface NoticeDetailModalProps {
  noticeId: string | null;
  onClose: () => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({ noticeId, onClose }) => {
  const { notices, lines, stations, showToast } = useTransit();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const notice = notices.find(n => n.id === noticeId);
  if (!notice) return null;

  const severityStyle = getSeverityDisplay(notice.severity);
  const affectedLines = lines.filter(l => notice.affectedLineIds.includes(l.id));
  const affectedStations = stations.filter(s => notice.affectedStationIds.includes(s.id));

  const handlePlayAnnouncement = async () => {
    if (isPlayingAudio) {
      audioAnnouncer.stop();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const spokenText = `Attention passengers. Transit advisory ${notice.id}. ${notice.title}. ${notice.summary}. ${notice.alternativeAdvice ? `Alternative travel advice: ${notice.alternativeAdvice}` : ''}`;
    
    try {
      await audioAnnouncer.announceNotice(spokenText);
    } catch {
      console.warn('Audio playback error');
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}?advisory=${notice.id}`);
    setHasCopied(true);
    showToast('Advisory Link Copied', 'Direct advisory link copied to clipboard.', 'info');
    setTimeout(() => setHasCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={Boolean(noticeId)}
      onClose={() => {
        audioAnnouncer.stop();
        setIsPlayingAudio(false);
        onClose();
      }}
      title={notice.id}
      subtitle={`Official MCTA Transit Advisory • Updated ${formatRelativeTime(notice.lastUpdated)}`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Header Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${severityStyle.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${severityStyle.dotClass}`} />
              {severityStyle.label}
            </span>

            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium uppercase tracking-wider">
              Status: {notice.status}
            </span>

            <span className="text-xs text-slate-400 font-mono">
              GTFS-RT ID: {notice.gtfsEntityId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayAnnouncement}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                isPlayingAudio
                  ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
              title="Listen to automated audio station announcement"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                  <span>Stop Announcement</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Listen Announcement</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Copy permalink"
            >
              {hasCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Title & Summary */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {notice.title}
          </h3>
          <p className="text-sm text-slate-700 font-medium mt-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200/70 leading-relaxed">
            {notice.summary}
          </p>
        </div>

        {/* Affected Lines & Affected Stations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
          <div>
            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Impacted Routes
            </span>
            <div className="flex flex-wrap gap-1.5">
              {affectedLines.map((line) => (
                <span
                  key={line.id}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded bg-white border border-slate-200 shadow-2xs"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-xs"
                    style={{ backgroundColor: line.color }}
                  />
                  <span>{line.name}</span>
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Impacted Stations / Corridor
            </span>
            <div className="flex flex-wrap gap-1.5">
              {affectedStations.length > 0 ? (
                affectedStations.map((station) => (
                  <span
                    key={station.id}
                    className="text-xs px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 font-medium"
                  >
                    {station.name} ({station.code})
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">Entire route corridor</span>
              )}
            </div>
          </div>
        </div>

        {/* Operational Context: Root Cause & Effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-700 block mb-1">Root Cause</span>
            <p className="text-slate-600 leading-relaxed">{notice.cause}</p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-700 block mb-1">Service Effect</span>
            <p className="text-slate-600 leading-relaxed">{notice.effect}</p>
          </div>
        </div>

        {/* Alternative Commuter Guidance */}
        {notice.alternativeAdvice && (
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg flex items-start gap-3">
            <Navigation className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                Recommended Alternative Travel Route
              </span>
              <p className="text-xs sm:text-sm text-blue-950 mt-1 leading-relaxed font-medium">
                {notice.alternativeAdvice}
              </p>
            </div>
          </div>
        )}

        {/* Technical Briefing / Detail */}
        <div>
          <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Operations Briefing
          </span>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border border-slate-200 p-3 rounded-lg">
            {notice.detail}
          </p>
        </div>

        {/* Chronological Incident Updates History */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Dispatcher Incident Log ({notice.updates.length} Entries)</span>
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {notice.updates.map((update) => (
              <div
                key={update.id}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    {update.authorRole}
                  </span>
                  <span className="tabular-nums">
                    {formatDateDisplay(update.timestamp)} at {formatTime24(update.timestamp)}
                  </span>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed">{update.message}</p>
                {update.actionTaken && (
                  <p className="text-slate-500 italic text-[11px]">
                    Action: {update.actionTaken}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Broadcast Channels Audit */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Broadcast Channels:</span>
            <div className="flex gap-1.5 flex-wrap">
              {notice.broadcastChannels.webPortal && (
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                  Web Portal
                </span>
              )}
              {notice.broadcastChannels.stationSignage && (
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                  Station Signage
                </span>
              )}
              {notice.broadcastChannels.gtfsRealtime && (
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                  GTFS-RT
                </span>
              )}
              {notice.broadcastChannels.passengerPush && (
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                  Push Alerts
                </span>
              )}
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
