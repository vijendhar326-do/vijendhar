import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Truck,
  MapPin,
  CheckCircle2,
  Fuel,
  DollarSign,
  AlertTriangle,
  Camera,
  Navigation,
  Phone,
  Clock,
  Send,
  Scale,
  ShieldAlert,
} from 'lucide-react';
import { formatINR, formatTons } from '../../utils/formatters';

export const DriverMobileApp: React.FC = () => {
  const { trips, drivers, trucks, addFuelLog, addDeliveryProof } = useApp();

  const [activeDriverId, setActiveDriverId] = useState(drivers[0]?.id || 'driver-1');
  const [activeTab, setActiveTab] = useState<'trips' | 'fuel' | 'batta' | 'sos'>('trips');

  const selectedDriver = drivers.find((d) => d.id === activeDriverId) || drivers[0];
  const driverTrips = trips.filter((t) => t.driverId === selectedDriver?.id || t.driverName.includes(selectedDriver?.name.split(' ')[0]));

  // Fuel quick entry
  const [fuelLitres, setFuelLitres] = useState(120);
  const [fuelCost, setFuelCost] = useState(11280);
  const [fuelPump, setFuelPump] = useState('Indian Oil Swagat Toll Plaza Pump, Krishnagiri');
  const [fuelLogged, setFuelLogged] = useState(false);

  // SOS state
  const [sosSent, setSosSent] = useState(false);

  const handleQuickFuel = (e: React.FormEvent) => {
    e.preventDefault();
    addFuelLog({
      truckId: selectedDriver?.assignedTruckId || 'truck-1',
      truckNumber: selectedDriver?.assignedTruckNumber || 'TN 38 AB 4521',
      driverId: selectedDriver?.id || 'driver-1',
      driverName: selectedDriver?.name || 'R. Murugan',
      date: '2026-08-28',
      litres: Number(fuelLitres),
      ratePerLitre: 94.0,
      totalCost: Number(fuelCost),
      odometerReading: 139800,
      pumpStation: fuelPump,
      slipNumber: `FUEL-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod: 'HPCL Fleet Card',
      fullTank: true,
      mileageKmpl: 3.25,
      totalKm: 390,
    });
    setFuelLogged(true);
    setTimeout(() => setFuelLogged(false), 3000);
  };

  const handleTriggerSOS = () => {
    setSosSent(true);
    setTimeout(() => setSosSent(false), 5000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Driver Switcher Bar (For Demo & Testing) */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-600 text-white">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
              Driver Companion Terminal (PWA Mode)
            </div>
            <div className="text-[10px] text-slate-500">Live Driver Phone Simulation & Field Workflows</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Simulate Driver:</span>
          <select
            value={activeDriverId}
            onChange={(e) => setActiveDriverId(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200"
          >
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.assignedTruckNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Simulated Mobile Phone Container Frame */}
      <div className="max-w-md mx-auto bg-slate-950 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 text-slate-100 ring-1 ring-white/10">
        {/* Mobile Header Bar */}
        <div className="px-5 pt-3 pb-4 bg-gradient-to-b from-slate-900 to-slate-950 rounded-[32px] border-b border-slate-800">
          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-3">
            <span className="font-bold">14:45</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <span>⚡ 94%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-base shadow-md shadow-blue-600/40">
                {selectedDriver?.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-black text-sm text-white">{selectedDriver?.name}</h2>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Truck className="w-3 h-3" /> {selectedDriver?.assignedTruckNumber}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400">Today's Batta</div>
              <div className="font-mono font-black text-sm text-emerald-400">
                {formatINR(selectedDriver?.dailyBatta || 600)}
              </div>
            </div>
          </div>

          {/* Quick Tab Selector */}
          <div className="grid grid-cols-4 gap-1 mt-4 p-1 bg-slate-900/80 rounded-2xl border border-slate-800 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab('trips')}
              className={`py-1.5 rounded-xl transition-all ${
                activeTab === 'trips' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Trips
            </button>
            <button
              onClick={() => setActiveTab('fuel')}
              className={`py-1.5 rounded-xl transition-all ${
                activeTab === 'fuel' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fuel
            </button>
            <button
              onClick={() => setActiveTab('batta')}
              className={`py-1.5 rounded-xl transition-all ${
                activeTab === 'batta' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Batta
            </button>
            <button
              onClick={() => setActiveTab('sos')}
              className={`py-1.5 rounded-xl transition-all ${
                activeTab === 'sos' ? 'bg-rose-600 text-white animate-pulse' : 'text-rose-400 hover:text-white'
              }`}
            >
              SOS
            </button>
          </div>
        </div>

        {/* Mobile Body Content */}
        <div className="p-4 space-y-4 min-h-[480px]">
          {/* TRIPS TAB */}
          {activeTab === 'trips' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-slate-300">Assigned Deliveries</span>
                <span className="text-[10px] bg-blue-950 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                  {driverTrips.length} Dispatched
                </span>
              </div>

              {driverTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3.5 space-y-3 shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-xs text-blue-400">{trip.tripId}</span>
                      <h4 className="font-extrabold text-xs text-white mt-0.5">{trip.customerName}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 uppercase">
                      {trip.deliveryStatus}
                    </span>
                  </div>

                  {/* Route & Cargo */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{trip.sourceQuarry} → {trip.destination}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 font-mono text-[10px] pt-1 border-t border-slate-800">
                      <span>Stone: {trip.graniteType}</span>
                      <span className="font-bold text-white">{trip.totalTons} Tons</span>
                    </div>
                  </div>

                  {/* Quick Mobile Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => alert(`Starting GPS Turn-by-Turn Navigation to ${trip.destination}`)}
                      className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Navigate
                    </button>
                    <button
                      onClick={() => alert(`Weighbridge Slip Photo uploaded for ${trip.tripId}. Delivery Certified!`)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30"
                    >
                      <Camera className="w-3.5 h-3.5" /> Snap POD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FUEL TAB */}
          {activeTab === 'fuel' && (
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-4 shadow-md">
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-amber-400" />
                <h3 className="font-extrabold text-xs text-white">Log Diesel Refueling</h3>
              </div>

              {fuelLogged && (
                <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" /> Diesel fill-up submitted to accounts!
                </div>
              )}

              <form onSubmit={handleQuickFuel} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Litres Filled</label>
                  <input
                    type="number"
                    required
                    value={fuelLitres}
                    onChange={(e) => {
                      const l = Number(e.target.value);
                      setFuelLitres(l);
                      setFuelCost(Math.round(l * 94));
                    }}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Total Bill Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={fuelCost}
                    onChange={(e) => setFuelCost(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Pump Station Name</label>
                  <input
                    type="text"
                    required
                    value={fuelPump}
                    onChange={(e) => setFuelPump(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Pump Slip
                </button>
              </form>
            </div>
          )}

          {/* BATTA TAB */}
          {activeTab === 'batta' && (
            <div className="space-y-3">
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
                <span className="text-xs text-slate-400">Driver Account Summary</span>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">Monthly Salary:</span>
                    <div className="font-mono font-bold text-white text-sm mt-0.5">
                      {formatINR(selectedDriver?.monthlySalary || 28000)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">Daily Batta:</span>
                    <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                      {formatINR(selectedDriver?.dailyBatta || 600)} / day
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2 text-xs">
                <span className="font-bold text-white">Recent Batta Disbursals</span>
                <div className="space-y-2 pt-2 text-[11px] font-mono">
                  <div className="flex justify-between p-2 rounded-lg bg-slate-950">
                    <span className="text-slate-400">28 Aug 2026 (Today)</span>
                    <span className="text-emerald-400 font-bold">+₹600 Cash</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-950">
                    <span className="text-slate-400">27 Aug 2026</span>
                    <span className="text-emerald-400 font-bold">+₹600 Cash</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-950">
                    <span className="text-slate-400">26 Aug 2026</span>
                    <span className="text-emerald-400 font-bold">+₹600 Cash</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SOS TAB */}
          {activeTab === 'sos' && (
            <div className="bg-rose-950/60 border border-rose-800/80 rounded-2xl p-5 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/50 animate-bounce">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-black text-white text-base">Emergency SOS Dispatch</h3>
                <p className="text-xs text-rose-200 mt-1">
                  Instant GPS alert to Fleet Operations Manager & 24/7 Breakdown Recovery Unit
                </p>
              </div>

              {sosSent ? (
                <div className="p-3 rounded-xl bg-rose-900 text-white text-xs font-bold">
                  🚨 SOS Broadcasted! Manager notified with GPS coordinates (12.7409° N, 77.8253° E).
                </div>
              ) : (
                <button
                  onClick={handleTriggerSOS}
                  className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-rose-600/40 transition-all active:scale-95"
                >
                  PRESS FOR BREAKDOWN SOS
                </button>
              )}

              <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                <div>HQ Hotline: <a href="tel:+919842188990" className="text-blue-400 underline">+91 98421 88990</a></div>
                <div>TVS Roadside Recovery: <a href="tel:18002587788" className="text-blue-400 underline">1800 258 7788</a></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
