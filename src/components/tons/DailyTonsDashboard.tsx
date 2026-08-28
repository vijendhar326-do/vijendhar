import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Layers,
  TrendingUp,
  Calendar,
  Truck,
  Award,
  Filter,
  Download,
  ArrowUpRight,
} from 'lucide-react';
import { formatTons, formatINR } from '../../utils/formatters';

export const DailyTonsDashboard: React.FC = () => {
  const { trips, graniteStock, trucks } = useApp();
  const [selectedGraniteFilter, setSelectedGraniteFilter] = useState('All');

  // Aggregations
  const totalAllTons = trips.reduce((acc, t) => acc + (t.totalTons || 0), 0);
  const todayTrips = trips.filter((t) => t.date === '2026-08-28');
  const todayTons = todayTrips.reduce((acc, t) => acc + (t.totalTons || 0), 0);

  // Tonnage by Granite Type
  const tonsByGranite: { [key: string]: { tons: number; trips: number; revenue: number } } = {};
  trips.forEach((t) => {
    if (!tonsByGranite[t.graniteType]) {
      tonsByGranite[t.graniteType] = { tons: 0, trips: 0, revenue: 0 };
    }
    tonsByGranite[t.graniteType].tons += t.totalTons;
    tonsByGranite[t.graniteType].trips += t.numberOfTrips;
    tonsByGranite[t.graniteType].revenue += t.totalAmount;
  });

  // Tonnage by Truck
  const tonsByTruck: { [key: string]: { tons: number; trips: number; regNumber: string } } = {};
  trips.forEach((t) => {
    if (!tonsByTruck[t.truckId]) {
      tonsByTruck[t.truckId] = { tons: 0, trips: 0, regNumber: t.truckNumber };
    }
    tonsByTruck[t.truckId].tons += t.totalTons;
    tonsByTruck[t.truckId].trips += 1;
  });

  const topTrucksList = Object.values(tonsByTruck).sort((a, b) => b.tons - a.tons);

  // Weekly Trend Data (Simulated 7 days)
  const weeklyTrends = [
    { day: 'Mon 22-Aug', tons: 210.5, revenue: 380000 },
    { day: 'Tue 23-Aug', tons: 245.0, revenue: 420000 },
    { day: 'Wed 24-Aug', tons: 275.5, revenue: 465000 },
    { day: 'Thu 25-Aug', tons: 230.0, revenue: 395000 },
    { day: 'Fri 26-Aug', tons: 290.0, revenue: 495000 },
    { day: 'Sat 27-Aug', tons: 265.0, revenue: 440000 },
    { day: 'Today (Fri 28)', tons: 286.0, revenue: 485000 },
  ];

  const maxTonsInTrend = Math.max(...weeklyTrends.map((d) => d.tons));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Daily Tons & Stone Analytics
            </h1>
            <p className="text-xs text-slate-500">
              Total granite volume, quarry quarry extraction throughput, and vehicle payload utilization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
            Target: 300 Tons / Day
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase">Today's Total Hauled</div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {formatTons(todayTons)}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> 95.3% of Daily 300T Target
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase">Average Truck Load</div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            24.1 Metric Tons
          </div>
          <div className="text-xs text-slate-500 mt-1">Optimal 96.4% Axle Capacity</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Quarry Dispatches</div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatTons(totalAllTons)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Recorded across 24 Live Trips</div>
        </div>
      </div>

      {/* Weekly Dispatch Trend Histogram */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              7-Day Granite Tonnage Dispatched (Metric Tons)
            </h3>
            <p className="text-xs text-slate-500">Daily weighbridge total comparison</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
            Weekly Avg: 257.4 T / Day
          </span>
        </div>

        {/* Bar Chart Bars */}
        <div className="grid grid-cols-7 gap-3 items-end h-56 pt-6">
          {weeklyTrends.map((d, i) => {
            const heightPercent = (d.tons / (maxTonsInTrend * 1.15)) * 100;
            const isToday = i === weeklyTrends.length - 1;
            return (
              <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">
                  {d.tons} T
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden h-full max-h-40 flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-indigo-600 to-blue-500 shadow-md shadow-indigo-600/30'
                        : 'bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500'
                    }`}
                  />
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate text-center">
                  {d.day.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown Grid: By Granite Variety & By Heavy Hauler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Variety Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Tonnage Hauled by Granite Variety
          </h3>

          <div className="space-y-4">
            {Object.entries(tonsByGranite).map(([variety, data]) => {
              const sharePercent = totalAllTons > 0 ? (data.tons / totalAllTons) * 100 : 0;
              return (
                <div key={variety} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{variety}</span>
                    <span className="font-mono text-slate-600 dark:text-slate-300">
                      {data.tons.toFixed(1)} T ({sharePercent.toFixed(1)}%) • {formatINR(data.revenue)}
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${sharePercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fleet Hauling Leaders */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" />
            Truck Payload Leaderboard
          </h3>

          <div className="space-y-3">
            {topTrucksList.map((truckData, idx) => (
              <div
                key={truckData.regNumber}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black flex items-center justify-center font-mono">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                      {truckData.regNumber}
                    </div>
                    <div className="text-[11px] text-slate-400">{truckData.trips} Total Quarry Trips</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-sm text-slate-900 dark:text-slate-100 font-mono">
                    {truckData.tons.toFixed(1)} T
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">100% On-time</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
