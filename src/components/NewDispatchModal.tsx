import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  Building, 
  User, 
  Phone, 
  Send, 
  AlertCircle, 
  Clock, 
  FileText,
  ShieldAlert
} from 'lucide-react';
import { LogisticsDelivery, DeliveryPriority } from '../types';
import { DSWD_CENTERS } from '../data/mockData';

interface NewDispatchModalProps {
  onClose: () => void;
  onSubmitDispatch: (dispatch: Omit<LogisticsDelivery, 'id' | 'trackingNumber' | 'status' | 'dispatchedAt' | 'checkpoints'>) => void;
}

const MESSENGERS = [
  { name: 'Rodrigo "Digong" Manalo', contact: '+63 917 554 9012', vehicle: 'Motorcycle Dispatch' },
  { name: 'Juanito P. Dela Cruz', contact: '+63 920 441 3321', vehicle: 'Service Vehicle' },
  { name: 'Mark Lester Abad', contact: '+63 929 883 4519', vehicle: 'Motorcycle Dispatch' },
  { name: 'Eduardo M. Soriano', contact: '+63 918 332 9901', vehicle: 'Field Courier' }
];

export const NewDispatchModal: React.FC<NewDispatchModalProps> = ({
  onClose,
  onSubmitDispatch
}) => {
  const [subject, setSubject] = useState('');
  const [originOffice, setOriginOffice] = useState(DSWD_CENTERS[11]); // Field Office Main
  const [destinationOffice, setDestinationOffice] = useState(DSWD_CENTERS[0]); // RSCC
  const [senderName, setSenderName] = useState('Renato S. Dizon (Head of Records)');
  const [recipientDesignation, setRecipientDesignation] = useState('Center Head / Designated Custodian');
  const [selectedMessengerIdx, setSelectedMessengerIdx] = useState(0);
  const [priority, setPriority] = useState<DeliveryPriority>('Urgent');
  const [estimatedHours, setEstimatedHours] = useState(3);
  const [notes, setNotes] = useState('Official parcel sealed in records security envelope with tamper seal.');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!subject.trim() || !senderName.trim() || !recipientDesignation.trim()) {
      setError('Please provide required document details.');
      return;
    }

    if (originOffice === destinationOffice) {
      setError('Origin and destination facility cannot be identical.');
      return;
    }

    const messenger = MESSENGERS[selectedMessengerIdx];
    const estDeliveryTime = new Date(Date.now() + estimatedHours * 60 * 60 * 1000).toISOString();

    onSubmitDispatch({
      subject: subject.trim(),
      originOffice,
      destinationOffice,
      senderName: senderName.trim(),
      recipientDesignation: recipientDesignation.trim(),
      assignedMessenger: messenger.name,
      messengerContact: messenger.contact,
      vehicleType: messenger.vehicle as any,
      priority,
      estimatedDelivery: estDeliveryTime,
      notes: notes.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-50 text-slate-900 p-5 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-600">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                New Physical Document Dispatch Order
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Assign Messenger &amp; Generate Inter-Center Transmittal Slip
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Document Subject / Physical Contents *
            </label>
            <input
              type="text"
              placeholder="e.g. Endorsed Records Disposal Inventory Folders & NAP Form 1"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Originating Office / Center *
              </label>
              <select
                value={originOffice}
                onChange={(e) => setOriginOffice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              >
                {DSWD_CENTERS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Destination Office / Center *
              </label>
              <select
                value={destinationOffice}
                onChange={(e) => setDestinationOffice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              >
                {DSWD_CENTERS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sender Officer / Unit *
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Recipient Officer / Designation *
              </label>
              <input
                type="text"
                value={recipientDesignation}
                onChange={(e) => setRecipientDesignation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assigned Messenger *
              </label>
              <select
                value={selectedMessengerIdx}
                onChange={(e) => setSelectedMessengerIdx(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              >
                {MESSENGERS.map((m, idx) => (
                  <option key={m.name} value={idx}>
                    {m.name} ({m.vehicle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Priority Level *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              >
                <option value="Routine">Routine Dispatch</option>
                <option value="Urgent">Urgent Transmittal</option>
                <option value="Rush - COA / Legal">Rush - COA / Legal Priority</option>
                <option value="Confidential">Confidential Case (Sealed Custody)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Security &amp; Handling Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Create Dispatch &amp; Print Slip</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
