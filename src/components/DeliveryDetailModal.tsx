import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Printer, 
  UserCheck, 
  Building, 
  Phone, 
  ShieldCheck, 
  Send, 
  Check, 
  ArrowRight
} from 'lucide-react';
import { LogisticsDelivery, DeliveryStatus } from '../types';

interface DeliveryDetailModalProps {
  delivery: LogisticsDelivery | null;
  onClose: () => void;
  onUpdateDeliveryStatus: (
    deliveryId: string, 
    newStatus: DeliveryStatus, 
    checkpointNote: string, 
    location: string, 
    recipientName?: string
  ) => void;
}

export const DeliveryDetailModal: React.FC<DeliveryDetailModalProps> = ({
  delivery,
  onClose,
  onUpdateDeliveryStatus
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'slip' | 'update'>('timeline');
  
  // Status update form states
  const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus>(delivery?.status || 'In Transit');
  const [checkpointLocation, setCheckpointLocation] = useState('');
  const [checkpointNote, setCheckpointNote] = useState('');
  const [recipientNameInput, setRecipientNameInput] = useState('');

  React.useEffect(() => {
    if (delivery) {
      setSelectedStatus(delivery.status);
    }
  }, [delivery?.id, delivery?.status]);

  if (!delivery) return null;

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = checkpointLocation.trim() || 'Facility Gate Checkpoint';
    const note = checkpointNote.trim() || `Status updated to ${selectedStatus}`;
    
    onUpdateDeliveryStatus(
      delivery.id, 
      selectedStatus, 
      note, 
      loc, 
      selectedStatus === 'Delivered & Acknowledged' ? (recipientNameInput.trim() || 'Center Receiving Officer') : undefined
    );

    setActiveTab('timeline');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header - Clean Light Styling */}
        <div className="bg-slate-50 text-slate-900 p-5 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-blue-900 font-bold bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200">
                  {delivery.trackingNumber}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-200 text-slate-700 rounded border border-slate-300">
                  {delivery.priority}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 mt-1 line-clamp-1">
                {delivery.subject}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 pt-2 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-2 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-blue-900 text-blue-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Checkpoint Timeline
          </button>
          <button
            onClick={() => setActiveTab('slip')}
            className={`px-3 py-2 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'slip'
                ? 'border-blue-900 text-blue-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Official Transmittal Slip</span>
          </button>
          <button
            onClick={() => setActiveTab('update')}
            className={`px-3 py-2 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'update'
                ? 'border-blue-900 text-blue-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Update Courier Status</span>
          </button>
        </div>

        {/* Tab 1: Checkpoint Timeline */}
        {activeTab === 'timeline' && (
          <div className="p-6 space-y-5">
            {/* Courier & Route Brief */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Originating Office:</span>
                  <span className="font-bold text-slate-900">{delivery.originOffice}</span>
                  <div className="text-slate-500">Sender: {delivery.senderName}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Destination Facility:</span>
                  <span className="font-bold text-slate-900">{delivery.destinationOffice}</span>
                  <div className="text-slate-500">Attn: {delivery.recipientDesignation}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-slate-500" />
                  <span>
                    Messenger: <strong>{delivery.assignedMessenger}</strong> ({delivery.vehicleType})
                  </span>
                </div>
                <span className="font-mono text-slate-600">{delivery.messengerContact}</span>
              </div>
            </div>

            {/* Checkpoints list */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Official Chain of Custody &amp; Handover Timeline
              </h3>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {delivery.checkpoints.map((cp, idx) => (
                  <div key={cp.id || idx} className="relative flex items-start gap-3.5 text-xs">
                    <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-blue-600 text-blue-900 font-bold text-[11px] flex items-center justify-center flex-shrink-0 z-10 shadow-xs">
                      {idx + 1}
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-3 flex-1 shadow-xs space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{cp.location}</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(cp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {cp.statusNote}
                      </p>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Log entry: {cp.recordedBy}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signed Proof if Delivered */}
            {delivery.status === 'Delivered & Acknowledged' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Verified Receiving Acknowledgment Proof</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Received By:</span>
                    <strong>{delivery.receivedByName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Receipt Voucher No:</span>
                    <strong className="font-mono">{delivery.acknowledgmentReceiptNo}</strong>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-800 italic pt-1 border-t border-emerald-200">
                  Electronic receiving signature logged with biometric timestamp and courier confirmation.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Printable Transmittal Slip */}
        {activeTab === 'slip' && (
          <div className="p-6 space-y-4">
            <div className="border border-slate-300 rounded-lg p-5 bg-white space-y-4 text-xs font-serif shadow-xs">
              {/* Official Header */}
              <div className="text-center border-b border-slate-300 pb-3 space-y-0.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">Republic of the Philippines</p>
                <p className="font-bold text-sm text-slate-900 uppercase">Department of Social Welfare and Development</p>
                <p className="text-[11px] text-slate-700">REGIONAL RECORDS AND ARCHIVES SECTION</p>
                <p className="font-bold text-xs uppercase text-blue-900 mt-1">
                  OFFICIAL INTER-CENTER DOCUMENT TRANSMITTAL SLIP (FORM TS-01)
                </p>
              </div>

              {/* Transmittal metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Tracking Number:</span>
                  <span className="font-mono font-bold text-sm text-slate-900">{delivery.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Date &amp; Time Dispatched:</span>
                  <span className="font-semibold text-slate-800">{new Date(delivery.dispatchedAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-b border-slate-200 py-3 space-y-2">
                <div>
                  <span className="text-slate-500 block text-[10px]">Originating Unit:</span>
                  <span className="font-semibold text-slate-800">{delivery.originOffice}</span>
                  <div className="text-[11px] text-slate-600">Dispatched by: {delivery.senderName}</div>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Destination Center:</span>
                  <span className="font-semibold text-slate-800">{delivery.destinationOffice}</span>
                  <div className="text-[11px] text-slate-600">Attention: {delivery.recipientDesignation}</div>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Document Description:</span>
                  <span className="font-bold text-slate-900">{delivery.subject}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Assigned Messenger:</span>
                  <span>{delivery.assignedMessenger} ({delivery.vehicleType})</span>
                </div>
              </div>

              {/* Signatures block */}
              <div className="grid grid-cols-2 gap-6 pt-4 text-center">
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-semibold text-slate-800">{delivery.assignedMessenger}</p>
                  <p className="text-[10px] text-slate-500">Official DSWD Courier Signature</p>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-semibold text-slate-800">
                    {delivery.receivedByName || '__________________________'}
                  </p>
                  <p className="text-[10px] text-slate-500">Receiving Center Custodian Signature</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Transmittal Slip</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Update Courier Status */}
        {activeTab === 'update' && (
          <form onSubmit={handleStatusSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                New Transit Status *
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="Dispatched">Dispatched (Outbound)</option>
                <option value="In Transit">In Transit (En Route)</option>
                <option value="Arrived at Facility">Arrived at Facility</option>
                <option value="Delivered & Acknowledged">Delivered &amp; Acknowledged (Complete)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Current Checkpoint Location *
              </label>
              <input
                type="text"
                placeholder="e.g. Center Guardhouse Gate / Receiving Desk"
                value={checkpointLocation}
                onChange={(e) => setCheckpointLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status / Handover Note *
              </label>
              <input
                type="text"
                placeholder="e.g. Envelope inspected by receiving clerk, security seal intact"
                value={checkpointNote}
                onChange={(e) => setCheckpointNote(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {selectedStatus === 'Delivered & Acknowledged' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2">
                <label className="block font-bold text-emerald-950">
                  Recipient Full Name &amp; Designation *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jennifer B. Mendoza, RSW (Center Head)"
                  value={recipientNameInput}
                  onChange={(e) => setRecipientNameInput(e.target.value)}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600"
                  required
                />
                <span className="text-[11px] text-emerald-800 block">
                  *Auto-generates official acknowledgment receipt voucher number upon submission.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Checkpoint &amp; Update Transit</span>
              </button>
            </div>
          </form>
        )}

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
