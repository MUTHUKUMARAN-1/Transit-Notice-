export type TransitMode = 'metro' | 'bus' | 'rail' | 'tram' | 'ferry';

export type DisruptionSeverity = 'info' | 'minor' | 'moderate' | 'severe' | 'suspended';

export type AdvisoryCategory = 
  | 'delays' 
  | 'maintenance' 
  | 'station_closure' 
  | 'elevator' 
  | 'weather' 
  | 'crowding' 
  | 'special_event';

export type LifecycleStatus = 
  | 'draft' 
  | 'active' 
  | 'updating' 
  | 'resolving' 
  | 'resolved' 
  | 'archived';

export type OperationalHealth = 
  | 'good_service' 
  | 'minor_delays' 
  | 'severe_delays' 
  | 'partially_suspended' 
  | 'suspended' 
  | 'planned_works';

export interface StationCoordinate {
  x: number;
  y: number;
}

export interface TransitStation {
  id: string;
  name: string;
  code: string;
  modes: TransitMode[];
  lineIds: string[];
  zone: number;
  isInterchange: boolean;
  accessible: boolean;
  elevatorStatus: 'operational' | 'maintenance' | 'out_of_service';
  coordinates: StationCoordinate;
}

export interface TransitLine {
  id: string;
  name: string;
  code: string;
  mode: TransitMode;
  color: string;
  badgeBg: string;
  badgeText: string;
  routeDescription: string;
  stationIds: string[];
  operationalStatus: OperationalHealth;
  activeNoticeIds: string[];
  headwayMinutes: number;
  firstDeparture: string;
  lastDeparture: string;
}

export interface IncidentUpdate {
  id: string;
  timestamp: string; // ISO string
  authorRole: string; // e.g., 'Chief Operations Officer', 'Line Controller 2'
  message: string;
  actionTaken?: string;
}

export interface BroadcastChannels {
  webPortal: boolean;
  stationSignage: boolean;
  passengerPush: boolean;
  gtfsRealtime: boolean;
  operatorAuditFeed: boolean;
}

export interface TransitNotice {
  id: string; // e.g. "ADV-2026-104"
  title: string;
  summary: string;
  detail: string;
  severity: DisruptionSeverity;
  category: AdvisoryCategory;
  status: LifecycleStatus;
  affectedLineIds: string[];
  affectedStationIds: string[];
  startStationId?: string;
  endStationId?: string;
  startTime: string; // ISO
  estimatedEndTime?: string; // ISO
  lastUpdated: string; // ISO
  cause: string;
  effect: string;
  alternativeAdvice?: string;
  broadcastChannels: BroadcastChannels;
  updates: IncidentUpdate[];
  gtfsEntityId: string;
  priorityOrder: number; // 1 = highest
}

export interface LiveDeparture {
  id: string;
  lineId: string;
  stationId: string;
  destination: string;
  platform: string;
  scheduledTime: string; // HH:mm
  expectedTime: string; // HH:mm
  minutesAway: number;
  status: 'on_time' | 'delayed' | 'cancelled' | 'boarding';
  delayMinutes: number;
  crowding: 'low' | 'moderate' | 'high';
  wheelchairAccessible: boolean;
  advisoryId?: string;
}

export interface CommuterReport {
  id: string;
  timestamp: string;
  lineId: string;
  stationId?: string;
  issueType: 'delay' | 'overcrowding' | 'elevator_fault' | 'cleanliness' | 'safety' | 'audio_fault';
  description: string;
  status: 'received' | 'investigating' | 'verified_notice_created' | 'dismissed';
  upvotes: number;
  reporterName?: string;
}

export interface LineSubscription {
  lineId: string;
  notifyOnMinor: boolean;
  notifyOnSevere: boolean;
  notifyOnPlanned: boolean;
  emailAlerts: boolean;
  pushAlerts: boolean;
}

export interface GTFSEntity {
  id: string;
  isDeleted: boolean;
  alert: {
    activePeriod: Array<{ start: number; end?: number }>;
    informedEntity: Array<{
      agencyId?: string;
      routeId?: string;
      routeType?: number;
      stopId?: string;
    }>;
    cause: string;
    effect: string;
    headerText: { translation: Array<{ text: string; language: string }> };
    descriptionText: { translation: Array<{ text: string; language: string }> };
    severityLevel: string;
  };
}

export type ViewMode = 'passenger' | 'operator' | 'signage' | 'network_map' | 'gtfs_api';
