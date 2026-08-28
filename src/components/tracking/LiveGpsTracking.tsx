import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Truck,
  Radio,
  MapPin,
  Fuel,
  Gauge,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  Clock,
  Layers,
} from 'lucide-react';
import { formatTons, formatINR } from '../../utils/formatters';

export const LiveGpsTracking: React.FC = () => {
  const { trucks, isGpsSimulating, toggleGpsSimulation } = useApp();
  const [selectedTruckId, setSelectedTruckId] = useState<string>(trucks[0]?.id || '');

  const selectedTruck = trucks.find((t) => t.id === selectedTruckId) || trucks[0];

  // Freight corridors key landmarks
  const corridors = [
    { name: 'NH44 / NH48 Hosur-Chennai Port', dist: '315 KM', avgHours: '6.5 Hrs', activeTrucks: 3 },
    { name: 'Madurai Melur - Tuticorin Port', dist: '155 KM', avgHours: '3.8 Hrs', activeTrucks: 2 },
    { name: 'Chimakurthy - Krishnapatnam Port', dist: '185 KM', avgHours: '4.2 Hrs', activeTrucks: 2 },
    { name: 'Kanakapura - Bangalore SEZ', dist: '65 KM', avgHours: '2.0 Hrs', activeTrucks: 1 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Live Fleet GPS & Telematics Radar
            </h1>
            <p className="text-xs text-slate-500">
              Simulated real-time satellite telemetry along South India heavy granite freight corridors
            </p>
          </div>
        </div>

        {/* Telemetry simulation toggle */}
        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-telemetry-state"
            onClick={toggleGpsSimulation}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
              isGpsSimulating
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {isGpsSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isGpsSimulating ? 'Simulating Live Telemetry' : 'Resume Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Radar Map View + Active Truck Telemetry Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Map Canvas Visualizer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden min-h-[480px] flex flex-col justify-between">
            {/* Ambient Map Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

            {/* Map Header Overlay */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800 text-xs text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold">South India Heavy Freight Route Matrix</span>
                <span className="text-[10px] text-slate-400 font-mono">TN • KA • AP</span>
              </div>

              <div className="text-[11px] font-mono text-emerald-400 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                Pinging {trucks.filter((t) => t.status === 'in_transit').length} In-Transit Trucks
              </div>
            </div>

            {/* Simulated Geographic Highway Nodes on Canvas */}
            <div className="relative z-10 py-12 px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {/* Node 1: Hosur SIPCOT */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-left">
                <div className="text-[10px] font-mono text-blue-400 uppercase font-bold">Western Quarry Hub</div>
                <div className="font-extrabold text-sm text-white mt-1">Hosur SIPCOT</div>
                <div className="text-[11px] text-slate-400 mt-0.5">12.7409° N, 77.8253° E</div>
                <div className="mt-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Weighbridge Active
                </div>
              </div>

              {/* Node 2: Salem / Krishnagiri NH44 */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-left">
                <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">Transit Corridor</div>
                <div className="font-extrabold text-sm text-white mt-1">Salem NH44 Bypass</div>
                <div className="text-[11px] text-slate-400 mt-0.5">11.6643° N, 78.1460° E</div>
                <div className="mt-2 text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                  <Navigation className="w-3 h-3" /> Fastag Plaza
                </div>
              </div>

              {/* Node 3: Chimakurthy Galaxy Pit */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-left">
                <div className="text-[10px] font-mono text-purple-400 uppercase font-bold">Galaxy Quarry</div>
                <div className="font-extrabold text-sm text-white mt-1">Chimakurthy Pit 1</div>
                <div className="text-[11px] text-slate-400 mt-0.5">15.5800° N, 79.8700° E</div>
                <div className="mt-2 text-[10px] text-purple-300 font-semibold flex items-center gap-1">
                  <Layers className="w-3 h-3" /> 24T Gantry Crane
                </div>
              </div>

              {/* Node 4: Chennai Harbour Dock */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-left">
                <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Export Shipping</div>
                <div className="font-extrabold text-sm text-white mt-1">Chennai Port SEZ</div>
                <div className="text-[11px] text-slate-400 mt-0.5">13.0827° N, 80.2707° E</div>
                <div className="mt-2 text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Container Terminal
                </div>
              </div>
            </div>

            {/* Live Moving Trucks Markers Grid on Map */}
            <div className="relative z-10 bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase mb-3">
                Live Highway Position Pings
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {trucks.slice(0, 4).map((trk) => (
                  <button
                    key={trk.id}
                    onClick={() => setSelectedTruckId(trk.id)}
                    className={`p-2.5 rounded-xl text-left transition-all border ${
                      selectedTruckId === trk.id
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span>{trk.registrationNumber}</span>
                      <span className={`w-2 h-2 rounded-full ${trk.status === 'in_transit' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                    </div>
                    <div className="text-[10px] opacity-80 truncate mt-1">{trk.currentLocation}</div>
                    <div className="text-[10px] font-mono font-bold mt-1 opacity-90">
                      {trk.currentSpeedKmH} km/h • {trk.currentFuelPercent}% Fuel
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Freight Corridors Strip */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 mb-4">
              Major Granite Freight Highway Corridors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {corridors.map((c) => (
                <div
                  key={c.name}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{c.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{c.dist} • Avg ETA: {c.avgHours}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-[10px] border border-blue-200 dark:border-blue-800">
                    {c.activeTrucks} Trucks
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Selected Truck Telemetry Gauge */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Vehicle</span>
                <h3 className="font-mono font-black text-lg text-slate-900 dark:text-slate-100">
                  {selectedTruck.registrationNumber}
                </h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  selectedTruck.status === 'in_transit'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {selectedTruck.status.replace('_', ' ')}
              </span>
            </div>

            {/* Telemetry Dial Gauges */}
            <div className="grid grid-cols-2 gap-3 text-center">
              {/* Speed Gauge */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <Gauge className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="text-[10px] font-semibold text-slate-400 uppercase">GPS Speed</div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                  {selectedTruck.currentSpeedKmH}
                  <span className="text-xs font-normal"> km/h</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Highway cruise pace</div>
              </div>

              {/* Fuel Level */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <Fuel className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Fuel Level</div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                  {selectedTruck.currentFuelPercent}%
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{Math.round((selectedTruck.fuelCapacityLitres * selectedTruck.currentFuelPercent) / 100)} L remaining</div>
              </div>
            </div>

            {/* Coordinates & Location info */}
            <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Position:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{selectedTruck.currentLocation}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Latitude:</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedTruck.latitude?.toFixed(4) || '12.7409'}° N</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Longitude:</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedTruck.longitude?.toFixed(4) || '77.8253'}° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Driver in Cab:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTruck.driverName || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Odometer:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedTruck.odometerKm} KM</span>
              </div>
            </div>

            {/* Safety & Tyres */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Tyre Condition:</span>
                <span className="font-bold text-emerald-600">{selectedTruck.tyreConditionPercent}% (Radial OK)</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${selectedTruck.tyreConditionPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
