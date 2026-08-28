import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Truck,
  Users,
  Fuel,
  Receipt,
  BarChart3,
  TrendingUp,
  FileText,
  Wrench,
  CheckSquare,
  FileSpreadsheet,
  Target,
  DollarSign,
  Package,
  Layers,
  Building2,
  CalendarCheck,
  Smartphone,
  Settings,
  Compass,
  MapPin,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, currentRole, trips, alerts } = useApp();

  const unreadCount = alerts.filter((a) => !a.read).length;

  const navGroups = [
    {
      title: 'Operations & Quarry',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        {
          id: 'transfers',
          label: 'Daily Stone Transfers',
          icon: Layers,
          badge: trips.filter((t) => t.date === '2026-08-28').length ? '24 Today' : undefined,
          badgeColor: 'bg-blue-600 text-white',
        },
        { id: 'shipments', label: 'Shipment Pipeline', icon: Package },
        { id: 'tracking', label: 'Live GPS Tracking', icon: Compass, badge: 'LIVE', badgeColor: 'bg-emerald-500 text-white animate-pulse' },
        { id: 'routes', label: 'Quarry Routes & Map', icon: MapPin },
        { id: 'inventory', label: 'Granite Stock & Types', icon: Layers },
      ],
    },
    {
      title: 'Fleet & Personnel',
      items: [
        { id: 'trucks', label: 'Fleet Management', icon: Truck, badge: '8 Trucks' },
        { id: 'drivers', label: 'Driver Management', icon: Users, badge: '8 Drivers' },
        { id: 'maintenance', label: 'Maintenance & Service', icon: Wrench },
        { id: 'pod', label: 'Proof of Delivery (POD)', icon: CheckSquare },
        { id: 'driver-view', label: 'Driver Mobile App', icon: Smartphone, badge: 'Mobile' },
      ],
    },
    {
      title: 'Accounts & Finance',
      items: [
        { id: 'tons', label: 'Daily Tons Analytics', icon: BarChart3 },
        { id: 'accounts', label: 'Daily Accounts / Rupees', icon: DollarSign },
        { id: 'fuel', label: 'Fuel Management', icon: Fuel },
        { id: 'expenses', label: 'Expense Tracking', icon: Receipt },
        { id: 'profit-loss', label: 'Automatic Profit & Loss', icon: TrendingUp },
        { id: 'billing', label: 'Billing & Invoices', icon: FileText },
        { id: 'customers', label: 'Customers & Ledgers', icon: Building2 },
      ],
    },
    {
      title: 'Settlement & Reports',
      items: [
        { id: 'daily-closing', label: 'Daily EOD Closing', icon: CalendarCheck, badge: 'Essential' },
        { id: 'targets', label: 'Monthly Targets', icon: Target },
        { id: 'reports', label: 'Reports Hub (PDF/CSV)', icon: FileSpreadsheet },
        { id: 'settings', label: 'Company Settings', icon: Settings },
      ],
    },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-md ring-1 ring-white/20">
              🪨
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">GraniteTrack</span>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-500 text-white">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                Fleet & Tons Management
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-link-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                            item.badgeColor || (isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400')
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer / Quick Slogan Card */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              GraniteTrack Pro
            </div>
            <p className="text-[11px] text-slate-300 italic mt-0.5">
              "Manage Every Ton. Every Truck. Every Rupee."
            </p>
            <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
              <span>v2.8 Commercial</span>
              <span className="text-emerald-400 font-mono">TN • KA • AP</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
