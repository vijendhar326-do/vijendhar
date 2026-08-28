import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StoneTransferTrip, DeliveryStatus } from '../../types';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  Plus,
  Compass,
} from 'lucide-react';
import { formatTons, formatINR, formatDate } from '../../utils/formatters';

export const ShipmentManagement: React.FC = () => {
  const { trips, updateTrip, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const statuses: DeliveryStatus[] = ['Booked', 'Loading', 'In Transit', 'Delivered', 'Completed'];

  const filteredTrips = trips.filter((t) => {
    return (
      t.tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.truckNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.graniteType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleStatusChange = (tripId: string, newStatus: DeliveryStatus) => {
    updateTrip(tripId, { deliveryStatus: newStatus });
  };

  const getProgressPercentage = (status: DeliveryStatus) => {
    switch (status) {
      case 'Booked':
        return 15;
      case 'Loading':
        return 35;
      case 'In Transit':
        return 70;
      case 'Delivered':
        return 90;
      case 'Completed':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Granite Shipment & Dispatch Pipeline
            </h1>
            <p className="text-xs text-slate-500">
              Track multi-ton rough block transit status from quarry pit gantry cranes to export shipping docks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('tracking')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <Compass className="w-4 h-4 text-blue-500" />
            Live GPS Map
          </button>

          <button
            onClick={() => setActiveTab('transfers')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Book New Shipment
          </button>
        </div>
      </div>

      {/* View Switcher & Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search shipment ID, quarry, customer, truck..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Pipeline Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Detailed List
          </button>
        </div>
      </div>

      {/* Kanban Board Layout */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statuses.map((status) => {
            const statusTrips = filteredTrips.filter((t) => t.deliveryStatus === status);
            const totalStatusTons = statusTrips.reduce((acc, t) => acc + t.totalTons, 0);

            return (
              <div
                key={status}
                className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800/80 p-4 flex flex-col min-h-[500px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      {status}
                    </h3>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {statusTrips.length} Shipments • {totalStatusTons.toFixed(1)} T
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                </div>

                {/* Shipment Cards in this stage */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {statusTrips.length === 0 ? (
                    <div className="text-center py-10 text-[11px] text-slate-400 italic">
                      No shipments in this stage
                    </div>
                  ) : (
                    statusTrips.map((trip) => (
                      <div
                        key={trip.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:shadow-md transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                            {trip.tripId}
                          </span>
                          <span className="font-black text-xs text-slate-900 dark:text-slate-100 font-mono">
                            {trip.totalTons} T
                          </span>
                        </div>

                        <div>
                          <div className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate">
                            {trip.customerName}
                          </div>
                          <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                            {trip.graniteType}
                          </div>
                        </div>

                        {/* Route snippet */}
                        <div className="text-[11px] text-slate-500 space-y-0.5 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{trip.sourceQuarry}</span>
                          </div>
                          <div className="truncate flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{trip.destination}</span>
                          </div>
                        </div>

                        {/* Truck & Driver */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                          <span>{trip.truckNumber}</span>
                          <span>{trip.driverName}</span>
                        </div>

                        {/* Move Stage Quick Selector */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                            Move Stage:
                          </label>
                          <select
                            value={trip.deliveryStatus}
                            onChange={(e) => handleStatusChange(trip.id, e.target.value as DeliveryStatus)}
                            className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200"
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed List View */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Shipment ID</th>
                  <th className="py-3 px-4">Quarry Source → Destination</th>
                  <th className="py-3 px-4">Granite Variety</th>
                  <th className="py-3 px-4 text-right">Tonnage</th>
                  <th className="py-3 px-4">Truck / Driver</th>
                  <th className="py-3 px-4">Transit Progress</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                {filteredTrips.map((trip) => {
                  const prog = getProgressPercentage(trip.deliveryStatus);
                  return (
                    <tr key={trip.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {trip.tripId}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{trip.customerName}</div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {trip.sourceQuarry} → {trip.destination}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">{trip.graniteType}</td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-slate-100 font-mono">
                        {trip.totalTons} T
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold">{trip.truckNumber}</div>
                        <div className="text-[11px] text-slate-400">{trip.driverName}</div>
                      </td>
                      <td className="py-3.5 px-4 min-w-[140px]">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>{trip.deliveryStatus}</span>
                          <span>{prog}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${prog}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={trip.deliveryStatus}
                          onChange={(e) => handleStatusChange(trip.id, e.target.value as DeliveryStatus)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
