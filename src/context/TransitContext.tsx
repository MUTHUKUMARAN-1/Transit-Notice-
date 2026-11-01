import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  TransitLine, 
  TransitStation, 
  TransitNotice, 
  CommuterReport, 
  LineSubscription, 
  ViewMode, 
  TransitMode, 
  DisruptionSeverity 
} from '../types/transit';
import { 
  INITIAL_LINES, 
  INITIAL_STATIONS, 
  INITIAL_NOTICES, 
  INITIAL_COMMUTER_REPORTS, 
  INITIAL_SUBSCRIPTIONS 
} from '../data/transitData';

interface EmergencyBroadcast {
  active: boolean;
  headline: string;
  message: string;
  timestamp: string;
}

interface TransitContextType {
  lines: TransitLine[];
  stations: TransitStation[];
  notices: TransitNotice[];
  reports: CommuterReport[];
  subscriptions: LineSubscription[];
  currentView: ViewMode;
  selectedLineId: string | null;
  selectedStationId: string | null;
  selectedNoticeId: string | null;
  searchQuery: string;
  filterMode: TransitMode | 'all';
  filterSeverity: DisruptionSeverity | 'all';
  emergencyBroadcast: EmergencyBroadcast | null;
  currentTime: Date;
  isLiveSimulationActive: boolean;
  operatorRole: string;

  // Navigation & Filtering
  setCurrentView: (view: ViewMode) => void;
  setSelectedLineId: (id: string | null) => void;
  setSelectedStationId: (id: string | null) => void;
  setSelectedNoticeId: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setFilterMode: (m: TransitMode | 'all') => void;
  setFilterSeverity: (s: DisruptionSeverity | 'all') => void;
  setOperatorRole: (role: string) => void;

  // Notice Management (Operations)
  createNotice: (data: Omit<TransitNotice, 'id' | 'lastUpdated' | 'updates' | 'gtfsEntityId'>) => string;
  updateNotice: (id: string, updates: Partial<TransitNotice>) => void;
  addIncidentUpdate: (noticeId: string, message: string, actionTaken?: string) => void;
  resolveNotice: (id: string, resolutionNote: string) => void;
  deleteNotice: (id: string) => void;

  // Commuter Actions
  submitCommuterReport: (report: Omit<CommuterReport, 'id' | 'timestamp' | 'status' | 'upvotes'>) => void;
  upvoteCommuterReport: (reportId: string) => void;
  updateReportStatus: (reportId: string, status: CommuterReport['status']) => void;
  convertReportToNotice: (reportId: string) => void;

  // Subscriptions & Preferences
  toggleSubscription: (lineId: string) => void;
  updateSubscription: (sub: LineSubscription) => void;

  // Emergency & Simulation Controls
  setEmergencyBroadcast: (broadcast: { headline: string; message: string } | null) => void;
  toggleLiveSimulation: () => void;
  resetToBaseline: () => void;
  triggerSimulatedIncident: () => void;

  // Toast / System Notification simulation
  activeToast: { id: string; title: string; message: string; type: 'info' | 'success' | 'alert' } | null;
  dismissToast: () => void;
  showToast: (title: string, message: string, type?: 'info' | 'success' | 'alert') => void;
}

const TransitContext = createContext<TransitContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LINES: 'transitnotice_lines_v1',
  STATIONS: 'transitnotice_stations_v1',
  NOTICES: 'transitnotice_notices_v1',
  REPORTS: 'transitnotice_reports_v1',
  SUBSCRIPTIONS: 'transitnotice_subs_v1',
  EMERGENCY: 'transitnotice_emergency_v1'
};

export const TransitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state with localStorage fallback
  const [lines, setLines] = useState<TransitLine[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LINES);
      return saved ? JSON.parse(saved) : INITIAL_LINES;
    } catch {
      return INITIAL_LINES;
    }
  });

  const [stations] = useState<TransitStation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATIONS);
      return saved ? JSON.parse(saved) : INITIAL_STATIONS;
    } catch {
      return INITIAL_STATIONS;
    }
  });

  const [notices, setNotices] = useState<TransitNotice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
      return saved ? JSON.parse(saved) : INITIAL_NOTICES;
    } catch {
      return INITIAL_NOTICES;
    }
  });

  const [reports, setReports] = useState<CommuterReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return saved ? JSON.parse(saved) : INITIAL_COMMUTER_REPORTS;
    } catch {
      return INITIAL_COMMUTER_REPORTS;
    }
  });

  const [subscriptions, setSubscriptions] = useState<LineSubscription[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
    } catch {
      return INITIAL_SUBSCRIPTIONS;
    }
  });

  const [emergencyBroadcast, setEmergencyBroadcastState] = useState<EmergencyBroadcast | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMERGENCY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // UI state
  const [currentView, setCurrentView] = useState<ViewMode>('passenger');
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string | null>('ST-CENTRAL');
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<TransitMode | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<DisruptionSeverity | 'all'>('all');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isLiveSimulationActive, setIsLiveSimulationActive] = useState<boolean>(true);
  const [operatorRole, setOperatorRole] = useState<string>('Chief Operations Controller');

  // Toasts
  const [activeToast, setActiveToast] = useState<{ id: string; title: string; message: string; type: 'info' | 'success' | 'alert' } | null>(null);

  // Synchronize state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LINES, JSON.stringify(lines));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [lines]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [subscriptions]);

  useEffect(() => {
    try {
      if (emergencyBroadcast) {
        localStorage.setItem(STORAGE_KEYS.EMERGENCY, JSON.stringify(emergencyBroadcast));
      } else {
        localStorage.removeItem(STORAGE_KEYS.EMERGENCY);
      }
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [emergencyBroadcast]);

  // Wall clock ticker (updates every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = useCallback((title: string, message: string, type: 'info' | 'success' | 'alert' = 'info') => {
    const id = `toast-${Date.now()}`;
    setActiveToast({ id, title, message, type });
    setTimeout(() => {
      setActiveToast((prev) => (prev?.id === id ? null : prev));
    }, 5500);
  }, []);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  // Recalculate operational health on lines when notices change
  const refreshLineHealth = useCallback((updatedNotices: TransitNotice[]) => {
    setLines(prevLines => {
      return prevLines.map(line => {
        const lineNotices = updatedNotices.filter(n => 
          n.status === 'active' && n.affectedLineIds.includes(line.id)
        );

        if (lineNotices.length === 0) {
          return {
            ...line,
            operationalStatus: 'good_service',
            activeNoticeIds: []
          };
        }

        const hasSuspended = lineNotices.some(n => n.severity === 'suspended');
        const hasSevere = lineNotices.some(n => n.severity === 'severe');
        const hasModerate = lineNotices.some(n => n.severity === 'moderate');
        const hasPlanned = lineNotices.some(n => n.category === 'maintenance');

        let status = line.operationalStatus;
        if (hasSuspended) status = 'suspended';
        else if (hasSevere) status = 'severe_delays';
        else if (hasModerate) status = 'minor_delays';
        else if (hasPlanned) status = 'planned_works';
        else status = 'minor_delays';

        return {
          ...line,
          operationalStatus: status,
          activeNoticeIds: lineNotices.map(n => n.id)
        };
      });
    });
  }, []);

  // Notice Management
  const createNotice = useCallback((data: Omit<TransitNotice, 'id' | 'lastUpdated' | 'updates' | 'gtfsEntityId'>): string => {
    const idNum = Math.floor(100 + Math.random() * 900);
    const newId = `ADV-2026-${idNum}`;
    const timestamp = new Date().toISOString();

    const newNotice: TransitNotice = {
      ...data,
      id: newId,
      lastUpdated: timestamp,
      gtfsEntityId: `gtfs_alert_${newId.toLowerCase().replace('-', '_')}`,
      updates: [
        {
          id: `UPD-${newId}-1`,
          timestamp,
          authorRole: operatorRole,
          message: `Advisory created and verified by Operations Control. Initial status: ${data.status}.`,
          actionTaken: 'Dispatched to multi-modal channels.'
        }
      ]
    };

    setNotices(prev => {
      const next = [newNotice, ...prev];
      refreshLineHealth(next);
      return next;
    });

    showToast(
      'Advisory Published',
      `Notice ${newId} published to Passenger Portal and GTFS-RT feed.`,
      'success'
    );

    return newId;
  }, [operatorRole, refreshLineHealth, showToast]);

  const updateNotice = useCallback((id: string, updates: Partial<TransitNotice>) => {
    const timestamp = new Date().toISOString();

    setNotices(prev => {
      const next = prev.map(n => {
        if (n.id !== id) return n;
        return {
          ...n,
          ...updates,
          lastUpdated: timestamp
        };
      });
      refreshLineHealth(next);
      return next;
    });

    showToast('Advisory Updated', `Notice ${id} changes recorded and broadcasted.`, 'info');
  }, [refreshLineHealth, showToast]);

  const addIncidentUpdate = useCallback((noticeId: string, message: string, actionTaken?: string) => {
    const timestamp = new Date().toISOString();
    const updateId = `UPD-${Date.now()}`;

    setNotices(prev => {
      const next = prev.map(n => {
        if (n.id !== noticeId) return n;
        const newUpdate = {
          id: updateId,
          timestamp,
          authorRole: operatorRole,
          message,
          actionTaken
        };
        return {
          ...n,
          lastUpdated: timestamp,
          updates: [newUpdate, ...n.updates]
        };
      });
      return next;
    });

    showToast('Dispatcher Log Appended', `New update added to incident ${noticeId}.`, 'info');
  }, [operatorRole, showToast]);

  const resolveNotice = useCallback((id: string, resolutionNote: string) => {
    const timestamp = new Date().toISOString();
    setNotices(prev => {
      const next = prev.map(n => {
        if (n.id !== id) return n;
        return {
          ...n,
          status: 'resolved' as const,
          lastUpdated: timestamp,
          updates: [
            {
              id: `UPD-${Date.now()}`,
              timestamp,
              authorRole: operatorRole,
              message: `INCIDENT RESOLVED: ${resolutionNote}`,
              actionTaken: 'Normal service restored. Advisory marked as resolved.'
            },
            ...n.updates
          ]
        };
      });
      refreshLineHealth(next);
      return next;
    });

    showToast('Incident Resolved', `Notice ${id} marked as resolved. Normal service restoring.`, 'success');
  }, [operatorRole, refreshLineHealth, showToast]);

  const deleteNotice = useCallback((id: string) => {
    setNotices(prev => {
      const next = prev.filter(n => n.id !== id);
      refreshLineHealth(next);
      return next;
    });
    showToast('Notice Archived', `Advisory ${id} removed from active feed.`, 'info');
  }, [refreshLineHealth, showToast]);

  // Commuter Reports
  const submitCommuterReport = useCallback((reportData: Omit<CommuterReport, 'id' | 'timestamp' | 'status' | 'upvotes'>) => {
    const newReport: CommuterReport = {
      ...reportData,
      id: `REP-${Math.floor(8100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      status: 'received',
      upvotes: 1
    };

    setReports(prev => [newReport, ...prev]);
    showToast(
      'Issue Report Received',
      'Thank you! Your report has been dispatched to Transit Operations for inspection.',
      'success'
    );
  }, [showToast]);

  const upvoteCommuterReport = useCallback((reportId: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r));
    showToast('Report Upvoted', 'Thank you for confirming this service condition.', 'info');
  }, [showToast]);

  const updateReportStatus = useCallback((reportId: string, status: CommuterReport['status']) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
    showToast('Report Status Updated', `Report ${reportId} marked as ${status}.`, 'info');
  }, [showToast]);

  const convertReportToNotice = useCallback((reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const line = lines.find(l => l.id === report.lineId);
    const lineName = line?.name || 'Transit Line';

    createNotice({
      title: `${lineName}: Passenger Reported ${report.issueType.replace('_', ' ').toUpperCase()}`,
      summary: report.description,
      detail: `Verified passenger report at station. Field inspection confirmed. Ongoing operational triage.`,
      severity: 'minor',
      category: report.issueType === 'delay' ? 'delays' : report.issueType === 'overcrowding' ? 'crowding' : 'maintenance',
      status: 'active',
      affectedLineIds: [report.lineId],
      affectedStationIds: report.stationId ? [report.stationId] : [],
      startTime: new Date().toISOString(),
      cause: `Field report: ${report.description}`,
      effect: 'Minor headway adjustments.',
      alternativeAdvice: 'Please check platform display monitors for boarding updates.',
      broadcastChannels: {
        webPortal: true,
        stationSignage: true,
        passengerPush: true,
        gtfsRealtime: true,
        operatorAuditFeed: true
      },
      priorityOrder: 4
    });

    updateReportStatus(reportId, 'verified_notice_created');
  }, [reports, lines, createNotice, updateReportStatus]);

  // Subscriptions
  const toggleSubscription = useCallback((lineId: string) => {
    setSubscriptions(prev => {
      const exists = prev.some(s => s.lineId === lineId);
      if (exists) {
        showToast('Alert Subscription Removed', 'You will no longer receive push alerts for this line.', 'info');
        return prev.filter(s => s.lineId !== lineId);
      } else {
        const newLine = lines.find(l => l.id === lineId);
        showToast('Subscribed to Alerts', `You will receive live advisory alerts for ${newLine?.name || 'this line'}.`, 'success');
        return [
          ...prev,
          {
            lineId,
            notifyOnMinor: true,
            notifyOnSevere: true,
            notifyOnPlanned: false,
            emailAlerts: false,
            pushAlerts: true
          }
        ];
      }
    });
  }, [lines, showToast]);

  const updateSubscription = useCallback((sub: LineSubscription) => {
    setSubscriptions(prev => {
      const exists = prev.some(s => s.lineId === sub.lineId);
      if (exists) {
        return prev.map(s => s.lineId === sub.lineId ? sub : s);
      }
      return [...prev, sub];
    });
    showToast('Preferences Saved', 'Your transit notification settings have been updated.', 'success');
  }, [showToast]);

  // Emergency Broadcast
  const setEmergencyBroadcast = useCallback((broadcast: { headline: string; message: string } | null) => {
    if (broadcast) {
      setEmergencyBroadcastState({
        active: true,
        headline: broadcast.headline,
        message: broadcast.message,
        timestamp: new Date().toISOString()
      });
      showToast('EMERGENCY BROADCAST ACTIVATED', 'High-priority banner pushed to all channels.', 'alert');
    } else {
      setEmergencyBroadcastState(null);
      showToast('Emergency Broadcast Cleared', 'System returned to normal broadcast state.', 'info');
    }
  }, [showToast]);

  // Simulation Controls
  const toggleLiveSimulation = useCallback(() => {
    setIsLiveSimulationActive(prev => !prev);
  }, []);

  const resetToBaseline = useCallback(() => {
    setLines(INITIAL_LINES);
    setNotices(INITIAL_NOTICES);
    setReports(INITIAL_COMMUTER_REPORTS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setEmergencyBroadcastState(null);
    localStorage.removeItem(STORAGE_KEYS.LINES);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTIONS);
    localStorage.removeItem(STORAGE_KEYS.EMERGENCY);
    showToast('Baseline Restored', 'Reset all transit notices and lines to verified initial schedule.', 'info');
  }, [showToast]);

  const triggerSimulatedIncident = useCallback(() => {
    const candidateLines = lines.filter(l => l.operationalStatus === 'good_service');
    const targetLine = candidateLines.length > 0 ? candidateLines[0] : lines[0];
    
    const randomIncidents = [
      {
        title: `${targetLine.name}: Brief Track Inspection near Interchange`,
        summary: 'Maintenance team conducting precautionary 10-minute visual rail check.',
        detail: 'Routine supervisory visual track walk between stations. Trains proceeding at walking pace.',
        severity: 'minor' as const,
        cause: 'Supervisory track clearance routine.',
        effect: '5-8 minute headway gap.'
      },
      {
        title: `${targetLine.name}: Overhead Catenary Tension Adjustment`,
        summary: 'Catenary inspection vehicle active on outer loop. Platform boarding adjustments in effect.',
        detail: 'Specialized overhead line equipment car conducting tension verification before evening peak.',
        severity: 'moderate' as const,
        cause: 'Overhead tension tolerance adjustment.',
        effect: 'Alternating platform boarding.'
      }
    ];

    const pick = randomIncidents[Math.floor(Math.random() * randomIncidents.length)];

    createNotice({
      title: pick.title,
      summary: pick.summary,
      detail: pick.detail,
      severity: pick.severity,
      category: 'maintenance',
      status: 'active',
      affectedLineIds: [targetLine.id],
      affectedStationIds: [targetLine.stationIds[0] || 'ST-CENTRAL'],
      startTime: new Date().toISOString(),
      cause: pick.cause,
      effect: pick.effect,
      alternativeAdvice: 'Please check countdown displays on the platform for train arrival sequence.',
      broadcastChannels: {
        webPortal: true,
        stationSignage: true,
        passengerPush: true,
        gtfsRealtime: true,
        operatorAuditFeed: true
      },
      priorityOrder: 3
    });
  }, [lines, createNotice]);

  const value = useMemo(() => ({
    lines,
    stations,
    notices,
    reports,
    subscriptions,
    currentView,
    selectedLineId,
    selectedStationId,
    selectedNoticeId,
    searchQuery,
    filterMode,
    filterSeverity,
    emergencyBroadcast,
    currentTime,
    isLiveSimulationActive,
    operatorRole,
    setCurrentView,
    setSelectedLineId,
    setSelectedStationId,
    setSelectedNoticeId,
    setSearchQuery,
    setFilterMode,
    setFilterSeverity,
    setOperatorRole,
    createNotice,
    updateNotice,
    addIncidentUpdate,
    resolveNotice,
    deleteNotice,
    submitCommuterReport,
    upvoteCommuterReport,
    updateReportStatus,
    convertReportToNotice,
    toggleSubscription,
    updateSubscription,
    setEmergencyBroadcast,
    toggleLiveSimulation,
    resetToBaseline,
    triggerSimulatedIncident,
    activeToast,
    dismissToast,
    showToast
  }), [
    lines,
    stations,
    notices,
    reports,
    subscriptions,
    currentView,
    selectedLineId,
    selectedStationId,
    selectedNoticeId,
    searchQuery,
    filterMode,
    filterSeverity,
    emergencyBroadcast,
    currentTime,
    isLiveSimulationActive,
    operatorRole,
    createNotice,
    updateNotice,
    addIncidentUpdate,
    resolveNotice,
    deleteNotice,
    submitCommuterReport,
    upvoteCommuterReport,
    updateReportStatus,
    convertReportToNotice,
    toggleSubscription,
    updateSubscription,
    setEmergencyBroadcast,
    toggleLiveSimulation,
    resetToBaseline,
    triggerSimulatedIncident,
    activeToast,
    dismissToast,
    showToast
  ]);

  return <TransitContext.Provider value={value}>{children}</TransitContext.Provider>;
};

export const useTransit = (): TransitContextType => {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
};
