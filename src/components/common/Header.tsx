import React, { useState, useEffect, useRef } from 'react';
import { useTransit } from '../../context/TransitContext';
import { ViewMode } from '../../types/transit';
import { 
  Radio, 
  SlidersHorizontal, 
  Search, 
  Clock, 
  LayoutDashboard, 
  Tv, 
  MapPin, 
  FileCode2, 
  MessageSquarePlus,
  Compass
} from 'lucide-react';
import { formatTime24 } from '../../utils/transitFormatters';
import { SimulationControlModal } from './SimulationControlModal';
import { CommuterReportModal } from '../passenger/CommuterReportModal';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    notices,
    currentTime,
    searchQuery,
    setSearchQuery,
    operatorRole
  } = useTransit();

  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: '/' focuses search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeNoticeCount = notices.filter(n => n.status === 'active').length;

  const navItems: Array<{ id: ViewMode; label: string; icon: React.ReactNode; badge?: number }> = [
    {
      id: 'passenger',
      label: 'Passenger Portal',
      icon: <Compass className="w-4 h-4" />
    },
    {
      id: 'operator',
      label: 'Operations Room',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: activeNoticeCount
    },
    {
      id: 'signage',
      label: 'Station Signage',
      icon: <Tv className="w-4 h-4" />
    },
    {
      id: 'network_map',
      label: 'Network Schematic',
      icon: <MapPin className="w-4 h-4" />
    },
    {
      id: 'gtfs_api',
      label: 'GTFS-RT Feed',
      icon: <FileCode2 className="w-4 h-4" />
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        {/* Top utility bar */}
        <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-semibold text-white tracking-wide uppercase text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                MCTA Network Service Status
              </span>
              <span className="text-slate-400 hidden sm:inline">|</span>
              <span className="text-slate-300 hidden sm:inline">
                MetroConnect Transit Authority
              </span>
              <span className="text-slate-400 hidden md:inline">|</span>
              <span className="text-slate-400 text-[11px] hidden md:inline">
                Role: <strong className="text-slate-200">{operatorRole}</strong>
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1 text-slate-300 tabular-nums">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatTime24(currentTime)}</span>
                <span className="text-slate-400">EST</span>
              </div>
              <button
                onClick={() => setIsSimModalOpen(true)}
                className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-2 py-0.5 rounded transition-colors"
                title="Open Simulation & Sandbox Controls"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                <span>Simulation Controls</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer select-none shrink-0"
              onClick={() => setCurrentView('passenger')}
            >
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs border border-slate-800">
                <Radio className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none font-sans">
                    Transit<span className="text-blue-600">Notice</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                    v2.4 Pro
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">
                  Real-time Advisory & Operations Feed
                </p>
              </div>
            </div>

            {/* Quick Search */}
            <div className="hidden lg:flex flex-1 max-w-xs relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search advisories, lines, stations... (/)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Commuter Action: Report issue */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-amber-50 text-amber-900 border border-amber-200/90 rounded-lg hover:bg-amber-100 active:bg-amber-200 transition-colors shadow-xs"
              >
                <MessageSquarePlus className="w-4 h-4 text-amber-700" />
                <span className="hidden sm:inline">Report Service Issue</span>
                <span className="sm:hidden">Report</span>
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1 border-t border-slate-100 -mb-px">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-t-md transition-all whitespace-nowrap border-b-2 ${
                    isActive
                      ? 'border-blue-600 text-blue-700 bg-blue-50/40'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Modals */}
      <SimulationControlModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
      />
      <CommuterReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </>
  );
};
