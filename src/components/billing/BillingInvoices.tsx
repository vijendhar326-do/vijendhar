import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceStatus } from '../../types';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Printer,
  Download,
  Edit2,
  Trash2,
  X,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { formatINR, formatTons, formatDate } from '../../utils/formatters';

export const BillingInvoices: React.FC = () => {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, customers, trips } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    invoiceNumber: 'INV-2026-0895',
    customerId: customers[0]?.id || '',
    date: '2026-08-28',
    dueDate: '2026-09-12',
    status: 'sent' as InvoiceStatus,
    subtotal: 58000,
    gstRatePercent: 18,
    advancePaid: 15000,
    notes: 'Transport and rough block freight charges as per e-Way Bill',
    terms: 'Payment due within 15 days from delivery. 18% p.a. interest chargeable on overdue bills.',
  });

  const gstAmount = (Number(formData.subtotal || 0) * Number(formData.gstRatePercent || 0)) / 100;
  const totalAmount = Number(formData.subtotal || 0) + gstAmount;
  const balanceDue = Math.max(0, totalAmount - Number(formData.advancePaid || 0));

  const handleOpenAdd = () => {
    setEditingInvoiceId(null);
    const randomInvNum = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData({
      invoiceNumber: randomInvNum,
      customerId: customers[0]?.id || '',
      date: '2026-08-28',
      dueDate: '2026-09-12',
      status: 'sent',
      subtotal: 62000,
      gstRatePercent: 18,
      advancePaid: 20000,
      notes: 'Heavy granite rough block transportation charges from Hosur Quarry to Processing Yard',
      terms: 'Payment due within 15 days from delivery. 18% p.a. interest on overdue payments.',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (inv: Invoice) => {
    setEditingInvoiceId(inv.id);
    setFormData({
      invoiceNumber: inv.invoiceNumber,
      customerId: inv.customerId,
      date: inv.date,
      dueDate: inv.dueDate,
      status: inv.status,
      subtotal: inv.subtotal,
      gstRatePercent: inv.gstRatePercent,
      advancePaid: inv.advancePaid,
      notes: inv.notes,
      terms: inv.terms,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === formData.customerId);

    const payload = {
      invoiceNumber: formData.invoiceNumber.toUpperCase(),
      customerId: formData.customerId,
      customerName: cust ? cust.companyName : 'Customer',
      customerGstin: cust ? cust.gstin : '33AAACB9921D1ZQ',
      customerAddress: cust ? cust.address : 'Hosur Yard',
      date: formData.date,
      dueDate: formData.dueDate,
      status: formData.status,
      items: [
        {
          id: 'item-1',
          description: 'Granite Stone Freight & Monolith Transportation',
          quantityTons: 25.5,
          ratePerTon: 2431.37,
          amount: Number(formData.subtotal),
        },
      ],
      subtotal: Number(formData.subtotal),
      gstRatePercent: Number(formData.gstRatePercent),
      gstAmount,
      totalAmount,
      advancePaid: Number(formData.advancePaid),
      balanceDue,
      notes: formData.notes,
      terms: formData.terms,
    };

    if (editingInvoiceId) {
      updateInvoice(editingInvoiceId, payload);
    } else {
      addInvoice(payload);
    }
    setIsModalOpen(false);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerGstin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'All' || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalInvoicedValue = filteredInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalBalanceDue = filteredInvoices.reduce((acc, inv) => acc + inv.balanceDue, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Tax Invoicing & GST Freight Billing
            </h1>
            <p className="text-xs text-slate-500">
              Generate compliant GST tax invoices (CGST/SGST/IGST), track advance settlements and balance dues
            </p>
          </div>
        </div>

        <button
          id="btn-generate-new-invoice"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Tax Invoice
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Invoices Raised</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{filteredInvoices.length} Bills</div>
          <div className="text-[11px] text-slate-500 mt-0.5">GST Compliant E-Invoicing</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Invoiced Amount</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{formatINR(totalInvoicedValue)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Includes 18% GST component</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Outstanding Due</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{formatINR(totalBalanceDue)}</div>
          <div className="text-[11px] text-rose-500 font-semibold mt-0.5">Unsettled receivables</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Settled Invoices</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {filteredInvoices.filter((i) => i.status === 'paid').length} Paid in Full
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Bank transfer & UPI</div>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice number, buyer, GSTIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Invoices</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer & GSTIN</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Taxable</th>
                <th className="py-3 px-4 text-right">GST</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-black text-blue-600 dark:text-blue-400">
                    {inv.invoiceNumber}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 dark:text-slate-100">{inv.customerName}</div>
                    <div className="font-mono text-[10px] text-slate-400">{inv.customerGstin}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">{formatDate(inv.date)}</td>
                  <td className="py-3.5 px-4 text-slate-500">{formatDate(inv.dueDate)}</td>

                  <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                    {formatINR(inv.subtotal)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                    {formatINR(inv.gstAmount)} ({inv.gstRatePercent}%)
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 dark:text-slate-100">
                    {formatINR(inv.totalAmount)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-black text-rose-600 dark:text-rose-400">
                    {formatINR(inv.balanceDue)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : inv.status === 'partial'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : inv.status === 'overdue'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setPreviewInvoice(inv)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600"
                        title="Print / View Invoice"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(inv)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete invoice ${inv.invoiceNumber}?`)) {
                            deleteInvoice(inv.id);
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

      {/* Print-Ready Invoice Modal Preview */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 text-slate-900 border border-slate-200 space-y-6">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-900 text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">GraniteTrack Pro Logistics</h2>
                    <div className="text-xs text-slate-500 font-medium">Granite Stone Fleet & Heavy Freight Carrier</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-3 space-y-0.5">
                  <div>Plot 42, SIPCOT Heavy Industrial Estate, Phase 2, Hosur - 635126</div>
                  <div>GSTIN: <span className="font-mono font-bold text-slate-800">33AAACG9921E1ZQ</span> | State Code: 33 (TN)</div>
                  <div>Phone: +91 98421 88990 | Email: billing@granitetrackpro.in</div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Tax Invoice
                </span>
                <div className="font-mono font-black text-xl text-slate-900 mt-2">{previewInvoice.invoiceNumber}</div>
                <div className="text-xs text-slate-500 mt-1">Date: {formatDate(previewInvoice.date)}</div>
                <div className="text-xs text-slate-500">Due: {formatDate(previewInvoice.dueDate)}</div>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Billed To (Consignee):</div>
                <div className="font-extrabold text-sm text-slate-900 mt-0.5">{previewInvoice.customerName}</div>
                <div className="text-slate-600 mt-1">{previewInvoice.customerAddress}</div>
                <div className="font-mono text-slate-700 mt-1">GSTIN: <strong>{previewInvoice.customerGstin}</strong></div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Payment Status:</div>
                <div className="font-bold text-sm text-emerald-600 mt-0.5 uppercase tracking-wide">
                  {previewInvoice.status}
                </div>
                <div className="text-slate-500 mt-1">Bank: HDFC Bank Hosur Industrial Branch</div>
                <div className="font-mono text-slate-700">A/C: 50200049281920 • IFSC: HDFC0001892</div>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-right">Quantity (Tons)</th>
                  <th className="py-2 text-right">Rate / Ton</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {previewInvoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 font-semibold text-slate-800">{item.description}</td>
                    <td className="py-3 text-right font-mono">{item.quantityTons} Tons</td>
                    <td className="py-3 text-right font-mono">₹{item.ratePerTon.toFixed(2)}</td>
                    <td className="py-3 text-right font-mono font-bold">{formatINR(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Financial Summary */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <div className="w-72 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Taxable Subtotal:</span>
                  <span className="font-mono font-bold">{formatINR(previewInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST ({previewInvoice.gstRatePercent}%):</span>
                  <span className="font-mono font-bold">{formatINR(previewInvoice.gstAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                  <span>Total Invoice Value:</span>
                  <span className="font-mono">{formatINR(previewInvoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Advance Paid:</span>
                  <span className="font-mono">−{formatINR(previewInvoice.advancePaid)}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-black text-sm pt-1 border-t border-slate-200">
                  <span>Balance Due:</span>
                  <span className="font-mono">{formatINR(previewInvoice.balanceDue)}</span>
                </div>
              </div>
            </div>

            {/* Footer & Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                onClick={() => setPreviewInvoice(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              >
                Close Preview
              </button>

              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {editingInvoiceId ? 'Edit Tax Invoice' : 'Create Tax Invoice'}
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
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Invoice Date
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
                    Payment Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Taxable Subtotal & GST Rate */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Taxable Subtotal (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.subtotal}
                      onChange={(e) => setFormData({ ...formData, subtotal: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      GST Rate (%)
                    </label>
                    <select
                      value={formData.gstRatePercent}
                      onChange={(e) => setFormData({ ...formData, gstRatePercent: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    >
                      <option value="0">0% (Exempt / SEZ)</option>
                      <option value="5">5% (GTA RCM)</option>
                      <option value="12">12% (Standard Slabs)</option>
                      <option value="18">18% (Standard Freight + Stone)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200/60 dark:border-blue-800/60 text-[11px]">
                  <div>
                    <span className="text-slate-400">GST:</span>
                    <div className="font-mono font-bold text-slate-700 dark:text-slate-300">{formatINR(gstAmount)}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Total:</span>
                    <div className="font-mono font-black text-blue-600 dark:text-blue-400">{formatINR(totalAmount)}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Balance:</span>
                    <div className="font-mono font-black text-rose-600 dark:text-rose-400">{formatINR(balanceDue)}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Advance Paid (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.advancePaid}
                    onChange={(e) => setFormData({ ...formData, advancePaid: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Invoice Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid in Full</option>
                    <option value="partial">Partial Payment</option>
                    <option value="overdue">Overdue</option>
                  </select>
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
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  {editingInvoiceId ? 'Update Invoice' : 'Save Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
