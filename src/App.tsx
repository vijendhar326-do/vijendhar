import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';

// Core Business Views
import { MainDashboard } from './components/dashboard/MainDashboard';
import { DailyStoneTransfers } from './components/transfers/DailyStoneTransfers';
import { ShipmentManagement } from './components/shipments/ShipmentManagement';
import { LiveGpsTracking } from './components/tracking/LiveGpsTracking';
import { RouteManagement } from './components/routes/RouteManagement';
import { InventoryManagement } from './components/inventory/InventoryManagement';
import { TruckManagement } from './components/fleet/TruckManagement';
import { DriverManagement } from './components/drivers/DriverManagement';
import { MaintenanceManagement } from './components/maintenance/MaintenanceManagement';
import { DeliveryProof } from './components/epod/DeliveryProof';
import { DriverMobileApp } from './components/driver-view/DriverMobileApp';
import { DailyTonsDashboard } from './components/tons/DailyTonsDashboard';
import { DailyAccounts } from './components/accounts/DailyAccounts';
import { FuelManagement } from './components/fuel/FuelManagement';
import { ExpenseManagement } from './components/expenses/ExpenseManagement';
import { ProfitLossDashboard } from './components/finance/ProfitLossDashboard';
import { BillingInvoices } from './components/billing/BillingInvoices';
import { CustomerManagement } from './components/customers/CustomerManagement';
import { DailyClosing } from './components/closing/DailyClosing';
import { TargetsManagement } from './components/targets/TargetsManagement';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics';
import { SettingsManagement } from './components/settings/SettingsManagement';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MainDashboard />;
      case 'transfers':
        return <DailyStoneTransfers />;
      case 'shipments':
        return <ShipmentManagement />;
      case 'tracking':
        return <LiveGpsTracking />;
      case 'routes':
        return <RouteManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'trucks':
        return <TruckManagement />;
      case 'drivers':
        return <DriverManagement />;
      case 'maintenance':
        return <MaintenanceManagement />;
      case 'pod':
        return <DeliveryProof />;
      case 'driver-view':
        return <DriverMobileApp />;
      case 'tons':
        return <DailyTonsDashboard />;
      case 'accounts':
        return <DailyAccounts />;
      case 'fuel':
        return <FuelManagement />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'profit-loss':
        return <ProfitLossDashboard />;
      case 'billing':
        return <BillingInvoices />;
      case 'customers':
        return <CustomerManagement />;
      case 'daily-closing':
        return <DailyClosing />;
      case 'targets':
        return <TargetsManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-150">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Global Search Modal (⌘K) */}
      <GlobalSearchModal />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header Navbar */}
        <Header toggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)} />

        {/* Dynamic Route View Page */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Enterprise Footer */}
        <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-3.5 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 dark:text-slate-200">GraniteTrack Pro™</span>
            <span>• Commercial Fleet & Quarry Operations</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Active Financial Year: 2026-27</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">● Database Synced</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
