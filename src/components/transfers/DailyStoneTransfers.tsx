import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StoneTransferTrip, PaymentStatus } from '../../types';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Edit2,
  Trash2,
  CheckCircle2,
  Calculator,
  Truck,
  User,
  Calendar,
  X,
  FileSpreadsheet,
  Building2,
  DollarSign,
} from 'lucide-react';
import { formatINR, formatTons, formatDate } from '../../utils/formatters';

export const DailyStoneTransfers: React.FC = () => {
  const {
    trips,
    addTrip,
    updateTrip,
    deleteTrip,
    trucks,
    drivers,
    customers,
    graniteStock,
  } = useApp();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-08-28');
  const [filterCustomer, setFilterCustomer] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [printTripSheetData, setPrintTripSheetData] = useState<StoneTransferTrip | null>(null);

  // Form State with Live Automatic Calculations
  const [formData, setFormData] = useState({
    date: '2026-08-28',
    customerId: customers[0]?.id || '',
    customerName: customers[0]?.companyName || '',
    customerPhone: customers[0]?.phone || '',
    graniteType: 'Black Galaxy',
    sourceQuarry: 'Chimakurthy Galaxy Pit 1',
    destination: 'Hosur Polishing SEZ Unit 2',
    truckId: trucks[0]?.id || '',
    truckNumber: trucks[0]?.registrationNumber || '',
    driverId: drivers[0]?.id || '',
    driverName: drivers[0]?.name || '',
    numberOfTrips: 1,
    tonsPerTrip: 24.5,
    ratePerTon: 1800,
    loadingCharge: 2500,
    unloadingCharge: 2500,
    transportCharge: 8500,
    otherCharge: 500,
    paidAmount: 58100,
    paymentStatus: 'Paid' as PaymentStatus,
    paymentMethod: 'NEFT/RTGS' as any,
    deliveryStatus: 'In Transit' as any,
    remarks: 'Premium gangsaw size rough blocks dispatch.',
  });

  // Automatic live calculated fields
  const totalTons = Number(formData.numberOfTrips || 0) * Number(formData.tonsPerTrip || 0);
  const stoneAmount = totalTons * Number(formData.ratePerTon || 0);
  const totalAmount =
    stoneAmount +
    Number(formData.loadingCharge || 0) +
    Number(formData.unloadingCharge || 0) +
    Number(formData.transportCharge || 0) +
    Number(formData.otherCharge || 0);
  const balanceAmount = Math.max(0, totalAmount - Number(formData.paidAmount || 0));

  const handleOpenAddModal = () => {
    setEditingTripId(null);
    setFormData({
      date: '2026-08-28',
      customerId: customers[0]?.id || '',
      customerName: customers[0]?.companyName || '',
      customerPhone: customers[0]?.phone || '',
      graniteType: 'Black Galaxy',
      sourceQuarry: 'Chimakurthy Galaxy Pit 1',
      destination: 'Hosur Polishing SEZ Unit 2',
      truckId: trucks[0]?.id || '',
      truckNumber: trucks[0]?.registrationNumber || '',
      driverId: drivers[0]?.id || '',
      driverName: drivers[0]?.name || '',
      numberOfTrips: 1,
      tonsPerTrip: 25.0,
      ratePerTon: 1800,
      loadingCharge: 2500,
      unloadingCharge: 2500,
      transportCharge: 8500,
      otherCharge: 500,
      paidAmount: 59000,
      paymentStatus: 'Paid',
      paymentMethod: 'NEFT/RTGS',
      deliveryStatus: 'In Transit',
      remarks: 'Fresh quarry dispatch docket.',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (trip: StoneTransferTrip) => {
    setEditingTripId(trip.id);
    setFormData({
      date: trip.date,
      customerId: trip.customerId,
      customerName: trip.customerName,
      customerPhone: trip.customerPhone || '',
      graniteType: trip.graniteType,
      sourceQuarry: trip.sourceQuarry,
      destination: trip.destination,
      truckId: trip.truckId,
      truckNumber: trip.truckNumber,
      driverId: trip.driverId,
      driverName: trip.driverName,
      numberOfTrips: trip.numberOfTrips,
      tonsPerTrip: trip.tonsPerTrip,
      ratePerTon: trip.ratePerTon,
      loadingCharge: trip.loadingCharge,
      unloadingCharge: trip.unloadingCharge,
      transportCharge: trip.transportCharge,
      otherCharge: trip.otherCharge,
      paidAmount: trip.paidAmount,
      paymentStatus: trip.paymentStatus,
      paymentMethod: trip.paymentMethod || 'NEFT/RTGS',
      deliveryStatus: trip.deliveryStatus,
      remarks: trip.remarks || '',
    });
    setIsFormModalOpen(true);
  };

  const handleCustomerChange = (custId: string) => {
    const cust = customers.find((c) => c.id === custId);
    if (cust) {
      setFormData((prev) => ({
        ...prev,
        customerId: cust.id,
        customerName: cust.companyName,
        customerPhone: cust.phone,
      }));
    }
  };

  const handleTruckChange = (truckId: string) => {
    const trk = trucks.find((t) => t.id === truckId);
    if (trk) {
      setFormData((prev) => ({
        ...prev,
        truckId: trk.id,
        truckNumber: trk.registrationNumber,
        driverId: trk.driverId || prev.driverId,
        driverName: trk.driverName || prev.driverName,
        tonsPerTrip: trk.capacityTons || prev.tonsPerTrip,
      }));
    }
  };

  const handleDriverChange = (driverId: string) => {
    const drv = drivers.find((d) => d.id === driverId);
    if (drv) {
      setFormData((prev) => ({
        ...prev,
        driverId: drv.id,
        driverName: drv.name,
      }));
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    let autoPaymentStatus: PaymentStatus = 'Pending';
    if (formData.paidAmount >= totalAmount) {
      autoPaymentStatus = 'Paid';
    } else if (formData.paidAmount > 0) {
      autoPaymentStatus = 'Partial';
    }

    const payload = {
      date: formData.date,
      customerId: formData.customerId,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      graniteType: formData.graniteType,
      sourceQuarry: formData.sourceQuarry,
      destination: formData.destination,
      truckId: formData.truckId,
      truckNumber: formData.truckNumber,
      driverId: formData.driverId,
      driverName: formData.driverName,
      numberOfTrips: Number(formData.numberOfTrips),
      tonsPerTrip: Number(formData.tonsPerTrip),
      totalTons,
      ratePerTon: Number(formData.ratePerTon),
      stoneAmount,
      loadingCharge: Number(formData.loadingCharge),
      unloadingCharge: Number(formData.unloadingCharge),
      transportCharge: Number(formData.transportCharge),
      otherCharge: Number(formData.otherCharge),
      totalAmount,
      paidAmount: Number(formData.paidAmount),
      balanceAmount,
      paymentStatus: autoPaymentStatus,
      paymentMethod: formData.paymentMethod,
      deliveryStatus: formData.deliveryStatus,
      remarks: formData.remarks,
    };

    if (editingTripId) {
      updateTrip(editingTripId, payload);
    } else {
      addTrip(payload);
    }

    setIsFormModalOpen(false);
  };

  // Filtered trips
  const filteredTrips = trips.filter((trip) => {
    const matchSearch =
      trip.tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.graniteType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.truckNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDate = selectedDate === 'All' || trip.date === selectedDate;
    const matchCustomer = filterCustomer === 'All' || trip.customerId === filterCustomer;
    const matchStatus = filterStatus === 'All' || trip.deliveryStatus === filterStatus;

    return matchSearch && matchDate && matchCustomer && matchStatus;
  });

  // Calculate filtered totals
  const totalFilteredTons = filteredTrips.reduce((acc, t) => acc + (t.totalTons || 0), 0);
  const totalFilteredRevenue = filteredTrips.reduce((acc, t) => acc + (t.totalAmount || 0), 0);
  const totalFilteredPaid = filteredTrips.reduce((acc, t) => acc + (t.paidAmount || 0), 0);
  const totalFilteredBalance = filteredTrips.reduce((acc, t) => acc + (t.balanceAmount || 0), 0);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Trip ID,Date,Customer,Granite Type,Source Quarry,Destination,Truck Number,Driver Name,Trips,Tons/Trip,Total Tons,Rate/Ton,Stone Amount,Loading,Unloading,Transport,Other,Total Amount,Paid Amount,Balance,Payment Status,Delivery Status',
    ];
    const rows = filteredTrips.map((t) =>
      [
        t.tripId,
        t.date,
        `"${t.customerName}"`,
        `"${t.graniteType}"`,
        `"${t.sourceQuarry}"`,
        `"${t.destination}"`,
        t.truckNumber,
        `"${t.driverName}"`,
        t.numberOfTrips,
        t.tonsPerTrip,
        t.totalTons,
        t.ratePerTon,
        t.stoneAmount,
        t.loadingCharge,
        t.unloadingCharge,
        t.transportCharge,
        t.otherCharge,
        t.totalAmount,
        t.paidAmount,
        t.balanceAmount,
        t.paymentStatus,
        t.deliveryStatus,
      ].join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GraniteTrack_Stone_Transfers_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Daily Stone Transfer & Dispatch Management
              </h1>
              <p className="text-xs text-slate-500">
                Primary operational dispatch log with real-time automatic pricing and tonnage calculation
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="btn-export-transfers-csv"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-300 dark:border-slate-700"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            id="btn-new-stone-transfer"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            New Stone Transfer
          </button>
        </div>
      </div>

      {/* Metric Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Filtered Stone Tons</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {formatTons(totalFilteredTons)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{filteredTrips.length} quarry dispatches</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Invoice Value</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {formatINR(totalFilteredRevenue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Stone + Freight + Loading</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Paid / Realized</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatINR(totalFilteredPaid)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            {totalFilteredRevenue > 0 ? Math.round((totalFilteredPaid / totalFilteredRevenue) * 100) : 0}% Realized
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase">Outstanding Balance</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {formatINR(totalFilteredBalance)}
          </div>
          <div className="text-[11px] text-rose-500 font-semibold mt-0.5">To be collected</div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Trip ID, customer, truck, driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Date Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="2026-08-28">Today (28-Aug-2026)</option>
              <option value="2026-08-27">Yesterday (27-Aug-2026)</option>
              <option value="All">All Dates</option>
            </select>
          </div>

          {/* Customer Filter */}
          <select
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none font-medium"
          >
            <option value="All">All Customers</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName}
              </option>
            ))}
          </select>

          {/* Delivery Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Booked">Booked</option>
            <option value="Loading">Loading</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Main Trips Data Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Trip Details</th>
                <th className="py-3.5 px-4">Customer & Route</th>
                <th className="py-3.5 px-4">Truck & Driver</th>
                <th className="py-3.5 px-4 text-center">Trips × T/Trip</th>
                <th className="py-3.5 px-4 text-right">Total Tons</th>
                <th className="py-3.5 px-4 text-right">Rate / Ton</th>
                <th className="py-3.5 px-4 text-right">Stone Amt</th>
                <th className="py-3.5 px-4 text-right">Charges</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Payment</th>
                <th className="py-3.5 px-4 text-center">Delivery</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    No stone transfers found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => {
                  const chargesTotal =
                    trip.loadingCharge + trip.unloadingCharge + trip.transportCharge + trip.otherCharge;
                  return (
                    <tr
                      key={trip.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Trip Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {trip.tripId}
                        </div>
                        <div className="text-[11px] text-slate-400">{formatDate(trip.date)}</div>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {trip.graniteType}
                        </span>
                      </td>

                      {/* Customer & Route */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {trip.customerName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {trip.sourceQuarry} → {trip.destination}
                        </div>
                      </td>

                      {/* Truck & Driver */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {trip.truckNumber}
                        </div>
                        <div className="text-[11px] text-slate-400">{trip.driverName}</div>
                      </td>

                      {/* Trips × Tons/Trip */}
                      <td className="py-3.5 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                        {trip.numberOfTrips} × {trip.tonsPerTrip} T
                      </td>

                      {/* Total Tons */}
                      <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-slate-100">
                        {trip.totalTons} T
                      </td>

                      {/* Rate */}
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                        ₹{trip.ratePerTon}
                      </td>

                      {/* Stone Amount */}
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {formatINR(trip.stoneAmount)}
                      </td>

                      {/* Charges */}
                      <td className="py-3.5 px-4 text-right text-[11px] text-slate-500 font-mono" title={`Loading: ₹${trip.loadingCharge}, Unloading: ₹${trip.unloadingCharge}, Transport: ₹${trip.transportCharge}, Other: ₹${trip.otherCharge}`}>
                        +{formatINR(chargesTotal)}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-slate-100">
                        {formatINR(trip.totalAmount)}
                        <div className="text-[10px] text-slate-400 font-normal">
                          Paid: {formatINR(trip.paidAmount)}
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            trip.paymentStatus === 'Paid'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : trip.paymentStatus === 'Partial'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {trip.paymentStatus}
                        </span>
                        {trip.balanceAmount > 0 && (
                          <div className="text-[10px] text-rose-500 font-mono mt-0.5">
                            Bal: {formatINR(trip.balanceAmount)}
                          </div>
                        )}
                      </td>

                      {/* Delivery Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            trip.deliveryStatus === 'Delivered' || trip.deliveryStatus === 'Completed'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : trip.deliveryStatus === 'In Transit'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 animate-pulse'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {trip.deliveryStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            id={`btn-print-trip-${trip.id}`}
                            onClick={() => setPrintTripSheetData(trip)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Print Quarry Trip Docket"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`btn-edit-trip-${trip.id}`}
                            onClick={() => handleOpenEditModal(trip)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="Edit Trip"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`btn-delete-trip-${trip.id}`}
                            onClick={() => {
                              if (window.confirm(`Delete trip record ${trip.tripId}?`)) {
                                deleteTrip(trip.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New / Edit Stone Transfer with Live Formulas */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div
            id="stone-transfer-form-modal"
            className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    {editingTripId ? 'Edit Stone Transfer Record' : 'Record Daily Stone Transfer'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Automatic calculations: Total Tons, Stone Amount, Total & Balance
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-6">
              {/* Section 1: Dispatch & Routing */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
                  <Truck className="w-4 h-4" /> Dispatch & Quarry Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Customer / Consignee
                    </label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => handleCustomerChange(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 font-medium"
                    >
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.companyName} ({c.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Granite Stone Type
                    </label>
                    <select
                      value={formData.graniteType}
                      onChange={(e) => setFormData({ ...formData, graniteType: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 font-medium"
                    >
                      <option value="Black Galaxy">Black Galaxy (Chimakurthy)</option>
                      <option value="Tan Brown">Tan Brown (Karimnagar)</option>
                      <option value="Absolute Black">Absolute Black (Kanakapura)</option>
                      <option value="Kashmir White">Kashmir White (Madurai)</option>
                      <option value="Steel Grey">Steel Grey (Martur)</option>
                      <option value="Jhansi Red">Jhansi Red (Omalur Salem)</option>
                      <option value="Vizag Blue">Vizag Blue (Tekkali)</option>
                      <option value="Colombo Juperana">Colombo Juperana (Melur)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Source Quarry / Pit
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sourceQuarry}
                      onChange={(e) => setFormData({ ...formData, sourceQuarry: e.target.value })}
                      placeholder="e.g. Chimakurthy Galaxy Pit 1"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Destination Yard / Port
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="e.g. Hosur Polishing SEZ Unit 2"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Delivery Pipeline Stage
                    </label>
                    <select
                      value={formData.deliveryStatus}
                      onChange={(e) => setFormData({ ...formData, deliveryStatus: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                    >
                      <option value="Booked">Booked</option>
                      <option value="Loading">Loading at Quarry</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered (Awaiting POD)</option>
                      <option value="Completed">Completed & Billed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Fleet & Personnel */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Assigned Vehicle & Driver
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Select Heavy Truck
                    </label>
                    <select
                      value={formData.truckId}
                      onChange={(e) => handleTruckChange(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono font-medium"
                    >
                      {trucks.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.registrationNumber} ({t.truckType} • {t.capacityTons}T)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Assigned Driver
                    </label>
                    <select
                      value={formData.driverId}
                      onChange={(e) => handleDriverChange(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                    >
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} (License: {d.licenseNumber} • Rating ⭐ {d.rating})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Live Automatic Calculations */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4" /> Live Automatic Tonnage & Pricing Formula
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                    Total Tons = {formData.numberOfTrips} × {formData.tonsPerTrip} = {totalTons} T
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Number of Trips
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.numberOfTrips}
                      onChange={(e) => setFormData({ ...formData, numberOfTrips: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tons per Trip
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.tonsPerTrip}
                      onChange={(e) => setFormData({ ...formData, tonsPerTrip: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Rate per Ton (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.ratePerTon}
                      onChange={(e) => setFormData({ ...formData, ratePerTon: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Stone Amount (Auto)
                    </label>
                    <div className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
                      {formatINR(stoneAmount)}
                    </div>
                  </div>
                </div>

                {/* Freight & Accessorial Charges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-blue-200/60 dark:border-blue-800/60">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Loading Charge (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.loadingCharge}
                      onChange={(e) => setFormData({ ...formData, loadingCharge: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Unloading Charge (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.unloadingCharge}
                      onChange={(e) => setFormData({ ...formData, unloadingCharge: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Transport Freight (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.transportCharge}
                      onChange={(e) => setFormData({ ...formData, transportCharge: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Other / Weighbridge (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.otherCharge}
                      onChange={(e) => setFormData({ ...formData, otherCharge: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Grand Total & Real-time Balance */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-blue-200/60 dark:border-blue-800/60 items-center">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800">
                    <div className="text-[11px] text-slate-400 font-semibold uppercase">Total Amount (Auto)</div>
                    <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
                      {formatINR(totalAmount)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Paid Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.paidAmount}
                      onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-black text-emerald-600 dark:text-emerald-400"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] text-slate-400 font-semibold uppercase">Balance Due (Auto)</div>
                    <div className={`text-xl font-black mt-0.5 ${balanceAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {formatINR(balanceAmount)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Weighbridge Slip & Docket Remarks
                </label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="e.g. Weighbridge Slip No: WB-HS-9920, 0-crack inspected."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-stone-transfer"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {editingTripId ? 'Update Trip Record' : 'Save & Dispatch Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Printable Quarry Trip Sheet / Weighbridge Waybill */}
      {printTripSheetData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div
            id="trip-sheet-print-modal"
            className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-8 shadow-2xl relative"
          >
            <button
              onClick={() => setPrintTripSheetData(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Waybill Template */}
            <div className="border-2 border-slate-900 p-6 rounded-2xl font-sans">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div>
                  <div className="text-xl font-black uppercase tracking-tight">GraniteTrack Pro Logistics</div>
                  <div className="text-xs text-slate-600">Quarry Weighbridge Dispatch Sheet & Trip Docket</div>
                  <div className="text-[11px] text-slate-500 mt-1">SIPCOT Phase II, Hosur, Tamil Nadu • GSTIN: 33AABCG9812K1Z9</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold bg-slate-900 text-white px-2.5 py-1 rounded">
                    {printTripSheetData.tripId}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Date: {formatDate(printTripSheetData.date)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-300 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Customer Consignee:</span>
                  <div className="font-extrabold text-sm text-slate-900">{printTripSheetData.customerName}</div>
                  <div className="text-slate-600">Phone: {printTripSheetData.customerPhone || '+91 98410 44210'}</div>
                </div>

                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Quarry & Destination:</span>
                  <div className="font-bold text-slate-900">{printTripSheetData.sourceQuarry}</div>
                  <div className="text-slate-600">To: {printTripSheetData.destination}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-300 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Heavy Hauler Truck:</span>
                  <div className="font-mono font-extrabold text-sm">{printTripSheetData.truckNumber}</div>
                  <div className="text-slate-600">Driver: {printTripSheetData.driverName}</div>
                </div>

                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Granite Material:</span>
                  <div className="font-bold text-slate-900">{printTripSheetData.graniteType}</div>
                  <div className="text-slate-600 font-mono font-bold">{printTripSheetData.totalTons} Metric Tons</div>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="py-4 border-b-2 border-slate-900 text-xs">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                      <th className="text-left pb-1">Item Description</th>
                      <th className="text-right pb-1">Tons</th>
                      <th className="text-right pb-1">Rate</th>
                      <th className="text-right pb-1">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="py-1.5">{printTripSheetData.graniteType} (Rough Block)</td>
                      <td className="py-1.5 text-right font-mono">{printTripSheetData.totalTons} T</td>
                      <td className="py-1.5 text-right font-mono">₹{printTripSheetData.ratePerTon}</td>
                      <td className="py-1.5 text-right font-mono font-bold">{formatINR(printTripSheetData.stoneAmount)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-slate-600">Transport & Haulage Charges</td>
                      <td className="py-1 text-right">-</td>
                      <td className="py-1 text-right">-</td>
                      <td className="py-1 text-right font-mono">{formatINR(printTripSheetData.transportCharge)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-slate-600">Loading / Gantry Crane Handling</td>
                      <td className="py-1 text-right">-</td>
                      <td className="py-1 text-right">-</td>
                      <td className="py-1 text-right font-mono">{formatINR(printTripSheetData.loadingCharge + printTripSheetData.unloadingCharge)}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-900 font-black text-sm">
                      <td colSpan={3} className="pt-2 text-right">Grand Total:</td>
                      <td className="pt-2 text-right font-mono">{formatINR(printTripSheetData.totalAmount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-4 pt-12 text-center text-xs">
                <div>
                  <div className="border-t border-slate-400 pt-1 font-semibold">Quarry Supervisor</div>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-1 font-semibold">Truck Driver</div>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-1 font-semibold">Consignee Receiver</div>
                </div>
              </div>
            </div>

            {/* Print button */}
            <div className="mt-6 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setPrintTripSheetData(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" /> Print Docket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
