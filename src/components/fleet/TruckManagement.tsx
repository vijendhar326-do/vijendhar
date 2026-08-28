import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, TruckStatus } from '../../types';
import {
  Plus,
  Search,
  Filter,
  Truck as TruckIcon,
  Shield,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Edit2,
  Trash2,
  X,
  Radio,
  FileCheck,
  Award,
} from 'lucide-react';
import { formatTons, formatDate } from '../../utils/formatters';

export const TruckManagement: React.FC = () => {
  const { trucks, addTruck, updateTruck, deleteTruck, drivers } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTruckId, setEditingTruckId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    registrationNumber: '',
    truckType: 'BharatBenz 2823C 10-Wheeler Tipper',
    capacityTons: 25.0,
    driverId: '',
    status: 'available' as TruckStatus,
    insuranceExpiry: '2026-12-31',
    fcExpiry: '2026-11-30',
    currentLocation: 'SIPCOT Yard 1, Hosur',
    odometerKm: 85000,
    tyreConditionPercent: 88,
    fuelCapacityLitres: 260,
  });

  const handleOpenAdd = () => {
    setEditingTruckId(null);
    setFormData({
      registrationNumber: '',
      truckType: 'BharatBenz 2823C 10-Wheeler Tipper',
      capacityTons: 25.0,
      driverId: drivers[0]?.id || '',
      status: 'available',
      insuranceExpiry: '2027-03-31',
      fcExpiry: '2027-02-28',
      currentLocation: 'SIPCOT Yard 1, Hosur',
      odometerKm: 92000,
      tyreConditionPercent: 90,
      fuelCapacityLitres: 260,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (truck: Truck) => {
    setEditingTruckId(truck.id);
    setFormData({
      registrationNumber: truck.registrationNumber,
      truckType: truck.truckType,
      capacityTons: truck.capacityTons,
      driverId: truck.driverId || '',
      status: truck.status,
      insuranceExpiry: truck.insuranceExpiry,
      fcExpiry: truck.fcExpiry,
      currentLocation: truck.currentLocation,
      odometerKm: truck.odometerKm,
      tyreConditionPercent: truck.tyreConditionPercent,
      fuelCapacityLitres: truck.fuelCapacityLitres,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedDriver = drivers.find((d) => d.id === formData.driverId);

    const payload = {
      registrationNumber: formData.registrationNumber.toUpperCase(),
      truckType: formData.truckType,
      capacityTons: Number(formData.capacityTons),
      driverId: formData.driverId || undefined,
      driverName: assignedDriver ? assignedDriver.name : 'Unassigned',
      status: formData.status,
      insuranceExpiry: formData.insuranceExpiry,
      fcExpiry: formData.fcExpiry,
      currentLocation: formData.currentLocation,
      odometerKm: Number(formData.odometerKm),
      tyreConditionPercent: Number(formData.tyreConditionPercent),
      fuelCapacityLitres: Number(formData.fuelCapacityLitres),
      currentFuelPercent: 85,
      currentSpeedKmH: 0,
      totalTrips: editingTruckId ? (trucks.find(t => t.id === editingTruckId)?.totalTrips || 0) : 0,
      totalTons: editingTruckId ? (trucks.find(t => t.id === editingTruckId)?.totalTons || 0) : 0,
    };

    if (editingTruckId) {
      updateTruck(editingTruckId, payload);
    } else {
      addTruck(payload);
    }
    setIsModalOpen(false);
  };

  const filteredTrucks = trucks.filter((truck) => {
    const matchSearch =
      truck.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.truckType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (truck.driverName && truck.driverName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = filterStatus === 'All' || truck.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
            <TruckIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Fleet & Heavy Hauler Management
            </h1>
            <p className="text-xs text-slate-500">
              Manage 10-16 wheeler tippers, payload compliance, FC/Insurance renewals, and live telemetry
            </p>
          </div>
        </div>

        <button
          id="btn-add-new-truck"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Register New Truck
        </button>
      </div>

      {/* Fleet KPI overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Fleet Size</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{trucks.length} Heavy Haulers</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-0.5">10-16 Wheeler Tippers</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">In Highway Transit</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {trucks.filter((t) => t.status === 'in_transit').length} Trucks Active
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Live GPS tracking active</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Yard Ready / Available</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {trucks.filter((t) => t.status === 'available').length} Trucks Ready
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Available for dispatch</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">In Maintenance / Spares</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {trucks.filter((t) => t.status === 'maintenance').length} In Workshop
          </div>
          <div className="text-[11px] text-rose-500 font-semibold mt-0.5">Scheduled brake/oil work</div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search registration number, model, driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="available">Available (Yard)</option>
            <option value="in_transit">In Transit (Highway)</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Truck Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTrucks.map((truck) => {
          // Check if FC is expiring in less than 30 days
          const isFcExpiringSoon = new Date(truck.fcExpiry) < new Date('2026-10-01');
          return (
            <div
              key={truck.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Status Badge & Reg */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                    {truck.registrationNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      truck.status === 'in_transit'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                        : truck.status === 'available'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {truck.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                  {truck.truckType}
                </h3>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Payload Capacity: <span className="font-bold text-slate-700 dark:text-slate-300">{truck.capacityTons} Metric Tons</span>
                </div>

                {/* Location & Speed */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                    <Radio className="w-3 h-3 text-blue-500 shrink-0" />
                    <span>{truck.currentLocation}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span>Speed: {truck.currentSpeedKmH} km/h</span>
                    <span>Fuel: {truck.currentFuelPercent}%</span>
                  </div>
                </div>

                {/* Driver & Compliance */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">Driver:</span>
                    <span className="font-semibold truncate max-w-[140px]">{truck.driverName || 'Unassigned'}</span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">FC Expiry:</span>
                    <span className={`font-mono text-[11px] ${isFcExpiringSoon ? 'text-amber-500 font-bold' : ''}`}>
                      {formatDate(truck.fcExpiry)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">Total Hauled:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {formatTons(truck.totalTons)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(truck)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete truck ${truck.registrationNumber}?`)) {
                      deleteTruck(truck.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Truck Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {editingTruckId ? 'Edit Heavy Hauler Details' : 'Register New Heavy Hauler'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Registration Number (e.g. TN 38 AB 4521)
                </label>
                <input
                  type="text"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="TN 38 AB 4521"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Truck Model / Make
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.truckType}
                    onChange={(e) => setFormData({ ...formData, truckType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payload Capacity (Tons)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.capacityTons}
                    onChange={(e) => setFormData({ ...formData, capacityTons: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assign Driver
                  </label>
                  <select
                    value={formData.driverId}
                    onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option value="">Unassigned</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Operational Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option value="available">Available (Yard)</option>
                    <option value="in_transit">In Transit (Highway)</option>
                    <option value="maintenance">Maintenance (Workshop)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fitness Certificate (FC) Expiry
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.fcExpiry}
                    onChange={(e) => setFormData({ ...formData, fcExpiry: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Insurance Expiry
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.insuranceExpiry}
                    onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  {editingTruckId ? 'Update Vehicle' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
