import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import CommandPalette from '../components/CommandPalette';
import AICopilotDrawer from '../components/AICopilotDrawer';
import AskWhyModal from '../components/AskWhyModal';
import PriorityPlanDrawer from '../components/PriorityPlanDrawer';
import NotificationCenterDrawer from '../components/NotificationCenterDrawer';
import ProductTourModal from '../components/ProductTourModal';
import { useCommandPalette } from '../hooks/useCommandPalette';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [askWhyOpen, setAskWhyOpen] = useState(false);
  const [priorityPlanOpen, setPriorityPlanOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const { isOpen: cmdOpen, openPalette, closePalette } = useCommandPalette();

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#0F172A] flex font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-[220px] flex flex-col min-w-0">
        <Topbar
          setMobileOpen={setMobileOpen}
          onOpenCommandPalette={openPalette}
          onOpenCopilot={() => setCopilotOpen(true)}
          onOpenAskWhy={() => setAskWhyOpen(true)}
          onOpenPriorityPlan={() => setPriorityPlanOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
          onOpenTour={() => setTourOpen(true)}
        />
        <main className="flex-1 p-5 sm:p-6 lg:p-7">
          <Outlet />
        </main>
      </div>

      <CommandPalette 
        isOpen={cmdOpen} 
        onClose={closePalette}
        onOpenCopilot={() => setCopilotOpen(true)} 
        onOpenAskWhy={() => setAskWhyOpen(true)} 
        onOpenPriorityPlan={() => setPriorityPlanOpen(true)} 
      />
      <AICopilotDrawer 
        isOpen={copilotOpen} 
        onClose={() => setCopilotOpen(false)}
        onOpenAskWhy={() => setAskWhyOpen(true)} 
        onOpenPriorityPlan={() => setPriorityPlanOpen(true)} 
      />
      <AskWhyModal 
        isOpen={askWhyOpen} 
        onClose={() => setAskWhyOpen(false)} 
      />
      <PriorityPlanDrawer 
        isOpen={priorityPlanOpen} 
        onClose={() => setPriorityPlanOpen(false)} 
      />
      <NotificationCenterDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
      <ProductTourModal
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
      />
    </div>
  );
}
