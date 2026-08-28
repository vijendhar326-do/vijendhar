import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord, PaymentMethod } from '../../types';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Building2,
  Edit2,
  Trash2,
  X,
  FileCheck,
  DollarSign,
  ArrowDownLeft,
} from 'lucide-react';
import { formatINR, formatDate } from '../../utils/formatters';

export const PaymentSettlements: React.FC = () => {
  const { payments, addPayment, updatePayment, deletePayment, customers, invoices } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    invoiceId: invoices[0]?.id || '',
    invoiceNumber: invoices[0]?.invoiceNumber || 'INV-2026-0891',
    amount: 25000,
    paymentDate: '2026-08-28',
    paymentMode: 'Bank Transfer' as PaymentMethod,
    referenceNumber: 'HDFC-RTGS-98214',
    notes: 'Received via RTGS settlement against quarry shipment invoice',
  });

  const handleOpenAdd = () => {
    setEditingPaymentId(null);
    setFormData({
      customerId: customers[0]?.id || '',
      invoiceId: invoices[0]?.id || '',
      invoiceNumber: invoices[0]?.invoiceNumber || 'INV-2026-0891',
      amount: 30000,
      paymentDate: '2026-08-28',
      paymentMode: 'Bank Transfer',
      referenceNumber: `UTR-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: 'Direct NEFT/RTGS bank credit received into HDFC Current Account',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pmt: PaymentRecord) => {
    setEditingPaymentId(pmt.id);
    setFormData({
      customerId: pmt.customerId,
      invoiceId: pmt.invoiceId || '',
      invoiceNumber: pmt.invoiceNumber || '',
      amount: pmt.amount,
      paymentDate: pmt.paymentDate,
      paymentMode: pmt.paymentMode,
      referenceNumber: pmt.referenceNumber || '',
      notes: pmt.notes,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === formData.customerId);

    const payload = {
      customerId: formData.customerId,
      customerName: cust ? cust.companyName : 'Customer',
      invoiceId: formData.invoiceId || undefined,
      invoiceNumber: formData.invoiceNumber || undefined,
      amount: Number(formData.amount),
      paymentDate: formData.paymentDate,
      paymentMode: formData.paymentMode,
      referenceNumber: formData.referenceNumber,
      notes: formData.notes,
    };

    if (editingPaymentId) {
      updatePayment(editingPaymentId, payload);
    } else {
      addPayment(payload);
    }
    setIsModalOpen(false);
  };

  const filteredPayments = payments.filter((pmt) => {
    const matchSearch =
      pmt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pmt.invoiceNumber && pmt.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pmt.referenceNumber && pmt.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchMode = filterMode === 'All' || pmt.paymentMode === filterMode;
    return matchSearch && matchMode;
  });

  const totalCollected = filteredPayments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Payment Receipts & Bank Settlements
            </h1>
            <p className="text-xs text-slate-500">
              Log bank transfers (RTGS/NEFT), UPI, Fastag auto-debits, and customer account reconciliations
            </p>
          </div>
        </div>

        <button
          id="btn-record-payment"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Record Payment Receipt
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Settled Receipts</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{filteredPayments.length} Transactions</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Verified bank credits</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Collections Value</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{formatINR(totalCollected)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Liquid cashflow realized</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">RTGS / NEFT Settlements</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {formatINR(filteredPayments.filter((p) => p.paymentMode === 'Bank Transfer').reduce((acc, p) => acc + p.amount, 0))}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Direct wire settlements</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">UPI & Quick Cash</div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {formatINR(filteredPayments.filter((p) => p.paymentMode === 'UPI' || p.paymentMode === 'Cash').reduce((acc, p) => acc + p.amount, 0))}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Instant quarry pit settlements</div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer, UTR reference, invoice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Channels</option>
              <option value="Bank Transfer">Bank Transfer (RTGS / NEFT)</option>
              <option value="UPI">UPI / Net Banking</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Date & UTR Ref</th>
                <th className="py-3 px-4">Buyer (Customer)</th>
                <th className="py-3 px-4">Against Invoice</th>
                <th className="py-3 px-4">Payment Channel</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Amount Received</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {filteredPayments.map((pmt) => (
                <tr key={pmt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{formatDate(pmt.paymentDate)}</div>
                    <div className="font-mono text-[10px] text-slate-400">{pmt.referenceNumber || 'CASH-REC'}</div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {pmt.customerName}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-blue-600 dark:text-blue-400">
                    {pmt.invoiceNumber || 'On Account'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {pmt.paymentMode}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                    {pmt.notes}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    +{formatINR(pmt.amount)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(pmt)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete payment record?')) {
                            deletePayment(pmt.id);
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {editingPaymentId ? 'Edit Payment Record' : 'Record Received Payment'}
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
                    Customer (Buyer)
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount Received (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Channel
                  </label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option value="Bank Transfer">Bank Transfer (RTGS / NEFT)</option>
                    <option value="UPI">UPI / GPay</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bank Reference / UTR Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                  placeholder="e.g. UTR-HDFC-992140"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Remarks / Deposit Account Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {editingPaymentId ? 'Update Record' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
