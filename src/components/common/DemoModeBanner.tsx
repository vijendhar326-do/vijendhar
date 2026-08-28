import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, RefreshCw, UserCheck, Sparkles, Smartphone, Monitor } from 'lucide-react';

export const DemoModeBanner: React.FC = () => {
  const { currentRole, loginAs, resetAllDataToDefault, activeTab, setActiveTab } = useApp();

  return (
    <aside aria-label="Demo Mode Controls" className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-inner">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          PORTFOLIO SHOWCASE MODE
        </span>
        <span className="text-slate-400 hidden sm:inline">
          Realistic Indian Granite Logistics Telemetry (Hosur • Madurai • Chimakurthy • Chennai Port)
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          <span className="text-slate-400 px-2 py-1 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Switch Role:</span>
          </span>
          <button
            id="btn-role-admin"
            onClick={() => loginAs('admin')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              currentRole === 'admin'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Admin
          </button>
          <button
            id="btn-role-manager"
            onClick={() => loginAs('manager')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              currentRole === 'manager'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Manager
          </button>
          <button
            id="btn-role-driver"
            onClick={() => loginAs('driver')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              currentRole === 'driver'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Driver
          </button>
        </div>

        {currentRole === 'driver' ? (
          <button
            id="btn-switch-admin-view"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-all font-medium"
          >
            <Monitor className="w-3.5 h-3.5 text-blue-400" />
            Dashboard View
          </button>
        ) : (
          <button
            id="btn-switch-driver-view"
            onClick={() => setActiveTab('driver-view')}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-all font-medium"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            Driver Mobile App
          </button>
        )}

        <button
          id="btn-reset-demo-data"
          onClick={() => {
            if (window.confirm('Reset all demo data back to default values?')) {
              resetAllDataToDefault();
            }
          }}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 rounded border border-slate-700 hover:border-red-800 transition-all"
          title="Reset back to initial dataset"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden lg:inline">Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
};
