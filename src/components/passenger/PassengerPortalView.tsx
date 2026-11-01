import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { LineStatusOverview } from './LineStatusOverview';
import { AdvisoryFeed } from './AdvisoryFeed';
import { NoticeDetailModal } from './NoticeDetailModal';
import { RouteImpactChecker } from './RouteImpactChecker';
import { StationDepartureBoard } from './StationDepartureBoard';
import { MySubscriptionsPanel } from './MySubscriptionsPanel';
import { Tabs, TabItem } from '../ui/Tabs';
import { 
  AlertCircle, 
  Clock, 
  Navigation, 
  Bell 
} from 'lucide-react';

export const PassengerPortalView: React.FC = () => {
  const {
    notices,
    subscriptions,
    selectedLineId,
    setSelectedLineId,
    selectedNoticeId,
    setSelectedNoticeId
  } = useTransit();

  const [activePassengerTab, setActivePassengerTab] = useState<'advisories' | 'departures' | 'journey' | 'subscriptions'>('advisories');

  const activeNoticeCount = notices.filter(n => n.status === 'active').length;

  const tabs: TabItem[] = [
    {
      id: 'advisories',
      label: 'Live Advisories & Delays',
      icon: <AlertCircle className="w-4 h-4" />,
      badge: activeNoticeCount
    },
    {
      id: 'departures',
      label: 'Station Departures & PA',
      icon: <Clock className="w-4 h-4" />
    },
    {
      id: 'journey',
      label: 'Check My Commute',
      icon: <Navigation className="w-4 h-4" />
    },
    {
      id: 'subscriptions',
      label: 'My Pinned Lines',
      icon: <Bell className="w-4 h-4" />,
      badge: subscriptions.length > 0 ? subscriptions.length : undefined
    }
  ];

  return (
    <div className="space-y-6">
      {/* Network Overview Grid */}
      <LineStatusOverview
        selectedLineId={selectedLineId}
        onSelectLine={setSelectedLineId}
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-200 pb-2">
        <Tabs
          tabs={tabs}
          activeTab={activePassengerTab}
          onChange={(id) => setActivePassengerTab(id as typeof activePassengerTab)}
        />
      </div>

      {/* Tab Panels */}
      {activePassengerTab === 'advisories' && (
        <AdvisoryFeed
          onSelectNotice={(id) => setSelectedNoticeId(id)}
          selectedLineId={selectedLineId}
        />
      )}

      {activePassengerTab === 'departures' && (
        <StationDepartureBoard />
      )}

      {activePassengerTab === 'journey' && (
        <RouteImpactChecker />
      )}

      {activePassengerTab === 'subscriptions' && (
        <MySubscriptionsPanel />
      )}

      {/* Notice Detail Modal */}
      <NoticeDetailModal
        noticeId={selectedNoticeId}
        onClose={() => setSelectedNoticeId(null)}
      />
    </div>
  );
};
