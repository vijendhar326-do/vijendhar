import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, CustomerStatus } from '../../types';
import {
  Users,
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { formatINR, formatTons } from '../../utils/formatters';

export const CustomerManagement: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, trips, invoices } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [viewingStatementCustomer, setViewingStatementCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '+91 98400 ',
    email: '',
    gstin: '33AAACB9921D1ZQ',
    address: 'SIPCOT Industrial Park, Hosur, Tamil Nadu',
    status: 'active' as CustomerStatus,
    creditLimit: 500000,
  });

  const handleOpenAdd = () => {
    setEditingCustomerId(null);
    setFormData({
      companyName: '',
      contactPerson: '',
      phone: '+91 98400 12345',
      email: 'logistics@granitecorp.in',
      gstin: '33AAACB9921D1ZQ',
      address: 'SIPCOT Industrial Park, Phase II, Hosur - 635126',
      status: 'active',
      creditLimit: 500000,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomerId(customer.id);
    setFormData({
      companyName: customer.companyName,
      contactPerson: customer.contactPerson,
      phone: customer.phone,
      email: customer.email,
      gstin: customer.gstin,
      address: customer.address,
      status: customer.status,
      creditLimit: customer.creditLimit,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      gstin: formData.gstin.toUpperCase(),
      address: formData.address,
      status: formData.status,
      creditLimit: Number(formData.creditLimit),
      totalTonsOrdered: editingCustomerId ? (customers.find(c => c.id === editingCustomerId)?.totalTonsOrdered || 0) : 0,
      totalInvoiced: editingCustomerId ? (customers.find(c => c.id === editingCustomerId)?.totalInvoiced || 0) : 0,
      totalPaid: editingCustomerId ? (customers.find(c => c.id === editingCustomerId)?.totalPaid || 0) : 0,
      balanceDue: editingCustomerId ? (customers.find(c => c.id === editingCustomerId)?.balanceDue || 0) : 0,
    };

    if (editingCustomerId) {
      updateCustomer(editingCustomerId, payload);
    } else {
      addCustomer(payload);
    }
    setIsModalOpen(false);
  };

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalOutstanding = customers.reduce((acc, c) => acc + c.balanceDue, 0);
  const totalVolumeHauled = customers.reduce((acc, c) => acc + c.totalTonsOrdered, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Customer Directory & Account Receivables
            </h1>
            <p className="text-xs text-slate-500">
              Manage granite buyers, processing yards, export houses, GSTINs, credit limits, and aging balances
            </p>
          </div>
        </div>

        <button
          id="btn-add-new-customer"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Buyer / Client
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Active Accounts</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{customers.length} Companies</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Export & domestic buyers</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Receivables (Due)</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{formatINR(totalOutstanding)}</div>
          <div className="text-[11px] text-rose-500 font-semibold mt-0.5">Across {customers.filter(c => c.balanceDue > 0).length} overdue accounts</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Volume Hauled</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{formatTons(totalVolumeHauled)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Rough & Gangsaw slabs</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Collections</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatINR(customers.reduce((acc, c) => acc + c.totalPaid, 0))}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Verified bank settlements</div>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {customer.companyName}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-medium">{customer.contactPerson}</div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    customer.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : customer.status === 'credit_locked'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {customer.status.replace('_', ' ')}
                </span>
              </div>

              {/* GSTIN & Contact */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">GSTIN:</span>
                  <span className="font-mono font-bold">{customer.gstin}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-mono">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{customer.address}</span>
                </div>
              </div>

              {/* Invoiced vs Paid vs Due */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-center">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">Invoiced</div>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {formatINR(customer.totalInvoiced)}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">Paid</div>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatINR(customer.totalPaid)}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                  <div className="text-[10px] text-rose-500 font-bold">Balance Due</div>
                  <div className="font-mono font-black text-rose-600 dark:text-rose-400 mt-0.5">
                    {formatINR(customer.balanceDue)}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setViewingStatementCustomer(customer)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Statement <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(customer)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete client ${customer.companyName}?`)) {
                      deleteCustomer(customer.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Account Statement Drawer / Modal */}
      {viewingStatementCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Account Statement</span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {viewingStatementCustomer.companyName}
                </h3>
              </div>
              <button
                onClick={() => setViewingStatementCustomer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <div className="text-slate-400">Total Billed</div>
                <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                  {formatINR(viewingStatementCustomer.totalInvoiced)}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">Total Received</div>
                <div className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {formatINR(viewingStatementCustomer.totalPaid)}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <div className="text-rose-600 dark:text-rose-400 font-bold">Outstanding Balance</div>
                <div className="font-mono font-bold text-sm text-rose-600 dark:text-rose-400 mt-0.5">
                  {formatINR(viewingStatementCustomer.balanceDue)}
                </div>
              </div>
            </div>

            {/* Trip Activity History */}
            <div>
              <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-2">
                Recent Stone Transfers & Freight Shipments
              </h4>
              <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Trip ID</th>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Stone Type</th>
                      <th className="p-2.5 text-right">Tons</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {trips
                      .filter((t) => t.customerId === viewingStatementCustomer.id)
                      .map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 font-mono text-blue-600 dark:text-blue-400 font-bold">{t.tripId}</td>
                          <td className="p-2.5 text-slate-500">{t.date}</td>
                          <td className="p-2.5">{t.graniteType}</td>
                          <td className="p-2.5 text-right font-bold">{t.totalTons} T</td>
                          <td className="p-2.5 text-right font-mono font-bold text-slate-900 dark:text-slate-100">{formatINR(t.totalAmount)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewingStatementCustomer(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {editingCustomerId ? 'Edit Customer Account' : 'Register New Buyer / Client'}
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
                  Company / Yard Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Royal Marbles & Granites India Pvt Ltd"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option value="active">Active (Good Standing)</option>
                    <option value="credit_locked">Credit Locked (Overdue)</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Credit Limit (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery / Polishing Yard Address
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  {editingCustomerId ? 'Update Customer' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
