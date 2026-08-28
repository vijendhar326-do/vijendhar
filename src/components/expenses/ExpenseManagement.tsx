import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Expense, ExpenseCategory } from '../../types';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  X,
  CreditCard,
  Building2,
  Tag,
  DollarSign,
  TrendingDown,
} from 'lucide-react';
import { formatINR, formatDate } from '../../utils/formatters';

export const ExpenseManagement: React.FC = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, trucks, drivers } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterTruck, setFilterTruck] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: '2026-08-28',
    category: 'Toll (Fastag)' as ExpenseCategory,
    amount: 1550,
    truckId: trucks[0]?.id || '',
    driverId: drivers[0]?.id || '',
    paymentMode: 'Fastag' as const,
    receiptNumber: 'FASTAG-NH44-9921',
    description: 'NH44 Krishnagiri & Thoppur Toll Plaza return crossing for 28T tipper',
  });

  const handleOpenAdd = () => {
    setEditingExpenseId(null);
    setFormData({
      date: '2026-08-28',
      category: 'Toll (Fastag)',
      amount: 1200,
      truckId: trucks[0]?.id || '',
      driverId: drivers[0]?.id || '',
      paymentMode: 'Fastag',
      receiptNumber: `RCPT-${Math.floor(10000 + Math.random() * 90000)}`,
      description: 'Highway toll & quarry pit entry fee',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Expense) => {
    setEditingExpenseId(exp.id);
    setFormData({
      date: exp.date,
      category: exp.category,
      amount: exp.amount,
      truckId: exp.truckId || '',
      driverId: exp.driverId || '',
      paymentMode: exp.paymentMode,
      receiptNumber: exp.receiptNumber || '',
      description: exp.description,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedTrk = trucks.find((t) => t.id === formData.truckId);
    const assignedDrv = drivers.find((d) => d.id === formData.driverId);

    const payload = {
      date: formData.date,
      category: formData.category,
      amount: Number(formData.amount),
      truckId: formData.truckId || undefined,
      truckNumber: assignedTrk ? assignedTrk.registrationNumber : undefined,
      driverId: formData.driverId || undefined,
      driverName: assignedDrv ? assignedDrv.name : undefined,
      paymentMode: formData.paymentMode,
      receiptNumber: formData.receiptNumber,
      description: formData.description,
    };

    if (editingExpenseId) {
      updateExpense(editingExpenseId, payload);
    } else {
      addExpense(payload);
    }
    setIsModalOpen(false);
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchSearch =
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.truckNumber && exp.truckNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (exp.driverName && exp.driverName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (exp.receiptNumber && exp.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = filterCategory === 'All' || exp.category === filterCategory;
    const matchTruck = filterTruck === 'All' || exp.truckId === filterTruck;
    return matchSearch && matchCat && matchTruck;
  });

  const totalFilteredExpense = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  // Category breakdown
  const categoryTotals: { [key: string]: number } = {};
  filteredExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Fleet Expense & Cost Tracking
            </h1>
            <p className="text-xs text-slate-500">
              Comprehensive ledger of diesel, Fastag highway tolls, maintenance, tyres, driver allowances, and permits
            </p>
          </div>
        </div>

        <button
          id="btn-add-new-expense"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Expense Entry
        </button>
      </div>

      {/* Expense Categories Breakdown Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {Object.entries(categoryTotals).map(([cat, amt]) => (
          <div
            key={cat}
            onClick={() => setFilterCategory(cat === filterCategory ? 'All' : cat)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">{cat}</div>
            <div className="text-base font-black text-rose-600 dark:text-rose-400 mt-1">{formatINR(amt)}</div>
          </div>
        ))}
      </div>

      {/* Expense Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search description, receipt, truck, driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Categories</option>
              <option value="Fuel">Fuel</option>
              <option value="Toll (Fastag)">Toll (Fastag)</option>
              <option value="Driver Salary / Batta">Driver Salary / Batta</option>
              <option value="Truck Repair">Truck Repair</option>
              <option value="Tyre Replacement">Tyre Replacement</option>
              <option value="Police / RTO / Permit">Police / RTO / Permit</option>
              <option value="Office Expense">Office Expense</option>
              <option value="Quarry Tax">Quarry Tax</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>

            <select
              value={filterTruck}
              onChange={(e) => setFilterTruck(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200"
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
                <th className="py-3 px-4">Date & Receipt</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Vehicle / Driver</th>
                <th className="py-3 px-4 text-center">Payment Mode</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{formatDate(exp.date)}</div>
                    <div className="font-mono text-[10px] text-slate-400">{exp.receiptNumber || 'N/A'}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                      {exp.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-xs">
                    {exp.description}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {exp.truckNumber || 'Company General'}
                    </div>
                    {exp.driverName && <div className="text-[11px] text-slate-400">{exp.driverName}</div>}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {exp.paymentMode}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-rose-600 dark:text-rose-400 font-mono text-sm">
                    {formatINR(exp.amount)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(exp)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete expense record?')) {
                            deleteExpense(exp.id);
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

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {editingExpenseId ? 'Edit Fleet Expense Entry' : 'Log New Fleet Expense'}
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
                    Expense Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option value="Fuel">Fuel</option>
                    <option value="Toll (Fastag)">Toll (Fastag)</option>
                    <option value="Driver Salary / Batta">Driver Salary / Batta</option>
                    <option value="Truck Repair">Truck Repair</option>
                    <option value="Tyre Replacement">Tyre Replacement</option>
                    <option value="Police / RTO / Permit">Police / RTO / Permit</option>
                    <option value="Office Expense">Office Expense</option>
                    <option value="Quarry Tax">Quarry Tax</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-rose-600"
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
                    <option value="Fastag">Fastag Wallet</option>
                    <option value="UPI">UPI / GPay</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                    <option value="Company Card">Company Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Truck (If Applicable)
                  </label>
                  <select
                    value={formData.truckId}
                    onChange={(e) => setFormData({ ...formData, truckId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  >
                    <option value="">Company General</option>
                    {trucks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.registrationNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Driver (If Applicable)
                  </label>
                  <select
                    value={formData.driverId}
                    onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="">None</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bill / Voucher / Receipt Number
                </label>
                <input
                  type="text"
                  value={formData.receiptNumber}
                  onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                  placeholder="e.g. FASTAG-TX-10928"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expense Description & Notes
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed breakdown of the expenditure..."
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
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  {editingExpenseId ? 'Update Expense' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
