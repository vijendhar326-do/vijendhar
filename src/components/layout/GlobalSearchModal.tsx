import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Truck,
  Users,
  Layers,
  FileText,
  Building2,
  Package,
  X,
  ArrowRight,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    setActiveTab,
    trucks,
    drivers,
    trips,
    customers,
    inventory,
    invoices,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K and ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
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

  // Search across collections
  const matchedTrucks = trucks.filter(
    (t) => t.registrationNumber.toLowerCase().includes(q) || t.model.toLowerCase().includes(q)
  );

  const matchedDrivers = drivers.filter(
    (d) => d.name.toLowerCase().includes(q) || d.phone.includes(q) || d.licenseNumber.toLowerCase().includes(q)
  );

  const matchedTrips = trips.filter(
    (t) =>
      t.tripId.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.graniteType.toLowerCase().includes(q) ||
      t.truckNumber.toLowerCase().includes(q)
  );

  const matchedCustomers = customers.filter(
    (c) => c.companyName.toLowerCase().includes(q) || c.contactPerson.toLowerCase().includes(q)
  );

  const matchedInventory = inventory.filter(
    (i) => i.blockNumber.toLowerCase().includes(q) || i.graniteType.toLowerCase().includes(q)
  );

  const matchedInvoices = invoices.filter(
    (inv) => inv.invoiceNumber.toLowerCase().includes(q) || inv.customerName.toLowerCase().includes(q)
  );

  const handleSelect = (tab: string) => {
    setActiveTab(tab);
    setIsSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs text-slate-700 dark:text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search trips, trucks, drivers, granite types, invoices, buyers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Trips Section */}
          {matchedTrips.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-blue-500" /> Daily Stone Transfers ({matchedTrips.length})
              </div>
              <div className="space-y-1 mt-1">
                {matchedTrips.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelect('transfers')}
                    className="w-full p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between text-left transition-all"
                  >
                    <div>
                      <span className="font-mono font-black text-blue-600 dark:text-blue-400">{t.tripId}</span>
                      <span className="font-extrabold text-slate-900 dark:text-slate-100 ml-2">{t.customerName}</span>
                      <div className="text-[11px] text-slate-400">
                        {t.graniteType} • {t.totalTons} Tons • {t.truckNumber}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fleet Trucks */}
          {matchedTrucks.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3 h-3 text-emerald-500" /> Fleet Trucks ({matchedTrucks.length})
              </div>
              <div className="space-y-1 mt-1">
                {matchedTrucks.slice(0, 3).map((trk) => (
                  <button
                    key={trk.id}
                    onClick={() => handleSelect('trucks')}
                    className="w-full p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between text-left transition-all"
                  >
                    <div>
                      <span className="font-mono font-black text-slate-900 dark:text-slate-100">
                        {trk.registrationNumber}
                      </span>
                      <span className="text-slate-500 ml-2">
                        {trk.model} ({trk.tonnageCapacity}T Capacity)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase">
                      {trk.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customers */}
          {matchedCustomers.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-purple-500" /> Granite Buyers / Customers ({matchedCustomers.length})
              </div>
              <div className="space-y-1 mt-1">
                {matchedCustomers.slice(0, 3).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect('customers')}
                    className="w-full p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between text-left transition-all"
                  >
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-slate-100">{c.companyName}</div>
                      <div className="text-[10px] text-slate-400">
                        GST: {c.gstin} • Contact: {c.contactPerson}
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                      Due: {formatINR(c.balanceDue)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* If no matches found */}
          {matchedTrips.length === 0 && matchedTrucks.length === 0 && matchedCustomers.length === 0 && (
            <div className="py-8 text-center text-slate-400 space-y-1">
              <p className="font-bold">No exact records matching "{query}"</p>
              <p className="text-[11px]">Try searching by registration number, buyer name, or stone variety.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press ESC to close</span>
          <span className="font-mono">GraniteTrack Global Search Engine</span>
        </div>
      </div>
    </div>
  );
};
