import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Driver, DriverStatus } from '../../types';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  CreditCard,
  Award,
  Truck,
  Edit2,
  Trash2,
  X,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { formatINR, formatTons } from '../../utils/formatters';

export const DriverManagement: React.FC = () => {
  const { drivers, addDriver, updateDriver, deleteDriver, trucks } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '+91 98421 ',
    licenseNumber: 'TN-38-2015-00',
    assignedTruckId: '',
    status: 'available' as DriverStatus,
    dailyBatta: 600,
    monthlySalary: 28000,
    advancePaid: 3500,
    rating: 4.8,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  });

  const handleOpenAdd = () => {
    setEditingDriverId(null);
    setFormData({
      name: '',
      phone: '+91 98421 99120',
      licenseNumber: 'TN-38-2018-00912',
      assignedTruckId: trucks[0]?.id || '',
      status: 'available',
      dailyBatta: 600,
      monthlySalary: 28000,
      advancePaid: 0,
      rating: 4.9,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (driver: Driver) => {
    setEditingDriverId(driver.id);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      assignedTruckId: driver.assignedTruckId || '',
      status: driver.status,
      dailyBatta: driver.dailyBatta,
      monthlySalary: driver.monthlySalary,
      advancePaid: driver.advancePaid,
      rating: driver.rating,
      photo: driver.photo,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedTrk = trucks.find((t) => t.id === formData.assignedTruckId);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      licenseNumber: formData.licenseNumber.toUpperCase(),
      assignedTruckId: formData.assignedTruckId || undefined,
      assignedTruckNumber: assignedTrk ? assignedTrk.registrationNumber : 'Unassigned',
      status: formData.status,
      dailyBatta: Number(formData.dailyBatta),
      monthlySalary: Number(formData.monthlySalary),
      advancePaid: Number(formData.advancePaid),
      rating: Number(formData.rating),
      photo: formData.photo,
      totalTrips: editingDriverId ? (drivers.find(d => d.id === editingDriverId)?.totalTrips || 0) : 0,
      totalTons: editingDriverId ? (drivers.find(d => d.id === editingDriverId)?.totalTons || 0) : 0,
    };

    if (editingDriverId) {
      updateDriver(editingDriverId, payload);
    } else {
      addDriver(payload);
    }
    setIsModalOpen(false);
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.includes(searchQuery) ||
      driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (driver.assignedTruckNumber && driver.assignedTruckNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = filterStatus === 'All' || driver.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-600 text-white shadow-md shadow-amber-600/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Driver & Heavy Machinery Personnel
            </h1>
            <p className="text-xs text-slate-500">
              Manage certified HMV drivers, daily batta allowances, salary advances, and safety scores
            </p>
          </div>
        </div>

        <button
          id="btn-add-new-driver"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Driver Profile
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Drivers</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{drivers.length} Certified</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Heavy Motor Vehicle (HMV)</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">On Highway Duty</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {drivers.filter((d) => d.status === 'on_trip').length} Active Trips
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">En route to polishing yards</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Available at Yard</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {drivers.filter((d) => d.status === 'available').length} Drivers Ready
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Ready for next assignment</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Daily Batta</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {formatINR(drivers.reduce((acc, d) => acc + d.dailyBatta, 0))}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Avg ₹600 / day / driver</div>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredDrivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo & Rating */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={driver.photo}
                    alt={driver.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-500/20"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      {driver.name}
                    </h3>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {driver.phone}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    driver.status === 'on_trip'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      : driver.status === 'available'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {driver.status.replace('_', ' ')}
                </span>
              </div>

              {/* License & Truck */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Assigned Truck:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {driver.assignedTruckNumber || 'Unassigned'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">License:</span>
                  <span className="font-mono text-[11px]">{driver.licenseNumber}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Safety Rating:</span>
                  <span className="font-bold text-amber-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {driver.rating}
                  </span>
                </div>
              </div>

              {/* Tonnage & Batta */}
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Trips & Tons:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {driver.totalTrips} Trips • {formatTons(driver.totalTons)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Daily Batta:</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatINR(driver.dailyBatta)} / day
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Salary Advance:</span>
                  <span className="font-mono text-rose-500 font-semibold">
                    {formatINR(driver.advancePaid)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(driver)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete driver ${driver.name}?`)) {
                    deleteDriver(driver.id);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Driver Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {editingDriverId ? 'Edit Driver Profile' : 'Add New Certified Driver'}
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
                  Driver Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    HMV License Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Truck
                  </label>
                  <select
                    value={formData.assignedTruckId}
                    onChange={(e) => setFormData({ ...formData, assignedTruckId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  >
                    <option value="">Unassigned</option>
                    {trucks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.registrationNumber} ({t.truckType})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Driver Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option value="available">Available (Yard)</option>
                    <option value="on_trip">On Highway Trip</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Daily Batta (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.dailyBatta}
                    onChange={(e) => setFormData({ ...formData, dailyBatta: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlySalary}
                    onChange={(e) => setFormData({ ...formData, monthlySalary: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Advance Paid (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.advancePaid}
                    onChange={(e) => setFormData({ ...formData, advancePaid: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
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
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  {editingDriverId ? 'Update Profile' : 'Save Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
