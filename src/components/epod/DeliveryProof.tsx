import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryProofRecord } from '../../types';
import {
  FileCheck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Image as ImageIcon,
  Edit3,
  X,
  Printer,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { formatTons, formatDate } from '../../utils/formatters';

export const DeliveryProof: React.FC = () => {
  const { deliveryProofs, addDeliveryProof, trips, trucks } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProof, setSelectedProof] = useState<DeliveryProofRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal State
  const [formData, setFormData] = useState({
    tripId: trips[0]?.tripId || 'TRIP-2026-0891',
    customerName: 'Shree Krishna Granites Export Yard',
    deliveredAt: '2026-08-28 14:30',
    receiverName: 'R. Senthil Nathan (Yard Supervisor)',
    receiverPhone: '+91 94432 10982',
    notes: 'Block unloaded safely with 30T Gantry Crane. No transit fissures or edge chipping detected.',
    weighbridgeSlipNumber: 'WB-HOS-9941',
    grossWeightTons: 38.6,
    tareWeightTons: 13.1,
  });

  const calculatedNetTons = Number((formData.grossWeightTons - formData.tareWeightTons).toFixed(2));

  const handleOpenAdd = () => {
    setFormData({
      tripId: trips[0]?.tripId || 'TRIP-2026-0891',
      customerName: trips[0]?.customerName || 'Shree Krishna Granites',
      deliveredAt: '2026-08-28 16:45',
      receiverName: 'M. Anand (Unloading Foreman)',
      receiverPhone: '+91 98421 55667',
      notes: 'Monolith rough block inspected and signed off at weighbridge yard.',
      weighbridgeSlipNumber: `WB-SLIP-${Math.floor(1000 + Math.random() * 9000)}`,
      grossWeightTons: 39.2,
      tareWeightTons: 13.4,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Omit<DeliveryProofRecord, 'id'> = {
      tripId: formData.tripId,
      customerName: formData.customerName,
      deliveredAt: formData.deliveredAt,
      receiverName: formData.receiverName,
      receiverPhone: formData.receiverPhone,
      signatureUrl: 'https://api.iconify.design/lucide:check.svg',
      weighbridgePhotoUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80',
      unloadingPhotoUrl: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?w=600&auto=format&fit=crop&q=80',
      notes: formData.notes,
      weighbridgeSlipNumber: formData.weighbridgeSlipNumber,
      grossWeightTons: Number(formData.grossWeightTons),
      tareWeightTons: Number(formData.tareWeightTons),
      netWeightTons: calculatedNetTons,
    };

    addDeliveryProof(payload);
    setIsModalOpen(false);
  };

  const filteredProofs = deliveryProofs.filter((p) => {
    return (
      p.tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.weighbridgeSlipNumber && p.weighbridgeSlipNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Electronic Proof of Delivery (e-POD) & Weighbridge Verification
            </h1>
            <p className="text-xs text-slate-500">
              Tamper-proof digital receiving slips, weighbridge gross/tare certificates, and customer digital signatures
            </p>
          </div>
        </div>

        <button
          id="btn-upload-epod"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Issue Digital POD
        </button>
      </div>

      {/* ePOD Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProofs.map((proof) => (
          <div
            key={proof.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-lg">
                    {proof.tripId}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mt-1">
                    {proof.customerName}
                  </h3>
                </div>

                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>

              {/* Weighbridge Slip Tonnage Box */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Weighbridge Slip:</span>
                  <span className="font-mono font-bold">{proof.weighbridgeSlipNumber}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Gross / Tare:</span>
                  <span className="font-mono">{proof.grossWeightTons}T / {proof.tareWeightTons}T</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-400 font-bold">Net Certified Tonnage:</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{proof.netWeightTons} Tons</span>
                </div>
              </div>

              {/* Receiver details */}
              <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Received By:</span>
                  <span className="font-semibold">{proof.receiverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivered At:</span>
                  <span className="font-mono text-[11px] text-slate-500">{proof.deliveredAt}</span>
                </div>
              </div>

              {/* Photo preview strip */}
              <div className="mt-3 flex items-center gap-2">
                <img
                  src={proof.weighbridgePhotoUrl}
                  alt="Weighbridge Slip"
                  className="w-16 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                />
                <div className="text-[11px] text-slate-400 italic truncate max-w-[170px]">
                  "{proof.notes}"
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedProof(proof)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View Full Certificate
              </button>

              <button
                onClick={() => window.print()}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                title="Print e-POD Slip"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View e-POD Slip Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 text-slate-900 border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                  Electronic Proof of Delivery
                </span>
                <h3 className="font-black text-lg">{selectedProof.tripId} Delivery Certificate</h3>
              </div>
              <button
                onClick={() => setSelectedProof(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400">Consignee Buyer:</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedProof.customerName}</div>
                <div className="text-slate-500 mt-1">Receiver: {selectedProof.receiverName}</div>
                <div className="font-mono text-slate-500">Contact: {selectedProof.receiverPhone}</div>
              </div>

              <div>
                <span className="text-slate-400">Delivery Timestamp:</span>
                <div className="font-mono font-bold text-slate-900 mt-0.5">{selectedProof.deliveredAt}</div>
                <div className="text-slate-500 mt-1">Slip #: {selectedProof.weighbridgeSlipNumber}</div>
                <div className="text-emerald-600 font-bold mt-1">Net Weight: {selectedProof.netWeightTons} Tons</div>
              </div>
            </div>

            {/* Weighbridge Slip Snapshot */}
            <div>
              <span className="block text-xs font-bold text-slate-600 mb-2">
                Weighbridge Digital Image & Unloading Stamp
              </span>
              <img
                src={selectedProof.weighbridgePhotoUrl}
                alt="Weighbridge Certificate"
                className="w-full h-48 object-cover rounded-2xl border border-slate-200"
              />
            </div>

            {/* Signature Box */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">Receiver Digital Sign-off:</div>
                <div className="text-slate-500 text-[11px] mt-0.5">{selectedProof.receiverName}</div>
                <div className="text-[10px] text-emerald-600 font-mono mt-0.5">Biometrically Cryptostamped</div>
              </div>
              <div className="font-mono text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                SIGNED ✍️ {selectedProof.deliveredAt}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedProof(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Certified Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Issue Electronic Proof of Delivery
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
                    Select Trip ID
                  </label>
                  <select
                    value={formData.tripId}
                    onChange={(e) => {
                      const selTrip = trips.find((t) => t.tripId === e.target.value);
                      setFormData({
                        ...formData,
                        tripId: e.target.value,
                        customerName: selTrip ? selTrip.customerName : formData.customerName,
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-medium"
                  >
                    {trips.map((t) => (
                      <option key={t.id} value={t.tripId}>
                        {t.tripId} - {t.customerName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Delivered At
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.deliveredAt}
                    onChange={(e) => setFormData({ ...formData, deliveredAt: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Receiver Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.receiverName}
                    onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Receiver Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.receiverPhone}
                    onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Weighbridge Gross & Tare */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Weighbridge Slip Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.weighbridgeSlipNumber}
                    onChange={(e) => setFormData({ ...formData, weighbridgeSlipNumber: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Gross (Tons)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.grossWeightTons}
                      onChange={(e) => setFormData({ ...formData, grossWeightTons: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Tare (Tons)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.tareWeightTons}
                      onChange={(e) => setFormData({ ...formData, tareWeightTons: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Net Certified</label>
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 font-black text-emerald-600">
                      {calculatedNetTons} T
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Sign-off Notes
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
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Confirm & Certify Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
