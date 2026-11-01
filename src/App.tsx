import React from 'react';
import { TransitProvider, useTransit } from './context/TransitContext';
import { Header } from './components/common/Header';
import { EmergencyBanner } from './components/common/EmergencyBanner';
import { ToastContainer } from './components/ui/Toast';
import { PassengerPortalView } from './components/passenger/PassengerPortalView';
import { OperationsDashboard } from './components/operator/OperationsDashboard';
import { StationSignageView } from './components/signage/StationSignageView';
import { NetworkSchematicMap } from './components/network/NetworkSchematicMap';
import { GTFSFeedExplorer } from './components/network/GTFSFeedExplorer';
import { ShieldCheck, HeartHandshake, FileCode, Radio } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView } = useTransit();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Civil Emergency Alert Banner */}
      <EmergencyBanner />

      {/* Main Global Navigation */}
      <Header />

      {/* Primary Workspace View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentView === 'passenger' && <PassengerPortalView />}
        {currentView === 'operator' && <OperationsDashboard />}
        {currentView === 'signage' && <StationSignageView />}
        {currentView === 'network_map' && <NetworkSchematicMap />}
        {currentView === 'gtfs_api' && <GTFSFeedExplorer />}
      </main>

      {/* Professional Civic Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 text-xs text-slate-500 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-blue-400 font-bold">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">
                MetroConnect Transit Authority (MCTA) • TransitNotice Platform
              </p>
              <p className="text-[11px] text-slate-400">
                Official Metropolitan Incident Management & Public Passenger Advisory System
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-slate-600 text-[11px]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>WCAG 2.1 AAA Accessible</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-emerald-600" />
              <span>GTFS-RT 2.0 Open Feed Certified</span>
            </span>
            <span className="flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
              <span>24/7 Operations Desk</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TransitProvider>
      <MainContent />
    </TransitProvider>
  );
};

export default App;
