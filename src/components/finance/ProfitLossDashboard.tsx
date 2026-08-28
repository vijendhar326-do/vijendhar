import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  TrendingDown,
  Percent,
  Calendar,
  Layers,
  Truck,
  Building2,
  MapPin,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { formatINR, formatTons } from '../../utils/formatters';

export const ProfitLossDashboard: React.FC = () => {
  const { trips, expenses, fuelLogs, trucks, customers } = useApp();
  const [viewTimeframe, setViewTimeframe] = useState<'daily' | 'monthly'>('daily');

  // Daily Calculations (Today 2026-08-28)
  const todayTrips = trips.filter((t) => t.date === '2026-08-28');
  const todayExpenses = expenses.filter((e) => e.date === '2026-08-28');
  const todayFuelLogs = fuelLogs.filter((f) => f.date === '2026-08-28');

  const todayGrossIncome = todayTrips.reduce((acc, t) => acc + t.totalAmount, 0);
  const todayFuelCost = todayFuelLogs.reduce((acc, f) => acc + f.totalCost, 0);
  const todayTollCost = todayExpenses.filter((e) => e.category === 'Toll (Fastag)').reduce((acc, e) => acc + e.amount, 0);
  const todayDriverWages = todayExpenses.filter((e) => e.category === 'Driver Salary / Batta').reduce((acc, e) => acc + e.amount, 0);
  const todayMaintenance = todayExpenses.filter((e) => e.category === 'Truck Repair' || e.category === 'Tyre Replacement').reduce((acc, e) => acc + e.amount, 0);
  const todayOtherExpenses = todayExpenses.filter((e) => !['Fuel', 'Toll (Fastag)', 'Driver Salary / Batta', 'Truck Repair', 'Tyre Replacement'].includes(e.category)).reduce((acc, e) => acc + e.amount, 0);

  const todayTotalExpenses = todayFuelCost + todayTollCost + todayDriverWages + todayMaintenance + todayOtherExpenses;
  const todayNetProfit = todayGrossIncome - todayTotalExpenses;
  const todayMarginPercent = todayGrossIncome > 0 ? (todayNetProfit / todayGrossIncome) * 100 : 0;

  // Monthly Aggregate (All sample trips/expenses)
  const monthGrossIncome = trips.reduce((acc, t) => acc + t.totalAmount, 0);
  const monthTotalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0) + fuelLogs.reduce((acc, f) => acc + f.totalCost, 0);
  const monthNetProfit = monthGrossIncome - monthTotalExpenses;
  const monthMarginPercent = monthGrossIncome > 0 ? (monthNetProfit / monthGrossIncome) * 100 : 0;

  // Active metrics depending on toggle
  const currentIncome = viewTimeframe === 'daily' ? todayGrossIncome : monthGrossIncome;
  const currentFuel = viewTimeframe === 'daily' ? todayFuelCost : fuelLogs.reduce((acc, f) => acc + f.totalCost, 0);
  const currentToll = viewTimeframe === 'daily' ? todayTollCost : expenses.filter((e) => e.category === 'Toll (Fastag)').reduce((acc, e) => acc + e.amount, 0);
  const currentWages = viewTimeframe === 'daily' ? todayDriverWages : expenses.filter((e) => e.category === 'Driver Salary / Batta').reduce((acc, e) => acc + e.amount, 0);
  const currentMaint = viewTimeframe === 'daily' ? todayMaintenance : expenses.filter((e) => e.category === 'Truck Repair' || e.category === 'Tyre Replacement').reduce((acc, e) => acc + e.amount, 0);
  const currentOther = viewTimeframe === 'daily' ? todayOtherExpenses : expenses.filter((e) => !['Fuel', 'Toll (Fastag)', 'Driver Salary / Batta', 'Truck Repair', 'Tyre Replacement'].includes(e.category)).reduce((acc, e) => acc + e.amount, 0);

  const currentTotalExpense = currentFuel + currentToll + currentWages + currentMaint + currentOther;
  const currentNetProfit = currentIncome - currentTotalExpense;
  const currentMargin = currentIncome > 0 ? (currentNetProfit / currentIncome) * 100 : 0;

  // Truck-wise Profitability Breakdown
  const truckProfits = trucks.map((truck) => {
    const truckTrips = trips.filter((t) => t.truckId === truck.id);
    const revenue = truckTrips.reduce((acc, t) => acc + t.totalAmount, 0);
    const truckFuel = fuelLogs.filter((f) => f.truckId === truck.id).reduce((acc, f) => acc + f.totalCost, 0);
    const truckExp = expenses.filter((e) => e.truckId === truck.id).reduce((acc, e) => acc + e.amount, 0);
    const totalExp = truckFuel + truckExp;
    const profit = revenue - totalExp;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      id: truck.id,
      regNumber: truck.registrationNumber,
      driverName: truck.driverName,
      tripsCount: truckTrips.length,
      revenue,
      expenses: totalExp,
      profit,
      margin,
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Automatic Profit & Loss Engine
            </h1>
            <p className="text-xs text-slate-500">
              Real-time net margin formula: Stone & Transport Revenue − (Fuel + Tolls + Wages + Maintenance + Spares)
            </p>
          </div>
        </div>

        {/* Daily vs Monthly Switch */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewTimeframe('daily')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewTimeframe === 'daily'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Today (28-Aug)
          </button>
          <button
            onClick={() => setViewTimeframe('monthly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewTimeframe === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Month of August 2026
          </button>
        </div>
      </div>

      {/* Net Profit Big Hero Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/60 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                {viewTimeframe === 'daily' ? "Today's Net Realized Margin" : 'Month-to-Date Net Margin'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {viewTimeframe === 'daily' ? '28-Aug-2026' : '01-Aug to 28-Aug-2026'}
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
              {formatINR(currentNetProfit)}
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-xl">
              Calculated automatically across all quarry pit deliveries, diesel fill-up receipts, driver allowances, and Fastag highway tolls.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
            <div className="text-xs uppercase font-bold text-slate-300">Operating Net Margin</div>
            <div className="text-3xl font-black text-emerald-300">{currentMargin.toFixed(1)}%</div>
            <div className="text-[11px] text-slate-300">Healthy Granite Fleet Standard (Above 55%)</div>
          </div>
        </div>
      </div>

      {/* Financial Breakdown Table: Income minus Expenses */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 mb-4">
          Financial Deductions & Net Margin Statement
        </h3>

        <div className="space-y-3 font-sans text-xs">
          {/* Gross Income */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                +
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  Gross Stone & Freight Income
                </div>
                <div className="text-[11px] text-slate-500">Total client billings across all trips</div>
              </div>
            </div>
            <div className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
              +{formatINR(currentIncome)}
            </div>
          </div>

          {/* Minus Fuel */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 font-bold flex items-center justify-center">
                −
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Fuel & Diesel Fill-ups</div>
                <div className="text-[11px] text-slate-400">Total litres consumed at petrol pumps</div>
              </div>
            </div>
            <div className="font-mono font-bold text-rose-600 dark:text-rose-400">
              −{formatINR(currentFuel)}
            </div>
          </div>

          {/* Minus Tolls */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 font-bold flex items-center justify-center">
                −
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Highway Tolls (Fastag)</div>
                <div className="text-[11px] text-slate-400">NH44, Salem, Krishnagiri & Hosur plazas</div>
              </div>
            </div>
            <div className="font-mono font-bold text-rose-600 dark:text-rose-400">
              −{formatINR(currentToll)}
            </div>
          </div>

          {/* Minus Driver Wages / Batta */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 font-bold flex items-center justify-center">
                −
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Driver Daily Batta & Wages</div>
                <div className="text-[11px] text-slate-400">Trip allowances & helper batta</div>
              </div>
            </div>
            <div className="font-mono font-bold text-rose-600 dark:text-rose-400">
              −{formatINR(currentWages)}
            </div>
          </div>

          {/* Minus Maintenance */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 font-bold flex items-center justify-center">
                −
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Maintenance, Tyres & Spares</div>
                <div className="text-[11px] text-slate-400">Hydraulic tipper service, Apollo tyres</div>
              </div>
            </div>
            <div className="font-mono font-bold text-rose-600 dark:text-rose-400">
              −{formatINR(currentMaint)}
            </div>
          </div>

          {/* Minus Other */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 font-bold flex items-center justify-center">
                −
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Quarry Taxes & Miscellaneous</div>
                <div className="text-[11px] text-slate-400">Permits, weighbridge calibration, yard fee</div>
              </div>
            </div>
            <div className="font-mono font-bold text-rose-600 dark:text-rose-400">
              −{formatINR(currentOther)}
            </div>
          </div>

          {/* Final Equal Line: Net Profit */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between text-emerald-900 dark:text-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                =
              </div>
              <div>
                <div className="font-black text-sm uppercase">Net Operating Profit</div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Calculated automatically with zero manual spreadsheet input
                </div>
              </div>
            </div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {formatINR(currentNetProfit)}
            </div>
          </div>
        </div>
      </div>

      {/* Truck-wise Unit Economics Profitability Leaderboard */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              Truck-wise Unit Economics & Profit Contribution
            </h3>
            <p className="text-xs text-slate-500">Individual vehicle revenue vs fuel and repair cost margins</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Truck Number</th>
                <th className="pb-3">Assigned Driver</th>
                <th className="pb-3 text-center">Trips Hauled</th>
                <th className="pb-3 text-right">Revenue</th>
                <th className="pb-3 text-right">Operating Costs</th>
                <th className="pb-3 text-right">Net Profit</th>
                <th className="pb-3 text-center">Profit Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {truckProfits.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {item.regNumber}
                  </td>
                  <td className="py-3.5 text-slate-700 dark:text-slate-300">
                    {item.driverName || 'Unassigned'}
                  </td>
                  <td className="py-3.5 text-center font-mono">{item.tripsCount}</td>
                  <td className="py-3.5 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                    {formatINR(item.revenue)}
                  </td>
                  <td className="py-3.5 text-right font-mono text-rose-600 dark:text-rose-400">
                    {formatINR(item.expenses)}
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(item.profit)}
                  </td>
                  <td className="py-3.5 text-center">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-mono">
                      {item.margin.toFixed(1)}%
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
