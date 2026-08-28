import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyClosingRecord } from '../../types';
import {
  Lock,
  CheckCircle2,
  Calendar,
  Layers,
  Fuel,
  DollarSign,
  AlertCircle,
  Clock,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { formatINR, formatTons, formatDate } from '../../utils/formatters';

export const DailyClosing: React.FC = () => {
  const { dailyClosings, saveDailyClosing, trips, fuelLogs, expenses, currentUser } = useApp();

  const todayStr = '2026-08-28';
  const todayTrips = trips.filter((t) => t.date === todayStr);
  const todayFuel = fuelLogs.filter((f) => f.date === todayStr);
  const todayExpenses = expenses.filter((e) => e.date === todayStr);

  const todayTons = todayTrips.reduce((acc, t) => acc + t.totalTons, 0);
  const todayIncome = todayTrips.reduce((acc, t) => acc + t.totalAmount, 0);
  const todayFuelCost = todayFuel.reduce((acc, f) => acc + f.totalCost, 0);
  const todayFuelLitres = todayFuel.reduce((acc, f) => acc + f.litres, 0);
  const todayOtherExpense = todayExpenses.reduce((acc, e) => acc + e.amount, 0);
  const todayTotalExpenses = todayFuelCost + todayOtherExpense;
  const todayNetProfit = todayIncome - todayTotalExpenses;

  // Expected vs actual cash reconciliation state
  const [actualCashInHand, setActualCashInHand] = useState(48500);
  const [cashVarianceNotes, setCashVarianceNotes] = useState('Minor ₹500 advance given for driver tea/tolls on Krishnagiri route');
  const [isLocked, setIsLocked] = useState(dailyClosings.some((c) => c.date === todayStr && c.status === 'locked'));

  const expectedCash = 49000;
  const cashDiscrepancy = actualCashInHand - expectedCash;

  const handleExecuteClosing = () => {
    const payload: DailyClosingRecord = {
      id: `closing-${todayStr}`,
      date: todayStr,
      totalTrips: todayTrips.length,
      totalTons: todayTons,
      grossIncome: todayIncome,
      fuelCost: todayFuelCost,
      otherExpenses: todayOtherExpense,
      netProfit: todayNetProfit,
      fuelLitres: todayFuelLitres,
      closingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      closedBy: currentUser.name,
      status: 'locked',
      varianceNotes: cashVarianceNotes,
      cashInHand: actualCashInHand,
    };

    saveDailyClosing(payload);
    setIsLocked(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Daily Shift Closing & Petty Cash Reconciliation
            </h1>
            <p className="text-xs text-slate-500">
              Lock daily dispatch accounts, verify physical weighbridge tally vs billing, and timestamp audited registers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLocked ? (
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4" /> Day Audited & Locked
            </span>
          ) : (
            <button
              id="btn-lock-daily-shift"
              onClick={handleExecuteClosing}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4" /> Lock & Close Shift (28 Aug 2026)
            </button>
          )}
        </div>
      </div>

      {/* Today's Closing Summary Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Operations Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Operations Register</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Trips Dispatched & Billed:</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{todayTrips.length} Trips</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Total Stone Hauled:</span>
              <span className="font-black font-mono text-blue-600 dark:text-blue-400">{formatTons(todayTons)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Diesel Fuel Consumed:</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{todayFuelLitres} Litres</span>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Daily Financial Net</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Gross Freight Income:</span>
              <span className="font-black font-mono text-emerald-600 dark:text-emerald-400">{formatINR(todayIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Total Day Expenses (Fuel+Ops):</span>
              <span className="font-bold font-mono text-rose-600 dark:text-rose-400">−{formatINR(todayTotalExpenses)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300 font-bold">Estimated Net Margin:</span>
              <span className="font-black font-mono text-slate-900 dark:text-slate-100">{formatINR(todayNetProfit)}</span>
            </div>
          </div>
        </div>

        {/* Cash Drawer Reconciliation */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-purple-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Petty Cash Drawer</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Expected Physical Cash:</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{formatINR(expectedCash)}</span>
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Counted Cash in Drawer (₹):</label>
              <input
                type="number"
                value={actualCashInHand}
                disabled={isLocked}
                onChange={(e) => setActualCashInHand(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-black"
              />
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Variance / Difference:</span>
              <span className={`font-mono font-bold ${cashDiscrepancy === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {cashDiscrepancy >= 0 ? `+${formatINR(cashDiscrepancy)}` : formatINR(cashDiscrepancy)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Variance Explanation & Notes */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
        <label className="block font-extrabold text-xs text-slate-900 dark:text-slate-100">
          Shift Auditor & Gate Pass Discrepancy Remarks
        </label>
        <textarea
          rows={3}
          disabled={isLocked}
          value={cashVarianceNotes}
          onChange={(e) => setCashVarianceNotes(e.target.value)}
          placeholder="Enter shift notes, toll receipt discrepancies, or weighbridge slip verification remarks..."
          className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs dark:text-white"
        />
      </div>

      {/* Historical Closings Register */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
          Past Shift Closing Registers & Auditor Sign-offs
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Audited By</th>
                <th className="py-3 px-4 text-right">Trips</th>
                <th className="py-3 px-4 text-right">Tonnage</th>
                <th className="py-3 px-4 text-right">Income</th>
                <th className="py-3 px-4 text-right">Expenses</th>
                <th className="py-3 px-4 text-right">Net Profit</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {dailyClosings.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {formatDate(c.date)} ({c.closingTime})
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-purple-600 dark:text-purple-400">{c.closedBy}</td>
                  <td className="py-3.5 px-4 text-right font-mono">{c.totalTrips}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold">{c.totalTons} T</td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {formatINR(c.grossIncome)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-rose-600 dark:text-rose-400">
                    {formatINR(c.fuelCost + c.otherExpenses)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 dark:text-slate-100">
                    {formatINR(c.netProfit)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Locked
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
