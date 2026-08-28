import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraniteInventoryItem, GraniteType, StoneGrade, InventoryStatus } from '../../types';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Box,
  Scale,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { formatINR, formatTons } from '../../utils/formatters';

export const InventoryManagement: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form State with Auto-Calculations (L × W × H -> CBM -> Tons -> Total Value)
  const [formData, setFormData] = useState({
    blockNumber: 'BLK-2026-912',
    graniteType: 'Absolute Black (Hosur Premium)' as GraniteType,
    grade: 'A+ Export Grade' as StoneGrade,
    lengthM: 3.2,
    widthM: 1.8,
    heightM: 1.6,
    weightTons: 25.8,
    quarryLocation: 'Hosur Quarry Pit #4',
    status: 'in_stock' as InventoryStatus,
    pricePerTon: 3400,
  });

  // Derived calculations
  const calculatedCbm = Number((formData.lengthM * formData.widthM * formData.heightM).toFixed(3));
  // Specific gravity of granite is ~2.80 to 2.95 metric tons per cubic meter
  const autoWeightTons = Number((calculatedCbm * 2.85).toFixed(2));
  const autoTotalValue = Number((formData.weightTons * formData.pricePerTon).toFixed(0));

  const handleOpenAdd = () => {
    setEditingItemId(null);
    setFormData({
      blockNumber: `BLK-2026-${Math.floor(100 + Math.random() * 900)}`,
      graniteType: 'Absolute Black (Hosur Premium)',
      grade: 'A+ Export Grade',
      lengthM: 3.2,
      widthM: 1.8,
      heightM: 1.6,
      weightTons: 26.2,
      quarryLocation: 'Hosur Black Pit #4',
      status: 'in_stock',
      pricePerTon: 3400,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GraniteInventoryItem) => {
    setEditingItemId(item.id);
    setFormData({
      blockNumber: item.blockNumber,
      graniteType: item.graniteType,
      grade: item.grade,
      lengthM: item.lengthM,
      widthM: item.widthM,
      heightM: item.heightM,
      weightTons: item.weightTons,
      quarryLocation: item.quarryLocation,
      status: item.status,
      pricePerTon: item.pricePerTon,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      blockNumber: formData.blockNumber.toUpperCase(),
      graniteType: formData.graniteType,
      grade: formData.grade,
      lengthM: Number(formData.lengthM),
      widthM: Number(formData.widthM),
      heightM: Number(formData.heightM),
      volumeCbm: calculatedCbm,
      weightTons: Number(formData.weightTons),
      quarryLocation: formData.quarryLocation,
      status: formData.status,
      pricePerTon: Number(formData.pricePerTon),
      totalValue: autoTotalValue,
    };

    if (editingItemId) {
      updateInventoryItem(editingItemId, payload);
    } else {
      addInventoryItem(payload);
    }
    setIsModalOpen(false);
  };

  const filteredItems = inventory.filter((item) => {
    const matchSearch =
      item.blockNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.graniteType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.quarryLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'All' || item.graniteType === filterType;
    const matchStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const totalTonsInStock = filteredItems.reduce((acc, i) => acc + i.weightTons, 0);
  const totalValuation = filteredItems.reduce((acc, i) => acc + i.totalValue, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 text-white shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Granite Stone Block Inventory & Stockyard
            </h1>
            <p className="text-xs text-slate-500">
              Track rough blocks by dimensional CBM volume, granite density (2.85 T/m³), quality grades, and pit stock
            </p>
          </div>
        </div>

        <button
          id="btn-add-new-granite-block"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Tag New Rough Block
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Tagged Blocks</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{filteredItems.length} Monoliths</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Rough quarry extracted</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Stock Tonnage</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{formatTons(totalTonsInStock)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across {filteredItems.reduce((acc, i) => acc + i.volumeCbm, 0).toFixed(1)} CBM</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Stockyard Valuation</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{formatINR(totalValuation)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Inventory market rate</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">In Yard Stock</div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {filteredItems.filter((i) => i.status === 'in_stock').length} Blocks
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Ready for gantry tipper load</div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search block serial, stone type, quarry pit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="All">All Varieties</option>
            <option value="Absolute Black (Hosur Premium)">Absolute Black</option>
            <option value="Black Galaxy (Chimakurthy Gold Star)">Black Galaxy</option>
            <option value="Tan Brown (Karimnagar)">Tan Brown</option>
            <option value="Kashmir White (Madurai Melur)">Kashmir White</option>
            <option value="Vizag Blue (Srikakulam)">Vizag Blue</option>
            <option value="Hassan Green">Hassan Green</option>
            <option value="Paradiso Multi-Color (Krishnagiri)">Paradiso</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="in_stock">In Stock (Quarry Pit)</option>
            <option value="in_transit">In Transit (On Truck)</option>
            <option value="delivered">Delivered (Buyer Yard)</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Block Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                  {item.blockNumber}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    item.status === 'in_stock'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : item.status === 'in_transit'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  }`}
                >
                  {item.status.replace('_', ' ')}
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">
                {item.graniteType}
              </h3>
              <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                {item.grade}
              </div>

              {/* Dimensions & Volume Box */}
              <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Dimensions (L×W×H):</span>
                  <span>{item.lengthM}m × {item.widthM}m × {item.heightM}m</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Volume (CBM):</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{item.volumeCbm} m³</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-400">Weight (Tons):</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{item.weightTons} Tons</span>
                </div>
              </div>

              {/* Valuation & Pit */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400 truncate max-w-[130px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" /> {item.quarryLocation}
                </span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  {formatINR(item.totalValue)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete stone block ${item.blockNumber}?`)) {
                    deleteInventoryItem(item.id);
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

      {/* Add / Edit Block Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {editingItemId ? 'Edit Rough Block Specifications' : 'Tag New Granite Rough Block'}
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
                    Block Serial Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.blockNumber}
                    onChange={(e) => setFormData({ ...formData, blockNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Granite Variety
                  </label>
                  <select
                    value={formData.graniteType}
                    onChange={(e) => setFormData({ ...formData, graniteType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option value="Absolute Black (Hosur Premium)">Absolute Black</option>
                    <option value="Black Galaxy (Chimakurthy Gold Star)">Black Galaxy</option>
                    <option value="Tan Brown (Karimnagar)">Tan Brown</option>
                    <option value="Kashmir White (Madurai Melur)">Kashmir White</option>
                    <option value="Vizag Blue (Srikakulam)">Vizag Blue</option>
                    <option value="Hassan Green">Hassan Green</option>
                    <option value="Steel Grey (Ongole)">Steel Grey</option>
                    <option value="Paradiso Multi-Color (Krishnagiri)">Paradiso</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quality Grade
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option value="A+ Export Grade">A+ Export Grade</option>
                    <option value="Commercial Grade B">Commercial Grade B</option>
                    <option value="Standard Domestic">Standard Domestic</option>
                    <option value="Quarry Waste Grit / Slag">Quarry Waste Grit / Slag</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Inventory Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option value="in_stock">In Stock (Quarry Pit)</option>
                    <option value="in_transit">In Transit (On Highway)</option>
                    <option value="delivered">Delivered (Processing Yard)</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              {/* Dimensions: Length, Width, Height -> CBM Auto */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                  Physical Dimensional Measurement (Meters)
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Length (m)</label>
                    <input
                      type="number"
                      step="0.05"
                      required
                      value={formData.lengthM}
                      onChange={(e) => setFormData({ ...formData, lengthM: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Width (m)</label>
                    <input
                      type="number"
                      step="0.05"
                      required
                      value={formData.widthM}
                      onChange={(e) => setFormData({ ...formData, widthM: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Height (m)</label>
                    <input
                      type="number"
                      step="0.05"
                      required
                      value={formData.heightM}
                      onChange={(e) => setFormData({ ...formData, heightM: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400">Calculated CBM:</span>
                    <div className="font-mono font-bold text-blue-600 dark:text-blue-400">{calculatedCbm} m³</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Est. Tonnage (2.85 T/m³):</span>
                    <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{autoWeightTons} Tons</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Weighbridge Weight (Tons)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.weightTons}
                    onChange={(e) => setFormData({ ...formData, weightTons: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Price / Ton (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerTon}
                    onChange={(e) => setFormData({ ...formData, pricePerTon: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quarry Stock Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.quarryLocation}
                  onChange={(e) => setFormData({ ...formData, quarryLocation: e.target.value })}
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
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold"
                >
                  {editingItemId ? 'Update Block Spec' : 'Save Block to Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
