# TransitNotice — Metropolitan Public Transit Advisory & Operations Platform

> **MetroConnect Transit Authority (MCTA)**  
> Production-grade, human-crafted civic transit advisory management and real-time passenger information display platform.

---

## 🚇 Executive Product Overview

**TransitNotice** is a commercial-grade public transit advisory and incident lifecycle management system engineered for municipal transportation authorities, train/bus dispatchers, station operations controllers, and daily commuters.

Built from the ground up to reflect the operational standards of major world transit networks (such as TfL, MTA, and SMRT), TransitNotice provides unified multi-modal service status broadcasting across web portals, digital station signage, GTFS-Realtime open data feeds, and passenger alert subscriptions.

---

## 🌟 Core Functional Architecture

### 1. 🧭 Passenger Portal (Commuter View)
* **Real-Time Network Matrix**: High-level operational health indicators across Metro (Red, Blue, Green, Orange), Express Buses (B10, B42), Regional Commuter Rail (CR1), and Island Ferries (FR1).
* **Live Service Advisories Feed**: Filterable by transit mode, disruption severity (Severe/Suspended, Moderate, Minor, Informational), and full-text keyword search across lines, stations, and incident causes.
* **Advisory Modal & Multi-Channel Briefing**: Detailed breakdown including affected corridor, root cause, service impact, step-by-step dispatcher update timeline, and prominent **Alternative Commuter Travel Guidance**.
* **Audio Station Announcement Synthesizer**: Recreates authentic transit chime chords (`F4 → A4 → C5 → F5`) using the browser's native Web Audio API, paired with speech synthesis for accessible verbal station announcements.
* **"Check My Commute" (Journey Impact Calculator)**: Select origin and destination stations; the system analyzes active line possessions and provides rerouting detours if disrupted.
* **Station Departure Concourse**: Dynamic departure countdowns (`2 min`, `6 min`, `12 min`), scheduled vs. expected times, platform assignments, wheelchair step-free indicators, and delay notifications.
* **Commuter Alert Subscriptions**: Pin preferred commute lines and manage local push notifications or email digests with simulated alert delivery tests.
* **Crowdsourced Field Reporting**: Commuters can submit real-time reports (overcrowding, lift outages, signal delays), which feed straight into the Central Dispatcher Triage Queue.

### 2. 🎛️ Operations Room (Incident Commander)
* **Operational Availability Metrics**: Service Availability %, Active Disruption count, Mean Time to Clear (MTTC), and live subscriber broadcast reach.
* **Incident Composer & Dispatcher**:
  - Multi-line & station corridor selectors.
  - Severity classification & root cause tagging.
  - Plain-language commuter advice builder.
  - Multi-channel push toggles (Web, Station Signage, GTFS-RT, Mobile Push).
  - Built-in incident templates (*Signal Automation Reset*, *Platform Screen Gate Obstruction*, *High Wind Viaduct Restrictions*).
  - Side-by-side Passenger Presentation Preview before publishing.
* **Incident Lifecycle Management**:
  - Escalate or de-escalate disruption severity.
  - Append timestamped dispatcher log entries with authenticated operator roles.
  - Mark incidents as resolved with debrief logs that automatically restore normal line health.
* **Crowdsource Reports Triage Desk**: Review passenger reports, track commuter confirmations/upvotes, and convert verified field reports directly into official advisories with a single click.

### 3. 📺 Station Digital Signage Mode (PIDS)
* High-contrast split-screen terminal display engineered for 55"+ station monitors and concourse kiosks.
* Real-time flipboard departure tables with live countdowns, blinking `BOARDING` indicators, and platform assignments.
* Station accessibility status panel (elevator/lift health).
* Bottom ticker marquee cycling through active advisories.
* One-click "Platform PA Chime" simulation.

### 4. 🗺️ Interactive Network Schematic
* SVG metropolitan transit map with clean transit cartography.
* Disrupted track segments clearly highlighted with animated amber/red warning halos.
* Interactive station nodes: hover and click any station to inspect serving lines, headway frequencies, and active alerts.

### 5. 📡 GTFS-Realtime (GTFS-RT) Open Data Feed Explorer
* 100% compliant with the official **General Transit Feed Specification - Realtime (GTFS-RT 2.0)** Service Alerts standard.
* Real-time JSON generation from active transit notices.
* Includes entity selectors (`informed_entity`), time ranges (`active_period`), cause/effect mapping, and translation objects.
* One-click "Download Feed (.json)" and cURL query generator for transit app developers.

### 6. 🛠️ Operations & Simulation Sandbox Controls
* Accessible from the top header navigation (`Simulation Controls`).
* **Inject Simulated Incident**: Randomly injects realistic supervisory track issues to demo live recalculations.
* **Restore Default Baseline**: Restores verified baseline data with zero leftover test artifacts.
* **Civil Transit Emergency Override**: Broadcasts high-priority civil emergency banners across all views.
* **State Portability**: Export and import full JSON operational state backups.

---

## 📐 Technology Stack & Engineering Standards

* **Framework**: React 18.3 + TypeScript 5.7 (Strict Type Checking)
* **Build System**: Vite 6.1 (Production build in ~13s)
* **Styling**: Tailwind CSS 3.4 with custom transit design tokens
* **Icons**: Lucide React
* **Audio Engine**: Native Web Audio API + SpeechSynthesis API
* **State Architecture**: Strongly-typed React Context with resilient LocalStorage persistence and synchronization
* **Accessibility**: High-contrast WCAG 2.1 AAA color ratios, semantic HTML5, keyboard navigation (`/` shortcut for search, `Esc` for modals), and tactile ARIA live regions.

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+ (tested on Node.js v24.12.0)
* npm v9+

### Installation & Run
```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle with TypeScript checking
npm run build

# Preview production build
npm run preview
```

---

## 🏛️ Transit Authority Data Baseline

* **Red Line (RED)**: Metro spine • Harbor Heights ↔ South Suburbs via Financial & Central
* **Blue Line (BLU)**: Airport Express • Airport Terminals ↔ Marina Gateway via Waterfront
* **Green Line (GRN)**: Crosstown Metro • West End ↔ East Parklands via University & Civic Center
* **Orange Line (ORG)**: Metro • North Logistics Hub ↔ South Quay Port
* **Bus 10 (B10)**: Radial Bus • Financial District ↔ South Suburbs
* **Bus 42 (B42)**: Crosstown Express • University Square ↔ Medical Campus Bypass
* **North Coastal Rail (CR1)**: Regional Commuter Rail • Coastal Haven ↔ Central Grand
* **Island Harbour Ferry (FR1)**: Maritime Transit • Pier 4 ↔ St. Jude Island

---

## 🔒 License
Proprietary software developed for **MetroConnect Transit Authority (MCTA)**. All rights reserved.
