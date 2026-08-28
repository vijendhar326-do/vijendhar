import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MaintenanceLog, MaintenanceType, MaintenanceStatus } from '../../types';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Truck,
  Edit2,
  Trash2,
  X,
  Shield,
  Disc,
  Layers,
} from 'lucide-react';
import { formatINR, formatDate } from '../../utils/formatters';

export const MaintenanceManagement: React.FC = () => {
  const { maintenanceLogs, addMaintenanceLog, updateMaintenanceLog, deleteMaintenanceLog, trucks } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    truckId: trucks[0]?.id || '',
    serviceType: 'Oil Change' as MaintenanceType,
    serviceDate: '2026-08-28',
    nextDueKm: 145000,
    nextDueDate: '2026-11-28',
    cost: 8500,
    workshopName: 'BharatBenz Authorized Service Centre, Hosur',
    partsReplaced: 'Mobil Delvac Engine Oil 15W40 (28L), Spin-on Oil Filter, Air Filter Cartridge',
    status: 'completed' as MaintenanceStatus,
    description: 'Scheduled 15,000 KM major engine oil and filter service',
  });

  const handleOpenAdd = () => {
    setEditingLogId(null);
    setFormData({
      truckId: trucks[0]?.id || '',
      serviceType: 'Brake Pad & Liner',
      serviceDate: '2026-08-28',
      nextDueKm: 140000,
      nextDueDate: '2026-12-15',
      cost: 14500,
      workshopName: 'TVS Heavy Commercial Spares & Service, Salem Bypass',
      partsReplaced: 'Front axle brake liners, S-cam bushes, Brake booster diaphragm',
      status: 'completed',
      description: 'Heavy braking lining replacement for steep quarry descent safety compliance',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (log: MaintenanceLog) => {
    setEditingLogId(log.id);
    setFormData({
      truckId: log.truckId,
      serviceType: log.serviceType,
      serviceDate: log.serviceDate,
      nextDueKm: log.nextDueKm,
      nextDueDate: log.nextDueDate,
      cost: log.cost,
      workshopName: log.workshopName,
      partsReplaced: log.partsReplaced,
      status: log.status,
      description: log.description,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trk = trucks.find((t) => t.id === formData.truckId);

    const payload = {
      truckId: formData.truckId,
      truckNumber: trk ? trk.registrationNumber : 'TN 38 AB 4521',
      serviceType: formData.serviceType,
      serviceDate: formData.serviceDate,
      nextDueKm: Number(formData.nextDueKm),
      nextDueDate: formData.nextDueDate,
      cost: Number(formData.cost),
      workshopName: formData.workshopName,
      partsReplaced: formData.partsReplaced,
      status: formData.status,
      description: formData.description,
    };

    if (editingLogId) {
      updateMaintenanceLog(editingLogId, payload);
    } else {
      addMaintenanceLog(payload);
    }
    setIsModalOpen(false);
  };

  const filteredLogs = maintenanceLogs.filter((log) => {
    const matchSearch =
      log.truckNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.workshopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.partsReplaced.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'All' || log.serviceType === filterType;
    return matchSearch && matchType;
  });

  const totalSpentOnRepairs = filteredLogs.reduce((acc, l) => acc + l.cost, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Fleet Maintenance, Spares & Tyre Overhauls
            </h1>
            <p className="text-xs text-slate-500">
              Track hydraulic tipper rams, heavy-duty brake linings, Apollo radial tyres, and scheduled workshop services
            </p>
          </div>
        </div>

        <button
          id="btn-log-maintenance"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Log Service Job
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Service Logs</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{filteredLogs.length} Records</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Heavy haulers maintenance history</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Repair Spend</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{formatINR(totalSpentOnRepairs)}</div>
          <div className="text-[11px] text-rose-500 font-semibold mt-0.5">Hydraulics, brakes, tyres & lube</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">In Workshop Now</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {filteredLogs.filter((l) => l.status === 'in_progress').length} In Progress
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Scheduled brake/oil work</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Fleet Health Score</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">94.8%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Heavy duty roadworthy</div>
        </div>
      </div>

      {/* Maintenance Logs List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search truck, parts, workshop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Service Types</option>
              <option value="Oil Change">Oil Change</option>
              <option value="Brake Pad & Liner">Brake Pad & Liner</option>
              <option value="Hydraulic Tipper Lift">Hydraulic Tipper Lift</option>
              <option value="Tyre Replacement">Tyre Replacement</option>
              <option value="Engine Overhaul">Engine Overhaul</option>
              <option value="Suspension / Leaf Spring">Suspension / Leaf Spring</option>
              <option value="Battery / Electrical">Battery / Electrical</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Service Date</th>
                <th className="py-3 px-4">Truck Number</th>
                <th className="py-3 px-4">Service Category</th>
                <th className="py-3 px-4">Spares / Workshop</th>
                <th className="py-3 px-4">Next Due (KM / Date)</th>
                <th className="py-3 px-4 text-right">Job Cost</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    {formatDate(log.serviceDate)}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {log.truckNumber}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-rose-600 dark:text-rose-400">
                    {log.serviceType}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{log.workshopName}</div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{log.partsReplaced}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    <div>{log.nextDueKm} KM</div>
                    <div className="text-slate-400">{formatDate(log.nextDueDate)}</div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-black text-rose-600 dark:text-rose-400 text-sm">
                    {formatINR(log.cost)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        log.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : log.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {log.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(log)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete service log?')) {
                            deleteMaintenanceLog(log.id);
                          }
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {editingLogId ? 'Edit Workshop Job Log' : 'Log Maintenance & Spare Parts'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Truck
                  </label>
                  <select
                    value={formData.truckId}
                    onChange={(e) => setFormData({ ...formData, truckId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-medium"
                  >
                    {trucks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.registrationNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Maintenance Category
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option value="Oil Change">Oil Change</option>
                    <option value="Brake Pad & Liner">Brake Pad & Liner</option>
                    <option value="Hydraulic Tipper Lift">Hydraulic Tipper Lift</option>
                    <option value="Tyre Replacement">Tyre Replacement</option>
                    <option value="Engine Overhaul">Engine Overhaul</option>
                    <option value="Suspension / Leaf Spring">Suspension / Leaf Spring</option>
                    <option value="Battery / Electrical">Battery / Electrical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Service Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.serviceDate}
                    onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Repair Cost (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-rose-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Next Due KM
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.nextDueKm}
                    onChange={(e) => setFormData({ ...formData, nextDueKm: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Next Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.nextDueDate}
                    onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Workshop Name & Mechanic
                </label>
                <input
                  type="text"
                  required
                  value={formData.workshopName}
                  onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
                  placeholder="e.g. TVS Heavy Commercial Service, Salem"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Parts Replaced / Spares Invoice Details
                </label>
                <textarea
                  rows={2}
                  value={formData.partsReplaced}
                  onChange={(e) => setFormData({ ...formData, partsReplaced: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  {editingLogId ? 'Update Service Log' : 'Save Service Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
