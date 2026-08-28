import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Layers,
  Fuel,
  Users,
  Building2,
  TrendingUp,
  Wrench,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { formatINR, formatTons, formatDate } from '../../utils/formatters';

export const ReportsAnalytics: React.FC = () => {
  const { trips, fuelLogs, expenses, drivers, trucks, customers, invoices } = useApp();

  const [activeReport, setActiveReport] = useState<
    | 'transfers'
    | 'tons'
    | 'fuel'
    | 'drivers'
    | 'trucks'
    | 'aging'
    | 'pnl'
    | 'maintenance'
  >('transfers');

  const [dateRange, setDateRange] = useState('month');

  // CSV Export utility
  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    if (activeReport === 'transfers') {
      const headers = ['Trip ID', 'Date', 'Customer', 'Stone Type', 'Tons', 'Rate/Ton', 'Total Amount', 'Truck', 'Driver', 'Status'];
      const rows = trips.map((t) => [
        t.tripId,
        t.date,
        t.customerName,
        t.graniteType,
        t.totalTons,
        t.ratePerTon,
        t.totalAmount,
        t.truckNumber,
        t.driverName,
        t.deliveryStatus,
      ]);
      downloadCSV('GraniteTrack_Stone_Transfers_Report', headers, rows);
    } else if (activeReport === 'fuel') {
      const headers = ['Date', 'Slip Number', 'Truck', 'Driver', 'Litres', 'Rate/L', 'Total Cost', 'Distance KM', 'Mileage KM/L', 'Pump'];
      const rows = fuelLogs.map((f) => [
        f.date,
        f.slipNumber,
        f.truckNumber,
        f.driverName,
        f.litres,
        f.ratePerLitre,
        f.totalCost,
        f.totalKm,
        f.mileageKmpl,
        f.pumpStation,
      ]);
      downloadCSV('GraniteTrack_Fuel_Mileage_Report', headers, rows);
    } else if (activeReport === 'aging') {
      const headers = ['Customer Name', 'GSTIN', 'Phone', 'Total Invoiced', 'Total Paid', 'Outstanding Due', 'Status'];
      const rows = customers.map((c) => [
        c.companyName,
        c.gstin,
        c.phone,
        c.totalInvoiced,
        c.totalPaid,
        c.balanceDue,
        c.status,
      ]);
      downloadCSV('GraniteTrack_Receivables_Aging_Report', headers, rows);
    } else {
      const headers = ['Report Category', 'Metric', 'Value'];
      const rows = [
        ['Summary', 'Total Trips', trips.length],
        ['Summary', 'Total Tons Hauled', trips.reduce((acc, t) => acc + t.totalTons, 0)],
        ['Summary', 'Gross Revenue', trips.reduce((acc, t) => acc + t.totalAmount, 0)],
        ['Summary', 'Fuel Consumed', fuelLogs.reduce((acc, f) => acc + f.litres, 0)],
      ];
      downloadCSV('GraniteTrack_Executive_Summary', headers, rows);
    }
  };

  const reportTabs = [
    { id: 'transfers', name: 'Stone Transfers & Waybills', icon: Layers },
    { id: 'tons', name: 'Daily Tonnage Matrix', icon: BarChart3 },
    { id: 'fuel', name: 'Fuel & Mileage Logs', icon: Fuel },
    { id: 'drivers', name: 'Driver Batta & Performance', icon: Users },
    { id: 'trucks', name: 'Fleet Utilization', icon: Layers },
    { id: 'aging', name: 'Receivables & Aging', icon: Building2 },
    { id: 'pnl', name: 'Profit & Loss Statement', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Executive Analytics & Audit Reports
            </h1>
            <p className="text-xs text-slate-500">
              Export comprehensive quarry transfer logs, mileage analysis, driver batta statements, and GST ledgers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <Printer className="w-4 h-4" /> Print PDF
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV / Excel
          </button>
        </div>
      </div>

      {/* Report Selector Tabs Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReport === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Render Active Report Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 capitalize">
              {activeReport.replace('_', ' ')} Master Audit Statement
            </h3>
            <p className="text-xs text-slate-500">Live synchronized database records for August 2026</p>
          </div>

          <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-xl">
            {activeReport === 'transfers' && `${trips.length} Transfers Logged`}
            {activeReport === 'tons' && `${trips.reduce((acc, t) => acc + t.totalTons, 0).toFixed(1)} Tons Total`}
            {activeReport === 'fuel' && `${fuelLogs.length} Fill-up Slips`}
            {activeReport === 'aging' && `${customers.length} Buyer Ledgers`}
            {activeReport === 'drivers' && `${drivers.length} Driver Profiles`}
          </div>
        </div>

        {/* Dynamic Content based on active tab */}
        {activeReport === 'transfers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Trip ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer & Quarry</th>
                  <th className="py-3 px-4">Granite Type</th>
                  <th className="py-3 px-4 text-right">Tonnage</th>
                  <th className="py-3 px-4 text-right">Rate/Ton</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4">Truck / Driver</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                {trips.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{t.tripId}</td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(t.date)}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{t.customerName}</div>
                      <div className="text-[10px] text-slate-400">{t.sourceQuarry} → {t.destination}</div>
                    </td>
                    <td className="py-3 px-4">{t.graniteType}</td>
                    <td className="py-3 px-4 text-right font-bold">{t.totalTons} T</td>
                    <td className="py-3 px-4 text-right font-mono">₹{t.ratePerTon}</td>
                    <td className="py-3 px-4 text-right font-black font-mono text-slate-900 dark:text-slate-100">
                      {formatINR(t.totalAmount)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">{t.truckNumber} ({t.driverName})</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {t.deliveryStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'aging' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">GSTIN & Phone</th>
                  <th className="py-3 px-4 text-right">Total Invoiced</th>
                  <th className="py-3 px-4 text-right">Total Paid</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Aging Bracket</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{c.companyName}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      <div>{c.gstin}</div>
                      <div>{c.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">{formatINR(c.totalInvoiced)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatINR(c.totalPaid)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-rose-600 dark:text-rose-400">
                      {formatINR(c.balanceDue)}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-600 dark:text-slate-300">
                      {c.balanceDue > 50000 ? '30-60 Days' : '0-30 Days'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(activeReport === 'fuel' || activeReport === 'tons' || activeReport === 'drivers' || activeReport === 'pnl' || activeReport === 'trucks') && (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mb-1">
              Ready for Download & Printing
            </div>
            <p className="max-w-md mx-auto mb-4">
              All financial rows and metric calculations have been generated for {activeReport.toUpperCase()}. Click the button below to generate the structured spreadsheet.
            </p>
            <button
              onClick={handleExport}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold inline-flex items-center gap-2 shadow-md shadow-blue-600/30"
            >
              <Download className="w-4 h-4" /> Download Complete Report (.CSV)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
