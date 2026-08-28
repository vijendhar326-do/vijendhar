import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Truck, User, Building2, FileText, ArrowRight, MapPin, Receipt } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    trucks,
    drivers,
    customers,
    trips,
    invoices,
    setActiveTab,
    setModalData,
    setActiveModal,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedTrucks = q
    ? trucks.filter(
        (t) =>
          t.registrationNumber.toLowerCase().includes(q) ||
          t.driverName.toLowerCase().includes(q) ||
          t.truckType.toLowerCase().includes(q)
      )
    : [];

  const matchedDrivers = q
    ? drivers.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.phone.includes(q) ||
          d.licenseNumber.toLowerCase().includes(q)
      )
    : [];

  const matchedCustomers = q
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.companyName.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.gstNumber.toLowerCase().includes(q)
      )
    : [];

  const matchedTrips = q
    ? trips.filter(
        (t) =>
          t.tripId.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.graniteType.toLowerCase().includes(q) ||
          t.truckNumber.toLowerCase().includes(q) ||
          t.driverName.toLowerCase().includes(q)
      )
    : [];

  const matchedInvoices = q
    ? invoices.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.customerName.toLowerCase().includes(q)
      )
    : [];

  const hasResults =
    matchedTrucks.length > 0 ||
    matchedDrivers.length > 0 ||
    matchedCustomers.length > 0 ||
    matchedTrips.length > 0 ||
    matchedInvoices.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/70 backdrop-blur-sm p-4">
      <div
        id="global-search-dialog"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            id="global-search-input"
            type="text"
            autoFocus
            placeholder="Search trucks, drivers, customers, trips, invoices, granite..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-base"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center text-slate-400 text-sm">
              <p className="font-medium text-slate-600 dark:text-slate-300">Instant Global Navigation</p>
              <p className="mt-1">Try typing <span className="text-blue-500 font-mono">"TN 38"</span>, <span className="text-blue-500 font-mono">"Ramesh"</span>, <span className="text-blue-500 font-mono">"Lakshmi"</span>, or <span className="text-blue-500 font-mono">"Galaxy"</span></p>
            </div>
          )}

          {query && !hasResults && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No matching records found for "{query}"
            </div>
          )}

          {/* Trucks */}
          {matchedTrucks.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-500" /> Trucks ({matchedTrucks.length})
              </div>
              <div className="space-y-1.5">
                {matchedTrucks.map((truck) => (
                  <button
                    key={truck.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActiveTab('trucks');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
                        {truck.registrationNumber}
                      </div>
                      <div className="text-xs text-slate-500">
                        {truck.truckType} • Driver: {truck.driverName} • {truck.currentLocation}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {truck.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trips */}
          {matchedTrips.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-emerald-500" /> Stone Trips ({matchedTrips.length})
              </div>
              <div className="space-y-1.5">
                {matchedTrips.map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActiveTab('transfers');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600">
                        {trip.tripId} — {trip.graniteType} ({trip.totalTons}T)
                      </div>
                      <div className="text-xs text-slate-500">
                        {trip.customerName} • {trip.sourceQuarry} → {trip.destination}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {formatINR(trip.totalAmount)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customers */}
          {matchedCustomers.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-500" /> Customers ({matchedCustomers.length})
              </div>
              <div className="space-y-1.5">
                {matchedCustomers.map((cust) => (
                  <button
                    key={cust.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActiveTab('customers');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600">
                        {cust.companyName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {cust.city} • GST: {cust.gstNumber} • {cust.phone}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{cust.totalOrders} orders</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Drivers */}
          {matchedDrivers.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" /> Drivers ({matchedDrivers.length})
              </div>
              <div className="space-y-1.5">
                {matchedDrivers.map((driver) => (
                  <button
                    key={driver.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActiveTab('drivers');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600">
                        {driver.name} (⭐ {driver.rating})
                      </div>
                      <div className="text-xs text-slate-500">
                        Truck: {driver.assignedTruckNumber || 'None'} • {driver.phone}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {driver.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {matchedInvoices.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-500" /> Invoices ({matchedInvoices.length})
              </div>
              <div className="space-y-1.5">
                {matchedInvoices.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActiveTab('billing');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600">
                        {inv.invoiceNumber}
                      </div>
                      <div className="text-xs text-slate-500">
                        {inv.customerName} • {inv.graniteType}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {formatINR(inv.grandTotal)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px]">ESC</kbd> to close
          </div>
          <span>GraniteTrack Pro Fleet Index</span>
        </div>
      </div>
    </div>
  );
};
