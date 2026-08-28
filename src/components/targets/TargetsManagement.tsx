import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, TrendingUp, Award, Zap, Fuel, Layers, CheckCircle2, Edit2, X } from 'lucide-react';
import { formatINR, formatTons } from '../../utils/formatters';

export const TargetsManagement: React.FC = () => {
  const { trips, fuelLogs, expenses } = useApp();

  const [targets, setTargets] = useState({
    monthlyTonsTarget: 4000,
    monthlyRevenueTarget: 1200000,
    monthlyProfitTarget: 500000,
    fleetUtilizationTarget: 90,
    targetFuelEfficiencyKmpl: 3.2,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...targets });

  // Current actuals
  const actualTons = trips.reduce((acc, t) => acc + t.totalTons, 0);
  const actualRevenue = trips.reduce((acc, t) => acc + t.totalAmount, 0);
  const actualExpenses =
    fuelLogs.reduce((acc, f) => acc + f.totalCost, 0) + expenses.reduce((acc, e) => acc + e.amount, 0);
  const actualProfit = actualRevenue - actualExpenses;

  const totalFuelLitres = fuelLogs.reduce((acc, f) => acc + f.litres, 0);
  const totalKmDriven = fuelLogs.reduce((acc, f) => acc + f.totalKm, 0);
  const actualAvgMileage = totalFuelLitres > 0 ? Number((totalKmDriven / totalFuelLitres).toFixed(2)) : 3.05;
  const actualUtilization = 86.5; // percentage

  // Percentages
  const tonsProgress = Math.min(100, Math.round((actualTons / targets.monthlyTonsTarget) * 100));
  const revenueProgress = Math.min(100, Math.round((actualRevenue / targets.monthlyRevenueTarget) * 100));
  const profitProgress = Math.min(100, Math.round((actualProfit / targets.monthlyProfitTarget) * 100));
  const mileageProgress = Math.min(100, Math.round((actualAvgMileage / targets.targetFuelEfficiencyKmpl) * 100));
  const utilProgress = Math.min(100, Math.round((actualUtilization / targets.fleetUtilizationTarget) * 100));

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    setTargets({ ...formData });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Operations Targets & Executive KPI Scorecard
            </h1>
            <p className="text-xs text-slate-500">
              Real-time progress against monthly tonnage quotas, revenue goals, and fuel economy benchmarks
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData({ ...targets });
            setIsEditModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
        >
          <Edit2 className="w-4 h-4" /> Configure Monthly Quotas
        </button>
      </div>

      {/* Target Progress Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tonnage Target */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Monthly Tonnage Quota
              </h3>
            </div>
            <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400">{tonsProgress}%</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Actual Hauled:</span>
              <span className="font-black font-mono text-slate-900 dark:text-slate-100">{formatTons(actualTons)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Monthly Target:</span>
              <span className="font-bold font-mono text-slate-500">{formatTons(targets.monthlyTonsTarget)}</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${tonsProgress}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 text-right">
            {(targets.monthlyTonsTarget - actualTons).toFixed(1)} T remaining this month
          </div>
        </div>

        {/* Gross Revenue Target */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Revenue Benchmark
              </h3>
            </div>
            <span className="font-mono font-black text-xs text-emerald-600 dark:text-emerald-400">{revenueProgress}%</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Current Billings:</span>
              <span className="font-black font-mono text-emerald-600 dark:text-emerald-400">{formatINR(actualRevenue)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Target Revenue:</span>
              <span className="font-bold font-mono text-slate-500">{formatINR(targets.monthlyRevenueTarget)}</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${revenueProgress}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 text-right">
            {formatINR(Math.max(0, targets.monthlyRevenueTarget - actualRevenue))} to quota
          </div>
        </div>

        {/* Net Profit Target */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Net Operating Margin
              </h3>
            </div>
            <span className="font-mono font-black text-xs text-purple-600 dark:text-purple-400">{profitProgress}%</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Realized Profit:</span>
              <span className="font-black font-mono text-purple-600 dark:text-purple-400">{formatINR(actualProfit)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Profit Target:</span>
              <span className="font-bold font-mono text-slate-500">{formatINR(targets.monthlyProfitTarget)}</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${profitProgress}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 text-right">
            Healthy 42% net operational margin
          </div>
        </div>

        {/* Fleet Fuel Efficiency Target */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Diesel Mileage Target
              </h3>
            </div>
            <span className="font-mono font-black text-xs text-amber-500">{mileageProgress}%</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Fleet Average:</span>
              <span className="font-black font-mono text-slate-900 dark:text-slate-100">{actualAvgMileage} KM/L</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Target Efficiency:</span>
              <span className="font-bold font-mono text-slate-500">{targets.targetFuelEfficiencyKmpl} KM/L</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${mileageProgress}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 text-right">
            Optimized via eco-driving training
          </div>
        </div>

        {/* Fleet Utilization Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-rose-500" />
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Active Truck Utilization
              </h3>
            </div>
            <span className="font-mono font-black text-xs text-rose-500">{utilProgress}%</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Active Duty Ratio:</span>
              <span className="font-black font-mono text-slate-900 dark:text-slate-100">{actualUtilization}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Target Benchmark:</span>
              <span className="font-bold font-mono text-slate-500">{targets.fleetUtilizationTarget}%</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${utilProgress}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 text-right">
            5 of 6 multi-axle tippers on active duty
          </div>
        </div>
      </div>

      {/* Edit Target Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Configure Monthly KPI Quotas
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTargets} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Tonnage Target (Tons)
                </label>
                <input
                  type="number"
                  required
                  value={formData.monthlyTonsTarget}
                  onChange={(e) => setFormData({ ...formData, monthlyTonsTarget: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Revenue Target (₹)
                </label>
                <input
                  type="number"
                  required
                  value={formData.monthlyRevenueTarget}
                  onChange={(e) => setFormData({ ...formData, monthlyRevenueTarget: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Net Profit Target (₹)
                </label>
                <input
                  type="number"
                  required
                  value={formData.monthlyProfitTarget}
                  onChange={(e) => setFormData({ ...formData, monthlyProfitTarget: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-purple-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Fuel Efficiency (KM/L)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.targetFuelEfficiencyKmpl}
                  onChange={(e) => setFormData({ ...formData, targetFuelEfficiencyKmpl: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Save Targets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
