import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building2,
  Bell,
  Shield,
  Layers,
  MapPin,
  CreditCard,
  Save,
  CheckCircle2,
  Users,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const SettingsManagement: React.FC = () => {
  const { isDarkMode, toggleDarkMode, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'company' | 'stone_rates' | 'alerts' | 'users'>('company');
  const [isSaved, setIsSaved] = useState(false);

  const [companyData, setCompanyData] = useState({
    name: 'GraniteTrack Pro Logistics Pvt Ltd',
    gstin: '33AAACG9921E1ZQ',
    phone: '+91 98421 88990',
    email: 'billing@granitetrackpro.in',
    address: 'Plot 42, SIPCOT Heavy Industrial Estate, Phase 2, Hosur, Tamil Nadu - 635126',
    bankName: 'HDFC Bank Ltd',
    accountNumber: '50200049281920',
    ifscCode: 'HDFC0001892',
    branch: 'Hosur Industrial Complex Branch',
  });

  const [stoneRates, setStoneRates] = useState([
    { type: 'Absolute Black (Hosur Premium)', baseRatePerTon: 2400 },
    { type: 'Black Galaxy (Chimakurthy Gold Star)', baseRatePerTon: 3200 },
    { type: 'Tan Brown (Karimnagar)', baseRatePerTon: 2100 },
    { type: 'Kashmir White (Madurai Melur)', baseRatePerTon: 2650 },
    { type: 'Vizag Blue (Srikakulam)', baseRatePerTon: 2800 },
    { type: 'Hassan Green', baseRatePerTon: 2300 },
    { type: 'Steel Grey (Ongole)', baseRatePerTon: 1950 },
    { type: 'Paradiso Multi-Color (Krishnagiri)', baseRatePerTon: 2200 },
  ]);

  const [notifications, setNotifications] = useState({
    whatsappTripDispatched: true,
    whatsappDeliveryConfirmed: true,
    smsFuelTheftAnomaly: true,
    emailDailyClosingReport: true,
    speedAlertsOver80Kmh: true,
    documentExpiryReminder30Days: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 text-white shadow-md">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              System Settings & Enterprise Configuration
            </h1>
            <p className="text-xs text-slate-500">
              GST company billing profiles, master stone tariffs, WhatsApp notification webhooks, and team access
            </p>
          </div>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Preferences Updated!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('company')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'company'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Building2 className="w-4 h-4" /> Company & Bank Profile
        </button>

        <button
          onClick={() => setActiveTab('stone_rates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'stone_rates'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" /> Master Stone Tariffs
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'alerts'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Bell className="w-4 h-4" /> WhatsApp & Telemetry Alerts
        </button>
      </div>

      {/* Company Profile Tab */}
      {activeTab === 'company' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
            Company Billing Information (Printed on Tax Invoices)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Registered Legal Name</label>
              <input
                type="text"
                value={companyData.name}
                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={companyData.gstin}
                onChange={(e) => setCompanyData({ ...companyData, gstin: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold dark:text-white uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={companyData.phone}
                onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Billing Email</label>
              <input
                type="email"
                value={companyData.email}
                onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Registered Yard & Head Office Address</label>
              <textarea
                rows={2}
                value={companyData.address}
                onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 pt-2">
            Bank Settlement Details for RTGS / NEFT Payments
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Bank Name</label>
              <input
                type="text"
                value={companyData.bankName}
                onChange={(e) => setCompanyData({ ...companyData, bankName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Number</label>
              <input
                type="text"
                value={companyData.accountNumber}
                onChange={(e) => setCompanyData({ ...companyData, accountNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">IFSC Code</label>
              <input
                type="text"
                value={companyData.ifscCode}
                onChange={(e) => setCompanyData({ ...companyData, ifscCode: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold dark:text-white uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Branch Name</label>
              <input
                type="text"
                value={companyData.branch}
                onChange={(e) => setCompanyData({ ...companyData, branch: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30"
            >
              <Save className="w-4 h-4" /> Save Company Profile
            </button>
          </div>
        </form>
      )}

      {/* Stone Rates Tab */}
      {activeTab === 'stone_rates' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Default Quarry Transportation Tariffs (₹ per Ton)
              </h3>
              <p className="text-xs text-slate-500">Auto-filled in new transfer dispatch slips</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stoneRates.map((sr, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{sr.type}</div>
                  <div className="text-[11px] text-slate-400">Standard Transit Rate</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    value={sr.baseRatePerTon}
                    onChange={(e) => {
                      const updated = [...stoneRates];
                      updated[idx].baseRatePerTon = Number(e.target.value);
                      setStoneRates(updated);
                    }}
                    className="w-24 p-1.5 text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-right"
                  />
                  <span className="text-[11px] text-slate-400">/ Ton</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp & Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
            Automated WhatsApp & Telemetry Notification Triggers
          </h3>

          <div className="space-y-3">
            {Object.entries(notifications).map(([key, val]) => (
              <label
                key={key}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </div>
                  <div className="text-[11px] text-slate-400">Instant notification to manager & driver via API</div>
                </div>
                <input
                  type="checkbox"
                  checked={val}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
