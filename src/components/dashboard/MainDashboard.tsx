import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  TrendingUp,
  Fuel,
  Receipt,
  Layers,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  DollarSign,
  PlusCircle,
  FileText,
  CalendarCheck,
  Compass,
} from 'lucide-react';
import { formatINR, formatCompactINR, formatTons } from '../../utils/formatters';

export const MainDashboard: React.FC = () => {
  const {
    todayStats,
    trips,
    trucks,
    drivers,
    setActiveTab,
    setActiveModal,
    isTodayClosed,
  } = useApp();

  const todayTrips = trips.filter((t) => t.date === '2026-08-28').slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome & Quick Actions Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              Live Fleet Operations
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Friday, 28-Aug-2026 • 01:05 PM IST
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1.5">
            Today's Granite Business Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time stone tonnage, heavy truck hauls, diesel efficiency, and net margins across all quarry pits.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center flex-wrap gap-2.5 relative z-10">
          <button
            id="btn-quick-new-trip"
            onClick={() => setActiveTab('transfers')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            New Stone Transfer
          </button>

          <button
            id="btn-quick-log-fuel"
            onClick={() => setActiveTab('fuel')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Fuel className="w-4 h-4 text-amber-400" />
            Log Fuel
          </button>

          <button
            id="btn-quick-add-expense"
            onClick={() => setActiveTab('expenses')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Receipt className="w-4 h-4 text-rose-400" />
            Add Expense
          </button>

          <button
            id="btn-quick-daily-close"
            onClick={() => setActiveTab('daily-closing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isTodayClosed
                ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            {isTodayClosed ? 'Day Closed ✓' : 'Daily Close'}
          </button>
        </div>
      </div>

      {/* TODAY'S BUSINESS 6 Big KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            TODAY'S BUSINESS ESSENTIALS (28-AUG-2026)
          </h2>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Real-time Automatic Aggregation
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Trips */}
          <div
            onClick={() => setActiveTab('transfers')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Trips</span>
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
              {todayStats.tripsCount}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>18 Completed • 6 Transit</span>
            </div>
          </div>

          {/* Card 2: Stone Tons */}
          <div
            onClick={() => setActiveTab('tons')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Stone Tons</span>
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 group-hover:text-slate-600 transition-colors">
              {todayStats.totalTons.toFixed(1)} T
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Avg 23.8 T / Heavy Truck
            </div>
          </div>

          {/* Card 3: Income */}
          <div
            onClick={() => setActiveTab('accounts')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Income</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatINR(todayStats.totalIncome)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Stone + Transport Freight
            </div>
          </div>

          {/* Card 4: Fuel Litres */}
          <div
            onClick={() => setActiveTab('fuel')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Fuel Tracked</span>
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Fuel className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {todayStats.fuelLitres} L
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Cost: {formatINR(todayStats.fuelCost)}
            </div>
          </div>

          {/* Card 5: Expenses */}
          <div
            onClick={() => setActiveTab('expenses')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Expenses</span>
              <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {formatINR(todayStats.totalExpenses)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Fuel, Toll, Tyres, Wages
            </div>
          </div>

          {/* Card 6: Net Profit */}
          <div
            onClick={() => setActiveTab('profit-loss')}
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Net Profit</span>
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {formatINR(todayStats.netProfit)}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
              64.4% Daily Net Margin
            </div>
          </div>
        </div>
      </div>

      {/* Operational Status Micro-Chips Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        <div
          onClick={() => setActiveTab('trucks')}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors"
        >
          <span className="text-slate-500 dark:text-slate-400">Active Trucks:</span>
          <span className="font-extrabold text-blue-600 dark:text-blue-400">{todayStats.activeTrucks} / 8</span>
        </div>

        <div
          onClick={() => setActiveTab('trucks')}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-colors"
        >
          <span className="text-slate-500 dark:text-slate-400">Available:</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{todayStats.availableTrucks}</span>
        </div>

        <div
          onClick={() => setActiveTab('trucks')}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between cursor-pointer hover:border-amber-500 transition-colors"
        >
          <span className="text-slate-500 dark:text-slate-400">In Workshop:</span>
          <span className="font-extrabold text-amber-600 dark:text-amber-400">{todayStats.maintenanceTrucks}</span>
        </div>

        <div
          onClick={() => setActiveTab('drivers')}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors"
        >
          <span className="text-slate-500 dark:text-slate-400">Drivers on Trip:</span>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{todayStats.onTripDrivers}</span>
        </div>

        <div
          onClick={() => setActiveTab('drivers')}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-colors"
        >
          <span className="text-slate-500 dark:text-slate-400">Drivers Ready:</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{todayStats.availableDrivers}</span>
        </div>

        <div
          onClick={() => setActiveTab('accounts')}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between cursor-pointer hover:border-rose-500 transition-colors"
        >
          <span className="text-slate-500 dark:text-slate-400">Pending Dues:</span>
          <span className="font-extrabold text-rose-600 dark:text-rose-400">{formatCompactINR(todayStats.pendingPaymentsAmount)}</span>
        </div>

        <div
          onClick={() => setActiveTab('shipments')}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-colors"
        >
          <span className="text-slate-500 dark:text-slate-400">Delivered Today:</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">18 / 24</span>
        </div>
      </div>

      {/* Main Grid: Live Trip Dispatches & Fleet Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Stone Transfer Dispatches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  Today's Quarry Dispatches & Tonnage
                </h3>
                <p className="text-xs text-slate-500">Live docket records from Chimakurthy, Madurai, Salem & Hosur pits</p>
              </div>
              <button
                onClick={() => setActiveTab('transfers')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
              >
                View All Trips ({trips.length}) →
              </button>
            </div>

            {/* Trips List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Trip ID</th>
                    <th className="pb-3">Granite & Quarry</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Truck / Driver</th>
                    <th className="pb-3 text-right">Tons</th>
                    <th className="pb-3 text-right">Total Amount</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {todayTrips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {trip.tripId}
                      </td>
                      <td className="py-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{trip.graniteType}</div>
                        <div className="text-[11px] text-slate-400">{trip.sourceQuarry}</div>
                      </td>
                      <td className="py-3 text-slate-700 dark:text-slate-300">
                        {trip.customerName}
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{trip.truckNumber}</div>
                        <div className="text-[11px] text-slate-400">{trip.driverName}</div>
                      </td>
                      <td className="py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                        {trip.totalTons} T
                      </td>
                      <td className="py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {formatINR(trip.totalAmount)}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            trip.deliveryStatus === 'Delivered' || trip.deliveryStatus === 'Completed'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : trip.deliveryStatus === 'In Transit'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {trip.deliveryStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue vs Expenses Financial Health Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Daily Revenue vs Expenses Realization
                </h3>
                <p className="text-xs text-slate-500">Net profitability formula: Total Revenue − (Fuel + Toll + Wages + Maintenance)</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                Profit: {formatINR(todayStats.netProfit)}
              </span>
            </div>

            {/* Comparative Breakdown Visual Bar */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Gross Stone & Freight Revenue ({formatINR(todayStats.totalIncome)})</span>
                  <span className="text-blue-600 font-bold">100%</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Total Operating Expenses ({formatINR(todayStats.totalExpenses)})</span>
                  <span className="text-rose-600 font-bold">35.6% of Revenue</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '35.6%' }} />
                </div>
              </div>

              {/* Expense Category Tags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 font-medium">Diesel Fuel Cost</div>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{formatINR(todayStats.fuelCost)}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 font-medium">Highway Fastag Toll</div>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">₹7,050</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 font-medium">Driver Batta & Wages</div>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">₹12,500</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 font-medium">Workshop & Tyres</div>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">₹1,01,520</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Fleet Status & Driver Ranking */}
        <div className="space-y-6">
          {/* Active Fleet Map Teaser */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600" />
                Live Fleet Radar
              </h3>
              <button
                onClick={() => setActiveTab('tracking')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Open Full GPS →
              </button>
            </div>

            <div className="space-y-3">
              {trucks.slice(0, 4).map((truck) => (
                <div
                  key={truck.id}
                  onClick={() => setActiveTab('tracking')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-indigo-400 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 font-mono">
                      {truck.registrationNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        truck.status === 'in_transit'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                          : truck.status === 'available'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {truck.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{truck.currentLocation}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>Driver: {truck.driverName}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{truck.currentSpeedKmH} KM/H • {truck.currentFuelPercent}% Fuel</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Driver Leaderboard Ranking */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                Driver Performance Ranking
              </h3>
              <button
                onClick={() => setActiveTab('drivers')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400"
              >
                All Drivers →
              </button>
            </div>

            <div className="space-y-2.5">
              {drivers.slice(0, 4).map((driver, idx) => (
                <div
                  key={driver.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 font-mono text-xs font-bold text-slate-400">#{idx + 1}</span>
                    <img
                      src={driver.photo}
                      alt={driver.name}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200">{driver.name}</div>
                      <div className="text-[10px] text-slate-400">{driver.totalTrips} Trips • {driver.totalTons} Tons</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800">
                      ⭐ {driver.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
