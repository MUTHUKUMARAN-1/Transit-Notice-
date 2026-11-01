import { TransitLine, TransitStation, TransitNotice, CommuterReport, LineSubscription } from '../types/transit';

export const INITIAL_STATIONS: TransitStation[] = [
  {
    id: 'ST-HARBOR',
    name: 'Harbor Heights',
    code: 'HBH',
    modes: ['metro'],
    lineIds: ['L-RED'],
    zone: 2,
    isInterchange: false,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 300, y: 70 }
  },
  {
    id: 'ST-TECH',
    name: 'Tech Park North',
    code: 'TPN',
    modes: ['metro'],
    lineIds: ['L-RED'],
    zone: 2,
    isInterchange: false,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 300, y: 140 }
  },
  {
    id: 'ST-FINANCIAL',
    name: 'Financial District',
    code: 'FND',
    modes: ['metro', 'bus'],
    lineIds: ['L-RED', 'L-BLU', 'L-B10'],
    zone: 1,
    isInterchange: true,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 300, y: 220 }
  },
  {
    id: 'ST-CENTRAL',
    name: 'Central Station',
    code: 'CEN',
    modes: ['metro', 'rail', 'bus'],
    lineIds: ['L-RED', 'L-BLU', 'L-CR1', 'L-B10'],
    zone: 1,
    isInterchange: true,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 300, y: 310 }
  },
  {
    id: 'ST-CIVIC',
    name: 'Civic Center',
    code: 'CVC',
    modes: ['metro'],
    lineIds: ['L-RED', 'L-GRN'],
    zone: 1,
    isInterchange: true,
    accessible: true,
    elevatorStatus: 'out_of_service', // matching notice
    coordinates: { x: 300, y: 400 }
  },
  {
    id: 'ST-SOUTH-SUB',
    name: 'South Suburbs Interchange',
    code: 'SSI',
    modes: ['metro', 'bus'],
    lineIds: ['L-RED', 'L-B10'],
    zone: 2,
    isInterchange: true,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 300, y: 490 }
  },
  // Blue Line
  {
    id: 'ST-AIRPORT-T3',
    name: 'Airport International (T3)',
    code: 'AP3',
    modes: ['metro'],
    lineIds: ['L-BLU'],
    zone: 3,
    isInterchange: false,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 100, y: 190 }
  },
  {
    id: 'ST-AIRPORT-T1',
    name: 'Airport Terminals 1 & 2',
    code: 'AP1',
    modes: ['metro'],
    lineIds: ['L-BLU'],
    zone: 3,
    isInterchange: false,
    accessible: true,
    elevatorStatus: 'maintenance',
    coordinates: { x: 170, y: 220 }
  },
  {
    id: 'ST-WATERFRONT',
    name: 'Waterfront Pier',
    code: 'WTF',
    modes: ['metro', 'ferry'],
    lineIds: ['L-BLU', 'L-FR1'],
    zone: 1,
    isInterchange: true,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 420, y: 310 }
  },
  {
    id: 'ST-MARINA',
    name: 'Marina Gateway',
    code: 'MRG',
    modes: ['metro'],
    lineIds: ['L-BLU'],
    zone: 1,
    isInterchange: false,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 520, y: 310 }
  },
  // Green Line (Crosstown)
  {
    id: 'ST-WESTEND',
    name: 'West End Cross',
    code: 'WEC',
    modes: ['metro'],
    lineIds: ['L-GRN'],
    zone: 2,
    isInterchange: false,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 100, y: 400 }
  },
  {
    id: 'ST-UNIV',
    name: 'University Square',
    code: 'UNV',
    modes: ['metro', 'bus'],
    lineIds: ['L-GRN', 'L-B42'],
    zone: 2,
    isInterchange: true,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 180, y: 400 }
  },
  {
    id: 'ST-MED',
    name: 'Medical Campus',
    code: 'MED',
    modes: ['metro', 'bus'],
    lineIds: ['L-GRN', 'L-B42'],
    zone: 2,
    isInterchange: true,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 410, y: 400 }
  },
  {
    id: 'ST-EASTPARK',
    name: 'East Parklands',
    code: 'EPK',
    modes: ['metro'],
    lineIds: ['L-GRN', 'L-ORG'],
    zone: 2,
    isInterchange: true,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 520, y: 400 }
  },
  // Orange Line
  {
    id: 'ST-INDNORTH',
    name: 'North Logistics Terminal',
    code: 'NLT',
    modes: ['metro'],
    lineIds: ['L-ORG'],
    zone: 3,
    isInterchange: false,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 520, y: 150 }
  },
  {
    id: 'ST-SOUTHQUAY',
    name: 'South Quay Port',
    code: 'SQP',
    modes: ['metro', 'ferry'],
    lineIds: ['L-ORG', 'L-FR1'],
    zone: 2,
    isInterchange: true,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 520, y: 500 }
  },
  // Commuter Rail
  {
    id: 'ST-COASTAL',
    name: 'Coastal Haven Junction',
    code: 'CHJ',
    modes: ['rail'],
    lineIds: ['L-CR1'],
    zone: 3,
    isInterchange: false,
    accessible: true,
    elevatorStatus: 'operational',
    coordinates: { x: 160, y: 90 }
  },
  // Ferry
  {
    id: 'ST-STJUDE',
    name: 'St. Jude Island Pier',
    code: 'SJI',
    modes: ['ferry'],
    lineIds: ['L-FR1'],
    zone: 2,
    isInterchange: false,
    accessible: false,
    elevatorStatus: 'operational',
    coordinates: { x: 470, y: 220 }
  }
];

export const INITIAL_LINES: TransitLine[] = [
  {
    id: 'L-RED',
    name: 'Red Line',
    code: 'RED',
    mode: 'metro',
    color: '#dc2626',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
    badgeText: 'text-red-700',
    routeDescription: 'Harbor Heights ↔ South Suburbs via Financial & Central',
    stationIds: ['ST-HARBOR', 'ST-TECH', 'ST-FINANCIAL', 'ST-CENTRAL', 'ST-CIVIC', 'ST-SOUTH-SUB'],
    operationalStatus: 'minor_delays',
    activeNoticeIds: ['ADV-2026-103'],
    headwayMinutes: 4,
    firstDeparture: '05:00',
    lastDeparture: '00:30'
  },
  {
    id: 'L-BLU',
    name: 'Blue Line (Airport Express)',
    code: 'BLU',
    mode: 'metro',
    color: '#2563eb',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'text-blue-700',
    routeDescription: 'Airport T3 ↔ Marina Gateway via Central & Waterfront',
    stationIds: ['ST-AIRPORT-T3', 'ST-AIRPORT-T1', 'ST-FINANCIAL', 'ST-CENTRAL', 'ST-WATERFRONT', 'ST-MARINA'],
    operationalStatus: 'minor_delays',
    activeNoticeIds: ['ADV-2026-102'],
    headwayMinutes: 6,
    firstDeparture: '04:45',
    lastDeparture: '01:15'
  },
  {
    id: 'L-GRN',
    name: 'Green Line (Crosstown)',
    code: 'GRN',
    mode: 'metro',
    color: '#16a34a',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-700',
    routeDescription: 'West End Cross ↔ East Parklands via University & Civic',
    stationIds: ['ST-WESTEND', 'ST-UNIV', 'ST-CIVIC', 'ST-MED', 'ST-EASTPARK'],
    operationalStatus: 'severe_delays',
    activeNoticeIds: ['ADV-2026-101'],
    headwayMinutes: 5,
    firstDeparture: '05:15',
    lastDeparture: '23:45'
  },
  {
    id: 'L-ORG',
    name: 'Orange Line',
    code: 'ORG',
    mode: 'metro',
    color: '#ea580c',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    badgeText: 'text-orange-700',
    routeDescription: 'North Logistics Terminal ↔ South Quay Port via East Parklands',
    stationIds: ['ST-INDNORTH', 'ST-EASTPARK', 'ST-SOUTHQUAY'],
    operationalStatus: 'good_service',
    activeNoticeIds: [],
    headwayMinutes: 8,
    firstDeparture: '05:30',
    lastDeparture: '23:15'
  },
  {
    id: 'L-B10',
    name: 'Bus 10 (Central Radial)',
    code: 'B10',
    mode: 'bus',
    color: '#0284c7',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeText: 'text-sky-700',
    routeDescription: 'Financial District ↔ South Suburbs via Central Station',
    stationIds: ['ST-FINANCIAL', 'ST-CENTRAL', 'ST-SOUTH-SUB'],
    operationalStatus: 'good_service',
    activeNoticeIds: [],
    headwayMinutes: 10,
    firstDeparture: '05:00',
    lastDeparture: '00:00'
  },
  {
    id: 'L-B42',
    name: 'Bus 42 (University & Med Express)',
    code: 'B42',
    mode: 'bus',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'text-purple-700',
    routeDescription: 'University Square ↔ Medical Campus Bypass',
    stationIds: ['ST-UNIV', 'ST-MED'],
    operationalStatus: 'minor_delays',
    activeNoticeIds: ['ADV-2026-105'],
    headwayMinutes: 12,
    firstDeparture: '06:00',
    lastDeparture: '23:00'
  },
  {
    id: 'L-CR1',
    name: 'North Coastal Commuter Rail',
    code: 'CR1',
    mode: 'rail',
    color: '#475569',
    badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
    badgeText: 'text-slate-700',
    routeDescription: 'Coastal Haven Junction ↔ Central Station (Regional Direct)',
    stationIds: ['ST-COASTAL', 'ST-CENTRAL'],
    operationalStatus: 'planned_works',
    activeNoticeIds: ['ADV-2026-106'],
    headwayMinutes: 20,
    firstDeparture: '05:30',
    lastDeparture: '22:30'
  },
  {
    id: 'L-FR1',
    name: 'Island Harbour Ferry',
    code: 'FR1',
    mode: 'ferry',
    color: '#0d9488',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    badgeText: 'text-teal-700',
    routeDescription: 'Waterfront Pier ↔ St. Jude Island ↔ South Quay Port',
    stationIds: ['ST-WATERFRONT', 'ST-STJUDE', 'ST-SOUTHQUAY'],
    operationalStatus: 'good_service',
    activeNoticeIds: ['ADV-2026-104'],
    headwayMinutes: 30,
    firstDeparture: '06:30',
    lastDeparture: '21:30'
  }
];

export const INITIAL_NOTICES: TransitNotice[] = [
  {
    id: 'ADV-2026-101',
    title: 'Green Line: Power Rail Urgent Inspection between Civic Center and Medical Campus',
    summary: 'Single-track operation in effect. Expect 15-20 min delays and reduced train frequency in both directions.',
    detail: 'A trackside power sensor anomaly detected at 08:42 requires electrical maintenance teams on the eastbound track between Civic Center and Medical Campus. Both eastbound and westbound trains are sharing the westbound track on alternating schedule under dispatcher manual block signalling.',
    severity: 'severe',
    category: 'delays',
    status: 'active',
    affectedLineIds: ['L-GRN'],
    affectedStationIds: ['ST-CIVIC', 'ST-MED'],
    startStationId: 'ST-CIVIC',
    endStationId: 'ST-MED',
    startTime: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    estimatedEndTime: new Date(Date.now() + 85 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    cause: 'Power rail impedance anomaly detected by automated supervisory track sensors.',
    effect: 'Single-track bottleneck; headways widened from 5 min to 16 min.',
    alternativeAdvice: 'Commuters traveling between University Square and Medical Campus are advised to transfer to Bus Route B42 at University Square. Bus 42 passes are being accepted with standard rail farecards.',
    broadcastChannels: {
      webPortal: true,
      stationSignage: true,
      passengerPush: true,
      gtfsRealtime: true,
      operatorAuditFeed: true
    },
    updates: [
      {
        id: 'UPD-101-1',
        timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
        authorRole: 'Chief Operations Officer',
        message: 'Initial detection: Track circuit alarm triggered at Milepost 4.8. Speed restricted to 15 km/h.',
        actionTaken: 'Dispatched emergency mobile electrical response unit (Crew 4).'
      },
      {
        id: 'UPD-101-2',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        authorRole: 'Lead Traction Power Dispatcher',
        message: 'Maintenance team on site. Eastbound track isolated for safety. Commenced single-track operation.',
        actionTaken: 'Coordinated mutual fare acceptance with Regional Bus operations.'
      },
      {
        id: 'UPD-101-3',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        authorRole: 'Passenger Information Controller',
        message: 'Station displays updated along Green Line corridor. Digital audio announcements broadcasting.',
        actionTaken: 'Published advisory across passenger web portal and GTFS-RT feed.'
      }
    ],
    gtfsEntityId: 'gtfs_alert_grn_pwr_101',
    priorityOrder: 1
  },
  {
    id: 'ADV-2026-102',
    title: 'Blue Line: Terminal 1 Platform Screen Door Sensor Recalibration',
    summary: 'Airport Terminal 1 eastbound trains boarding via Platform 2 only. Allow 4-6 minutes additional transfer time.',
    detail: 'Routine diagnostic test flagged a misalignment in screen door interlock gate 4 at Airport Terminal 1 & 2 Station. Train docking has been redirected to Platform 2 while contractors perform optical recalibration.',
    severity: 'minor',
    category: 'delays',
    status: 'active',
    affectedLineIds: ['L-BLU'],
    affectedStationIds: ['ST-AIRPORT-T1'],
    startTime: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    estimatedEndTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    cause: 'Infrared optical obstacle detection threshold deviation on screen gate 4.',
    effect: 'Eastbound departures consolidated onto Platform 2.',
    alternativeAdvice: 'Follow overhead directional signage at Terminal 1. Passenger assist staff stationed at mezzanine.',
    broadcastChannels: {
      webPortal: true,
      stationSignage: true,
      passengerPush: false,
      gtfsRealtime: true,
      operatorAuditFeed: true
    },
    updates: [
      {
        id: 'UPD-102-1',
        timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
        authorRole: 'Station Operations Supervisor',
        message: 'Gate 4 sensor fault reported by train 204 operator. Platform marshals deployed.',
        actionTaken: 'Track switch set to route incoming trains to Platform 2.'
      },
      {
        id: 'UPD-102-2',
        timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
        authorRole: 'Signalling Engineer',
        message: 'Recalibration in progress; test cycles 3/5 complete. Full service expected by 13:45.',
        actionTaken: 'Updated platform display monitors.'
      }
    ],
    gtfsEntityId: 'gtfs_alert_blu_gate_102',
    priorityOrder: 2
  },
  {
    id: 'ADV-2026-103',
    title: 'Red Line: Signal Interlocking Reset near Financial District - Residual Delays',
    summary: 'Signal automation restored. Trains moving with 3-5 min spacing as backlog clears between Harbor Heights and Central.',
    detail: 'At 09:15, a transient voltage sag caused the automatic interlocking computer at Financial District junction to enter fail-safe mode. Manual reset procedure completed successfully at 09:40. Service is steadily returning to scheduled timetable.',
    severity: 'minor',
    category: 'delays',
    status: 'resolving',
    affectedLineIds: ['L-RED'],
    affectedStationIds: ['ST-FINANCIAL', 'ST-CENTRAL'],
    startTime: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    estimatedEndTime: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    cause: 'Substation transient surge caused interlocking failsafe trip.',
    effect: 'Residual train spacing adjustments across central spine.',
    alternativeAdvice: 'Allow slight extra journey buffer if connecting to North Coastal Rail at Central Station.',
    broadcastChannels: {
      webPortal: true,
      stationSignage: true,
      passengerPush: true,
      gtfsRealtime: true,
      operatorAuditFeed: true
    },
    updates: [
      {
        id: 'UPD-103-1',
        timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
        authorRole: 'Control Center Dispatcher 1',
        message: 'Interlocking fail-safe engaged. Trains held at stations with signals set to stop.',
        actionTaken: 'Initiated manual dispatch verification protocol.'
      },
      {
        id: 'UPD-103-2',
        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        authorRole: 'Systems Lead',
        message: 'Interlocking computer rebooted and self-test verified clear. Automatic train control re-engaged.',
        actionTaken: 'Released train holding order.'
      },
      {
        id: 'UPD-103-3',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        authorRole: 'Operations Controller',
        message: 'Headway returning to 4-minute target. Final residual delay check in progress.',
        actionTaken: 'Preparing to close incident record.'
      }
    ],
    gtfsEntityId: 'gtfs_alert_red_sig_103',
    priorityOrder: 3
  },
  {
    id: 'ADV-2026-104',
    title: 'Island Harbour Ferry: Sea Fog Advisory & Reduced Vessel Velocity',
    summary: 'Harbour vessels operating under maritime fog safety protocols (max 12 knots). Crossing durations extended by 8-10 minutes.',
    detail: 'Dense sea fog bank over the outer channel has reduced visibility below 400 meters. Ferry captains are operating radar-guided passage with foghorn sounding every 90 seconds. All scheduled departures are operating.',
    severity: 'info',
    category: 'weather',
    status: 'active',
    affectedLineIds: ['L-FR1'],
    affectedStationIds: ['ST-WATERFRONT', 'ST-STJUDE', 'ST-SOUTHQUAY'],
    startTime: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    estimatedEndTime: new Date(Date.now() + 120 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    cause: 'Coastal thermal inversion creating low-lying marine fog.',
    effect: 'Vessel transit times prolonged from 18 min to 27 min.',
    alternativeAdvice: 'Passengers needing urgent connection to South Quay may use Red Line to Central and transfer to Bus B10.',
    broadcastChannels: {
      webPortal: true,
      stationSignage: true,
      passengerPush: false,
      gtfsRealtime: true,
      operatorAuditFeed: false
    },
    updates: [
      {
        id: 'UPD-104-1',
        timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
        authorRole: 'Harbour Master Maritime Office',
        message: 'Fog advisory level 2 declared for outer bay navigation channel.',
        actionTaken: 'Enforced 12-knot speed cap on all passenger ferries.'
      }
    ],
    gtfsEntityId: 'gtfs_alert_fr1_fog_104',
    priorityOrder: 4
  },
  {
    id: 'ADV-2026-105',
    title: 'Bus Route B42: Roadway Utility Emergency on 4th Avenue - Eastbound Detour',
    summary: 'Eastbound B42 buses diverted between 4th Ave and Elm St. Stops at Maple Square and Arts Center temporarily bypassed.',
    detail: 'Municipal water authority has cordoned off two lanes on 4th Avenue following a burst subterranean water main. Route B42 will detour via 6th Avenue until municipal road crews complete backfill operations.',
    severity: 'minor',
    category: 'maintenance',
    status: 'active',
    affectedLineIds: ['L-B42'],
    affectedStationIds: ['ST-UNIV', 'ST-MED'],
    startTime: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    estimatedEndTime: new Date(Date.now() + 240 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    cause: 'External municipal infrastructure emergency (water main breach).',
    effect: 'Bypassing two local street-level stops; 6-8 min running time increase.',
    alternativeAdvice: 'Riders for Arts Center should alight at University Square and use pedestrian promenade walkway.',
    broadcastChannels: {
      webPortal: true,
      stationSignage: true,
      passengerPush: true,
      gtfsRealtime: true,
      operatorAuditFeed: true
    },
    updates: [
      {
        id: 'UPD-105-1',
        timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
        authorRole: 'Surface Transit Dispatcher',
        message: 'Police requested immediate road closure on 4th Ave. Detour route 42-B activated.',
        actionTaken: 'Uploaded route detour coordinates to onboard bus computer navigation units.'
      }
    ],
    gtfsEntityId: 'gtfs_alert_b42_detour_105',
    priorityOrder: 5
  },
  {
    id: 'ADV-2026-106',
    title: 'North Coastal Rail: Scheduled Weekend Track Renewal & Catenary Replacement',
    summary: 'Upcoming planned works: Nov 7-8. Express rail coaches will replace trains between Coastal Haven and Central.',
    detail: 'Annual heavy infrastructure maintenance: 14 km of continuous welded rail will be resurfaced and overhead copper catenary wires replaced. Full bus substitution timetable is now available for download.',
    severity: 'info',
    category: 'maintenance',
    status: 'active',
    affectedLineIds: ['L-CR1'],
    affectedStationIds: ['ST-COASTAL', 'ST-CENTRAL'],
    startTime: '2026-11-07T05:00:00Z',
    estimatedEndTime: '2026-11-08T23:59:00Z',
    lastUpdated: new Date(Date.now() - 1440 * 60 * 1000).toISOString(),
    cause: 'Planned capital renewal program to maintain high-speed corridor safety standards.',
    effect: 'Track possession; full bus replacement operation.',
    alternativeAdvice: 'Buses will depart from Central Station West Concourse Bay 4 every 20 minutes.',
    broadcastChannels: {
      webPortal: true,
      stationSignage: true,
      passengerPush: false,
      gtfsRealtime: true,
      operatorAuditFeed: false
    },
    updates: [
      {
        id: 'UPD-106-1',
        timestamp: new Date(Date.now() - 1440 * 60 * 1000).toISOString(),
        authorRole: 'Capital Infrastructure Planning',
        message: 'Work order #CW-882 finalized. 30 high-capacity replacement coaches contracted.',
        actionTaken: 'Advance advisory posted 6 days ahead of scheduled possession.'
      }
    ],
    gtfsEntityId: 'gtfs_alert_cr1_plan_106',
    priorityOrder: 6
  },
  {
    id: 'ADV-2026-107',
    title: 'Civic Center Station: West Concourse Elevator Out of Service for Overhaul',
    summary: 'West Concourse lift out of service. Step-free access to Platform 1 available via East Concourse ramp.',
    detail: 'Modernization of lift hydraulics and emergency interlock controllers. Step-free access is fully maintained via the East Concourse entrance located 80 meters along Civic Blvd.',
    severity: 'info',
    category: 'elevator',
    status: 'active',
    affectedLineIds: ['L-RED', 'L-GRN'],
    affectedStationIds: ['ST-CIVIC'],
    startTime: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    estimatedEndTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    cause: 'Scheduled hydraulic cylinder replacement.',
    effect: 'Temporary change to step-free path of travel at Civic Center.',
    alternativeAdvice: 'Station staff are available at the East Concourse information desk to assist passengers requiring guidance.',
    broadcastChannels: {
      webPortal: true,
      stationSignage: true,
      passengerPush: false,
      gtfsRealtime: true,
      operatorAuditFeed: false
    },
    updates: [
      {
        id: 'UPD-107-1',
        timestamp: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
        authorRole: 'Facilities & Accessibility Manager',
        message: 'Contractor Schindler Mobility commenced hydraulic replacement.',
        actionTaken: 'Tactile directional mats installed pointing passengers to East Concourse ramp.'
      }
    ],
    gtfsEntityId: 'gtfs_alert_cvc_elev_107',
    priorityOrder: 7
  }
];

export const INITIAL_COMMUTER_REPORTS: CommuterReport[] = [
  {
    id: 'REP-8041',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    lineId: 'L-GRN',
    stationId: 'ST-CIVIC',
    issueType: 'overcrowding',
    description: 'Crowd building up rapidly on westbound platform due to the Green Line single-tracking delays.',
    status: 'investigating',
    upvotes: 9,
    reporterName: 'David K. (Commuter)'
  },
  {
    id: 'REP-8040',
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    lineId: 'L-BLU',
    stationId: 'ST-AIRPORT-T1',
    issueType: 'delay',
    description: 'Announcement at Terminal 1 said to change platforms, smooth boarding on Platform 2.',
    status: 'verified_notice_created',
    upvotes: 4,
    reporterName: 'Elena V.'
  },
  {
    id: 'REP-8039',
    timestamp: new Date(Date.now() - 52 * 60 * 1000).toISOString(),
    lineId: 'L-RED',
    stationId: 'ST-CENTRAL',
    issueType: 'audio_fault',
    description: 'Platform 3 PA speaker seems muffled during service disruption notices.',
    status: 'received',
    upvotes: 2,
    reporterName: 'Anonymous Rider'
  }
];

export const INITIAL_SUBSCRIPTIONS: LineSubscription[] = [
  {
    lineId: 'L-RED',
    notifyOnMinor: true,
    notifyOnSevere: true,
    notifyOnPlanned: true,
    emailAlerts: true,
    pushAlerts: true
  },
  {
    lineId: 'L-GRN',
    notifyOnMinor: false,
    notifyOnSevere: true,
    notifyOnPlanned: false,
    emailAlerts: false,
    pushAlerts: true
  }
];
