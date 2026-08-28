import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Building2,
  Download,
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import { formatINR, formatDate } from '../../utils/formatters';

export const DailyAccounts: React.FC = () => {
  const { trips, todayStats, customers, setActiveTab } = useApp();

  const [filterDate, setFilterDate] = useState('2026-08-28');
  const [filterMethod, setFilterMethod] = useState('All');

  // Daily aggregate
  const filteredTrips = trips.filter((t) => {
    const matchDate = filterDate === 'All' || t.date === filterDate;
    const matchMethod = filterMethod === 'All' || t.paymentMethod === filterMethod;
    return matchDate && matchMethod;
  });

  const dailyGrossIncome = filteredTrips.reduce((acc, t) => acc + (t.totalAmount || 0), 0);
  const dailyPaidRealized = filteredTrips.reduce((acc, t) => acc + (t.paidAmount || 0), 0);
  const dailyPendingBalance = filteredTrips.reduce((acc, t) => acc + (t.balanceAmount || 0), 0);

  // Income by customer
  const customerIncomeMap: { [key: string]: { name: string; billed: number; collected: number; balance: number; count: number } } = {};
  filteredTrips.forEach((t) => {
    if (!customerIncomeMap[t.customerId]) {
      customerIncomeMap[t.customerId] = {
        name: t.customerName,
        billed: 0,
        collected: 0,
        balance: 0,
        count: 0,
      };
    }
    customerIncomeMap[t.customerId].billed += t.totalAmount;
    customerIncomeMap[t.customerId].collected += t.paidAmount;
    customerIncomeMap[t.customerId].balance += t.balanceAmount;
    customerIncomeMap[t.customerId].count += 1;
  });

  // Income by payment method
  const paymentMethodSummary = {
    'NEFT/RTGS': filteredTrips.filter((t) => t.paymentMethod === 'NEFT/RTGS').reduce((acc, t) => acc + t.paidAmount, 0),
    UPI: filteredTrips.filter((t) => t.paymentMethod === 'UPI').reduce((acc, t) => acc + t.paidAmount, 0),
    Cheque: filteredTrips.filter((t) => t.paymentMethod === 'Cheque').reduce((acc, t) => acc + t.paidAmount, 0),
    Cash: filteredTrips.filter((t) => t.paymentMethod === 'Cash').reduce((acc, t) => acc + t.paidAmount, 0),
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Daily Accounts & Revenue Ledger
            </h1>
            <p className="text-xs text-slate-500">
              Comprehensive cash inflows, banking clearances, and outstanding customer balances
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-700 dark:text-slate-200 font-semibold"
            >
              <option value="2026-08-28">Today (28-Aug-2026)</option>
              <option value="2026-08-27">Yesterday (27-Aug-2026)</option>
              <option value="All">All Historical Dates</option>
            </select>
          </div>

          <button
            onClick={() => setActiveTab('billing')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
          >
            Create Tax Invoice
          </button>
        </div>
      </div>

      {/* 3 Main Big Cards: Daily Income, Expenses, Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Daily Income */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Daily Income</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {formatINR(dailyGrossIncome)}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Collected: <span className="font-bold text-slate-800 dark:text-slate-200">{formatINR(dailyPaidRealized)}</span>
          </div>
        </div>

        {/* Daily Expenses */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Daily Fleet Expenses</span>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
            {formatINR(todayStats.totalExpenses)}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Fuel ({formatINR(todayStats.fuelCost)}) + Fastag Toll + Maintenance
          </div>
        </div>

        {/* Daily Balance / Receivables */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Outstanding Receivables</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {formatINR(dailyPendingBalance)}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Pending from {Object.values(customerIncomeMap).filter((c) => c.balance > 0).length} client accounts
          </div>
        </div>
      </div>

      {/* Payment Channels Strip */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          Collections by Payment Instrument
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">NEFT / RTGS (Bank)</div>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {formatINR(paymentMethodSummary['NEFT/RTGS'])}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Corporate client transfers</div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
            <div className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase">UPI Quick Pay</div>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {formatINR(paymentMethodSummary['UPI'])}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Direct driver/quarry QR</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <div className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase">Bank Cheque / DD</div>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {formatINR(paymentMethodSummary['Cheque'])}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">7-day clearing terms</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase">Cash Settlement</div>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {formatINR(paymentMethodSummary['Cash'])}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">On-site quarry weighbridge</div>
          </div>
        </div>
      </div>

      {/* Customer-wise Income Ledger Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              Customer-wise Billing & Outstanding Balances
            </h3>
            <p className="text-xs text-slate-500">Real-time ledger summary for active stone importers & polishing plants</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Customer Company</th>
                <th className="pb-3 text-center">Trips Hauled</th>
                <th className="pb-3 text-right">Total Invoiced</th>
                <th className="pb-3 text-right">Paid Amount</th>
                <th className="pb-3 text-right">Balance Due</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {Object.entries(customerIncomeMap).map(([custId, custData]) => (
                <tr key={custId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 font-bold text-slate-900 dark:text-slate-100">
                    {custData.name}
                  </td>
                  <td className="py-3.5 text-center font-mono text-slate-600 dark:text-slate-300">
                    {custData.count}
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                    {formatINR(custData.billed)}
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(custData.collected)}
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                    {formatINR(custData.balance)}
                  </td>
                  <td className="py-3.5 text-center">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        custData.balance === 0
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : custData.collected > 0
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {custData.balance === 0 ? 'Settled' : 'Payment Due'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
