import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Route } from '../../types';
import {
  Route as RouteIcon,
  Plus,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Receipt,
  Navigation,
  Edit2,
  Trash2,
  X,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { formatINR, formatTons } from '../../utils/formatters';

export const RouteManagement: React.FC = () => {
  const { routes, addRoute, updateRoute, deleteRoute } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    sourceQuarry: 'Hosur Black Pit #4',
    destination: 'Chennai Harbour Port Docks',
    distanceKm: 315,
    standardRatePerTon: 580,
    estimatedDurationHours: 6.5,
    tollCount: 5,
    estimatedTollCost: 1450,
  });

  const handleOpenAdd = () => {
    setEditingRouteId(null);
    setFormData({
      name: 'Hosur Quarry to Chennai Port Corridor',
      sourceQuarry: 'Hosur Black Pit #4, Krishnagiri',
      destination: 'Chennai Port Container Terminal',
      distanceKm: 315,
      standardRatePerTon: 580,
      estimatedDurationHours: 6.5,
      tollCount: 5,
      estimatedTollCost: 1450,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (route: Route) => {
    setEditingRouteId(route.id);
    setFormData({
      name: route.name,
      sourceQuarry: route.sourceQuarry,
      destination: route.destination,
      distanceKm: route.distanceKm,
      standardRatePerTon: route.standardRatePerTon,
      estimatedDurationHours: route.estimatedDurationHours,
      tollCount: route.tollCount,
      estimatedTollCost: route.estimatedTollCost,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      sourceQuarry: formData.sourceQuarry,
      destination: formData.destination,
      distanceKm: Number(formData.distanceKm),
      standardRatePerTon: Number(formData.standardRatePerTon),
      estimatedDurationHours: Number(formData.estimatedDurationHours),
      tollCount: Number(formData.tollCount),
      estimatedTollCost: Number(formData.estimatedTollCost),
      totalTripsCompleted: editingRouteId ? (routes.find(r => r.id === editingRouteId)?.totalTripsCompleted || 0) : 0,
    };

    if (editingRouteId) {
      updateRoute(editingRouteId, payload);
    } else {
      addRoute(payload);
    }
    setIsModalOpen(false);
  };

  const filteredRoutes = routes.filter((r) => {
    return (
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sourceQuarry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
            <RouteIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Corridor & Route Tariff Management
            </h1>
            <p className="text-xs text-slate-500">
              Pre-configured freight distances, standard stone transport rates per ton, and Fastag toll estimations
            </p>
          </div>
        </div>

        <button
          id="btn-add-new-route"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Freight Corridor
        </button>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoutes.map((route) => (
          <div
            key={route.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  {route.name}
                </h3>
                <span className="font-mono font-bold text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-lg border border-purple-200 dark:border-purple-800">
                  {route.distanceKm} KM
                </span>
              </div>

              {/* Source -> Destination */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <div className="truncate text-slate-700 dark:text-slate-300 font-medium">
                    <span className="text-slate-400">From: </span> {route.sourceQuarry}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <div className="truncate text-slate-700 dark:text-slate-300 font-medium">
                    <span className="text-slate-400">To: </span> {route.destination}
                  </div>
                </div>
              </div>

              {/* Rates & Tolls */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold">Standard Rate / Ton</div>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                    ₹{route.standardRatePerTon} / T
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold">Est. Toll Cost</div>
                  <div className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5">
                    {formatINR(route.estimatedTollCost)} ({route.tollCount} Plazas)
                  </div>
                </div>
              </div>

              {/* Transit Duration & Total Trips */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {route.estimatedDurationHours} Hours Transit
                </span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {route.totalTripsCompleted} Trips Completed
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(route)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-xs font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete route ${route.name}?`)) {
                    deleteRoute(route.id);
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

      {/* Add / Edit Route Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {editingRouteId ? 'Edit Corridor Profile' : 'Configure New Freight Corridor'}
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
                  Corridor Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Hosur Quarry to Chennai Port"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Source Quarry Pit
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sourceQuarry}
                    onChange={(e) => setFormData({ ...formData, sourceQuarry: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Destination Port / Yard
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Distance (KM)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.distanceKm}
                    onChange={(e) => setFormData({ ...formData, distanceKm: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rate / Ton (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.standardRatePerTon}
                    onChange={(e) => setFormData({ ...formData, standardRatePerTon: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.estimatedDurationHours}
                    onChange={(e) => setFormData({ ...formData, estimatedDurationHours: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Toll Gates Count
                  </label>
                  <input
                    type="number"
                    value={formData.tollCount}
                    onChange={(e) => setFormData({ ...formData, tollCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Est. Toll Fastag (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedTollCost}
                    onChange={(e) => setFormData({ ...formData, estimatedTollCost: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-rose-600 font-bold"
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  {editingRouteId ? 'Update Corridor' : 'Save Corridor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
