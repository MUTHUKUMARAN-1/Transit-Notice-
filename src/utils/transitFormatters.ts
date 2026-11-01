import { 
  DisruptionSeverity, 
  OperationalHealth, 
  TransitLine, 
  TransitStation, 
  TransitNotice, 
  LiveDeparture, 
  GTFSEntity 
} from '../types/transit';

/**
 * Format relative time in clean, standard transit terminology
 */
export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 45) return 'Just now';
    if (diffMin === 1) return '1 min ago';
    if (diffMin < 60) return `${diffMin} mins ago`;
    if (diffHours === 1) return '1 hr ago';
    if (diffHours < 24) return `${diffHours} hrs ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  } catch {
    return 'Recently';
  }
}

/**
 * Format timestamp into standard 24-hour time HH:mm
 */
export function formatTime24(dateInput: string | Date | number): string {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * Format date for notice headers (e.g., "Sun, Nov 1, 2026")
 */
export function formatDateDisplay(dateInput: string | Date): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Returns human-readable label and styling tokens for operational health
 */
export function getHealthDisplay(status: OperationalHealth): {
  label: string;
  bg: string;
  text: string;
  border: string;
  dotColor: string;
} {
  switch (status) {
    case 'good_service':
      return {
        label: 'Good Service',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dotColor: 'bg-emerald-500'
      };
    case 'minor_delays':
      return {
        label: 'Minor Delays',
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        dotColor: 'bg-amber-500'
      };
    case 'severe_delays':
      return {
        label: 'Severe Delays',
        bg: 'bg-rose-50',
        text: 'text-rose-800',
        border: 'border-rose-200',
        dotColor: 'bg-rose-500'
      };
    case 'partially_suspended':
      return {
        label: 'Partially Suspended',
        bg: 'bg-purple-50',
        text: 'text-purple-800',
        border: 'border-purple-200',
        dotColor: 'bg-purple-500'
      };
    case 'suspended':
      return {
        label: 'Service Suspended',
        bg: 'bg-red-100',
        text: 'text-red-900',
        border: 'border-red-300',
        dotColor: 'bg-red-600'
      };
    case 'planned_works':
      return {
        label: 'Planned Works',
        bg: 'bg-indigo-50',
        text: 'text-indigo-800',
        border: 'border-indigo-200',
        dotColor: 'bg-indigo-500'
      };
    default:
      return {
        label: 'Normal Service',
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dotColor: 'bg-slate-400'
      };
  }
}

/**
 * Returns label and styling for disruption severity
 */
export function getSeverityDisplay(severity: DisruptionSeverity): {
  label: string;
  badgeClass: string;
  dotClass: string;
} {
  switch (severity) {
    case 'info':
      return {
        label: 'Informational',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        dotClass: 'bg-blue-500'
      };
    case 'minor':
      return {
        label: 'Minor Disruption',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        dotClass: 'bg-amber-500'
      };
    case 'moderate':
      return {
        label: 'Moderate Disruption',
        badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
        dotClass: 'bg-orange-500'
      };
    case 'severe':
      return {
        label: 'Severe Disruption',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-300',
        dotClass: 'bg-rose-600'
      };
    case 'suspended':
      return {
        label: 'Suspended Service',
        badgeClass: 'bg-red-100 text-red-900 border-red-300 font-semibold',
        dotClass: 'bg-red-600'
      };
  }
}

/**
 * Dynamically computes upcoming realistic departures for a station
 */
export function generateDeparturesForStation(
  station: TransitStation,
  lines: TransitLine[],
  notices: TransitNotice[],
  currentTime: Date
): LiveDeparture[] {
  const departures: LiveDeparture[] = [];
  const linesAtStation = lines.filter(l => station.lineIds.includes(l.id));

  linesAtStation.forEach((line) => {
    // Check if line has any active notices
    const activeNotice = notices.find(n => 
      n.status === 'active' && n.affectedLineIds.includes(line.id)
    );

    const stationIdx = line.stationIds.indexOf(station.id);
    const totalStations = line.stationIds.length;

    // Two potential destinations: end of line forward and backward
    const dest1 = totalStations > 1 ? line.stationIds[totalStations - 1] : station.id;
    const dest2 = totalStations > 1 ? line.stationIds[0] : station.id;

    const baseHeadway = line.headwayMinutes || 6;
    const delayAdjustment = activeNotice ? (activeNotice.severity === 'severe' ? 14 : activeNotice.severity === 'moderate' ? 7 : 3) : 0;

    // Generate next 3 departures for this line
    for (let i = 1; i <= 3; i++) {
      const scheduledMinutesAway = i * baseHeadway - (currentTime.getMinutes() % baseHeadway);
      const actualMinutesAway = Math.max(1, scheduledMinutesAway + (activeNotice ? delayAdjustment : 0));
      
      const scheduledTimeDate = new Date(currentTime.getTime() + scheduledMinutesAway * 60 * 1000);
      const expectedTimeDate = new Date(currentTime.getTime() + actualMinutesAway * 60 * 1000);

      // Determine platform
      const platformNum = stationIdx >= 0 ? (stationIdx % 2) + 1 : 1;
      const isReturn = (i % 2 === 0 && stationIdx > 0);
      const targetStationId = isReturn ? dest2 : dest1;
      
      // Determine destination name
      const destName = targetStationId === station.id 
        ? 'Terminating Service' 
        : (lines.find(l => l.id === line.id)?.name.includes('Airport') ? 'Airport Terminals' : 'Central Interchange');

      const isDelayed = delayAdjustment > 0;
      const isCancelled = activeNotice?.severity === 'suspended' && i === 1;

      departures.push({
        id: `DEP-${line.id}-${station.id}-${i}-${currentTime.getTime()}`,
        lineId: line.id,
        stationId: station.id,
        destination: destName,
        platform: `Platform ${platformNum}`,
        scheduledTime: formatTime24(scheduledTimeDate),
        expectedTime: isCancelled ? 'CANCELLED' : formatTime24(expectedTimeDate),
        minutesAway: actualMinutesAway,
        status: isCancelled ? 'cancelled' : isDelayed ? 'delayed' : actualMinutesAway <= 1 ? 'boarding' : 'on_time',
        delayMinutes: isDelayed ? delayAdjustment : 0,
        crowding: line.operationalStatus === 'severe_delays' ? 'high' : i === 1 ? 'moderate' : 'low',
        wheelchairAccessible: station.accessible,
        advisoryId: activeNotice?.id
      });
    }
  });

  // Sort by minutes away
  return departures.sort((a, b) => a.minutesAway - b.minutesAway);
}

/**
 * Converts internal notices into full standard GTFS-RT Alert entities
 */
export function exportToGTFSRealtime(notices: TransitNotice[], lines: TransitLine[]): {
  header: {
    gtfsRealtimeVersion: string;
    incrementality: string;
    timestamp: number;
  };
  entity: GTFSEntity[];
} {
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const entities: GTFSEntity[] = notices.map((notice) => {
    // Map internal severity to GTFS-RT SeverityLevel
    let gtfsSeverity = 'UNKNOWN_SEVERITY';
    if (notice.severity === 'info') gtfsSeverity = 'INFO';
    if (notice.severity === 'minor') gtfsSeverity = 'WARNING';
    if (notice.severity === 'moderate') gtfsSeverity = 'SEVERE';
    if (notice.severity === 'severe' || notice.severity === 'suspended') gtfsSeverity = 'SEVERE';

    const informedEntity = notice.affectedLineIds.map((lId) => {
      const line = lines.find(l => l.id === lId);
      return {
        agencyId: 'MCTA_METRO',
        routeId: line?.code || lId,
        routeType: line?.mode === 'bus' ? 3 : line?.mode === 'rail' ? 2 : line?.mode === 'ferry' ? 4 : 1
      };
    });

    return {
      id: notice.gtfsEntityId || `gtfs_alert_${notice.id}`,
      isDeleted: notice.status === 'archived' || notice.status === 'resolved',
      alert: {
        activePeriod: [
          {
            start: Math.floor(new Date(notice.startTime).getTime() / 1000),
            end: notice.estimatedEndTime ? Math.floor(new Date(notice.estimatedEndTime).getTime() / 1000) : undefined
          }
        ],
        informedEntity,
        cause: notice.cause || 'TECHNICAL_PROBLEM',
        effect: notice.effect || 'SIGNIFICANT_DELAYS',
        headerText: {
          translation: [
            { text: notice.title, language: 'en' }
          ]
        },
        descriptionText: {
          translation: [
            { text: `${notice.summary}\n\n${notice.detail}${notice.alternativeAdvice ? `\n\nAlternative Advice: ${notice.alternativeAdvice}` : ''}`, language: 'en' }
          ]
        },
        severityLevel: gtfsSeverity
      }
    };
  });

  return {
    header: {
      gtfsRealtimeVersion: '2.0',
      incrementality: 'FULL_DATASET',
      timestamp: currentTimestamp
    },
    entity: entities
  };
}
