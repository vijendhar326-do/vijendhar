import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FuelLog } from '../../types';
import {
  Fuel,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  X,
  Gauge,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { formatINR, formatDate } from '../../utils/formatters';

export const FuelManagement: React.FC = () => {
  const { fuelLogs, addFuelLog, updateFuelLog, deleteFuelLog, trucks, drivers } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTruck, setFilterTruck] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  // Form state with live auto-calc
  const [formData, setFormData] = useState({
    date: '2026-08-28',
    truckId: trucks[0]?.id || '',
    truckNumber: trucks[0]?.registrationNumber || '',
    driverId: drivers[0]?.id || '',
    driverName: drivers[0]?.name || '',
    fuelType: 'Diesel' as const,
    litres: 120,
    ratePerLitre: 94.5,
    openingKm: 124500,
    closingKm: 124960,
    pumpStation: 'Indian Oil Highway Swagat, NH44 Krishnagiri',
    paymentMode: 'IOCL Fleet Card' as const,
    slipNumber: 'IOCL-KG-98421',
  });

  // Live calculations
  const totalCost = Number(formData.litres || 0) * Number(formData.ratePerLitre || 0);
  const totalKm = Math.max(0, Number(formData.closingKm || 0) - Number(formData.openingKm || 0));
  const mileageKmpl = formData.litres > 0 ? totalKm / Number(formData.litres) : 0;

  const handleOpenAdd = () => {
    setEditingLogId(null);
    setFormData({
      date: '2026-08-28',
      truckId: trucks[0]?.id || '',
      truckNumber: trucks[0]?.registrationNumber || '',
      driverId: drivers[0]?.id || '',
      driverName: drivers[0]?.name || '',
      fuelType: 'Diesel',
      litres: 110,
      ratePerLitre: 94.5,
      openingKm: 125000,
      closingKm: 125430,
      pumpStation: 'Bharat Petroleum Oasis, Salem Bypass',
      paymentMode: 'BPCL SmartFleet',
      slipNumber: `PUMP-${Math.floor(10000 + Math.random() * 90000)}`,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (log: FuelLog) => {
    setEditingLogId(log.id);
    setFormData({
      date: log.date,
      truckId: log.truckId,
      truckNumber: log.truckNumber,
      driverId: log.driverId,
      driverName: log.driverName,
      fuelType: log.fuelType,
      litres: log.litres,
      ratePerLitre: log.ratePerLitre,
      openingKm: log.openingKm,
      closingKm: log.closingKm,
      pumpStation: log.pumpStation,
      paymentMode: log.paymentMode,
      slipNumber: log.slipNumber,
    });
    setIsModalOpen(true);
  };

  const handleTruckChange = (truckId: string) => {
    const trk = trucks.find((t) => t.id === truckId);
    if (trk) {
      setFormData((prev) => ({
        ...prev,
        truckId: trk.id,
        truckNumber: trk.registrationNumber,
        driverId: trk.driverId || prev.driverId,
        driverName: trk.driverName || prev.driverName,
        openingKm: trk.odometerKm,
        closingKm: trk.odometerKm + 420,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      date: formData.date,
      truckId: formData.truckId,
      truckNumber: formData.truckNumber,
      driverId: formData.driverId,
      driverName: formData.driverName,
      fuelType: formData.fuelType,
      litres: Number(formData.litres),
      ratePerLitre: Number(formData.ratePerLitre),
      totalCost,
      openingKm: Number(formData.openingKm),
      closingKm: Number(formData.closingKm),
      totalKm,
      mileageKmpl: Number(mileageKmpl.toFixed(2)),
      pumpStation: formData.pumpStation,
      paymentMode: formData.paymentMode,
      slipNumber: formData.slipNumber,
    };

    if (editingLogId) {
      updateFuelLog(editingLogId, payload);
    } else {
      addFuelLog(payload);
    }
    setIsModalOpen(false);
  };

  const filteredLogs = fuelLogs.filter((log) => {
    const matchSearch =
      log.truckNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.pumpStation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.slipNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTruck = filterTruck === 'All' || log.truckId === filterTruck;
    return matchSearch && matchTruck;
  });

  const totalLitres = filteredLogs.reduce((acc, l) => acc + l.litres, 0);
  const totalFuelCost = filteredLogs.reduce((acc, l) => acc + l.totalCost, 0);
  const totalKmRun = filteredLogs.reduce((acc, l) => acc + l.totalKm, 0);
  const avgMileage = totalLitres > 0 ? totalKmRun / totalLitres : 0;

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Date,Slip Number,Truck Number,Driver,Litres,Rate/L,Total Cost,Opening KM,Closing KM,Total KM,Mileage (KM/L),Pump Station,Payment Mode'];
    const rows = filteredLogs.map((l) =>
      [
        l.date,
        l.slipNumber,
        l.truckNumber,
        `"${l.driverName}"`,
        l.litres,
        l.ratePerLitre,
        l.totalCost,
        l.openingKm,
        l.closingKm,
        l.totalKm,
        l.mileageKmpl,
        `"${l.pumpStation}"`,
        `"${l.paymentMode}"`,
      ].join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'GraniteTrack_Fuel_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-600 text-white shadow-md shadow-amber-600/30">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Fuel & Diesel Mileage Management
            </h1>
            <p className="text-xs text-slate-500">
              Track pump slips, opening/closing odometer pings, fuel cards, and automatic KM/L calculations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-300 dark:border-slate-700"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            id="btn-log-fuel-entry"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Log Diesel Fill-up
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Diesel Consumed</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{totalLitres} Litres</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across {filteredLogs.length} fill-up logs</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Fuel Expense</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{formatINR(totalFuelCost)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Avg ₹94.50 / Litre</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Distance Run</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{totalKmRun} KM</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Verified odometer delta</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Fleet Average Mileage</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{avgMileage.toFixed(2)} KM/L</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Optimal for 25T load</div>
        </div>
      </div>

      {/* Fuel Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search truck, slip number, pump..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterTruck}
              onChange={(e) => setFilterTruck(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Trucks</option>
              {trucks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.registrationNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Date & Slip</th>
                <th className="py-3 px-4">Truck & Driver</th>
                <th className="py-3 px-4">Petrol Pump</th>
                <th className="py-3 px-4 text-right">Litres</th>
                <th className="py-3 px-4 text-right">Rate</th>
                <th className="py-3 px-4 text-right">Total Cost</th>
                <th className="py-3 px-4 text-center">Odometer KM (Open → Close)</th>
                <th className="py-3 px-4 text-right">Distance</th>
                <th className="py-3 px-4 text-center">Mileage</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{formatDate(log.date)}</div>
                    <div className="font-mono text-[10px] text-slate-400">{log.slipNumber}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{log.truckNumber}</div>
                    <div className="text-[11px] text-slate-400">{log.driverName}</div>
                  </td>

                  <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-700 dark:text-slate-300" title={log.pumpStation}>
                    {log.pumpStation}
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-slate-100">
                    {log.litres} L
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                    ₹{log.ratePerLitre}
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-rose-600 dark:text-rose-400 font-mono">
                    {formatINR(log.totalCost)}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-500">
                    {log.openingKm} → {log.closingKm}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                    {log.totalKm} KM
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-mono">
                      {log.mileageKmpl} KM/L
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {log.paymentMode}
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
                          if (window.confirm('Delete fuel entry?')) {
                            deleteFuelLog(log.id);
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

      {/* Add / Edit Fuel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {editingLogId ? 'Edit Diesel Fill-up Log' : 'Log Diesel Fill-up & Mileage'}
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
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Truck
                  </label>
                  <select
                    value={formData.truckId}
                    onChange={(e) => handleTruckChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-medium"
                  >
                    {trucks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.registrationNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Litres, Rate, Auto Total Cost */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Litres
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.litres}
                      onChange={(e) => setFormData({ ...formData, litres: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Rate / Litre (₹)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      required
                      value={formData.ratePerLitre}
                      onChange={(e) => setFormData({ ...formData, ratePerLitre: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Total Cost (Auto)
                    </label>
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-rose-600 font-black">
                      {formatINR(totalCost)}
                    </div>
                  </div>
                </div>

                {/* Odometer & Mileage Auto */}
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-amber-200/60 dark:border-amber-800/60">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Opening KM
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.openingKm}
                      onChange={(e) => setFormData({ ...formData, openingKm: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Closing KM
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.closingKm}
                      onChange={(e) => setFormData({ ...formData, closingKm: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mileage (Auto)
                    </label>
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-600 font-black">
                      {mileageKmpl.toFixed(2)} KM/L ({totalKm} KM)
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Petrol Pump / Station Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pumpStation}
                    onChange={(e) => setFormData({ ...formData, pumpStation: e.target.value })}
                    placeholder="e.g. IOCL Highway Swagat, NH44"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option value="IOCL Fleet Card">IOCL Fleet Card</option>
                    <option value="BPCL SmartFleet">BPCL SmartFleet</option>
                    <option value="HPCL DriveTrack">HPCL DriveTrack</option>
                    <option value="Fastag Fuel">Fastag Fuel Wallet</option>
                    <option value="Cash">Cash at Pump</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pump Slip / Invoice Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.slipNumber}
                  onChange={(e) => setFormData({ ...formData, slipNumber: e.target.value })}
                  placeholder="e.g. SLIP-99824"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
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
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  {editingLogId ? 'Update Fuel Log' : 'Save Fuel Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
