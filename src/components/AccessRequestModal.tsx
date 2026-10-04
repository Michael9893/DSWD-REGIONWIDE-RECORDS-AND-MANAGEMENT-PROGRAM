import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  ShieldAlert, 
  Send, 
  CheckCircle, 
  Building, 
  User, 
  Briefcase, 
  Mail, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { Issuance, AccessRequest } from '../types';
import { DSWD_CENTERS } from '../data/mockData';

interface AccessRequestModalProps {
  issuance: Issuance | null;
  onClose: () => void;
  onSubmitRequest: (request: Omit<AccessRequest, 'id' | 'trackingCode' | 'submittedAt' | 'status' | 'downloadAccessCount'>) => void;
}

export const AccessRequestModal: React.FC<AccessRequestModalProps> = ({
  issuance,
  onClose,
  onSubmitRequest
}) => {
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [centerOffice, setCenterOffice] = useState(DSWD_CENTERS[0]);
  const [customCenter, setCustomCenter] = useState('');
  const [dswdEmail, setDswdEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!issuance) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !position.trim() || !purpose.trim() || !dswdEmail.trim()) {
      setError('Please fill out all required fields marked with an asterisk (*).');
      return;
    }

    if (!dswdEmail.includes('@') || !dswdEmail.includes('.')) {
      setError('Please provide a valid official email address (e.g., name@dswd.gov.ph).');
      return;
    }

    const finalCenter = centerOffice === 'Other' ? customCenter.trim() : centerOffice;
    if (!finalCenter) {
      setError('Please specify your DSWD Center or Operating Unit.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitRequest({
        issuanceId: issuance.id,
        issuanceNumber: issuance.number,
        issuanceTitle: issuance.title,
        fullName: fullName.trim(),
        position: position.trim(),
        centerOffice: finalCenter,
        dswdEmail: dswdEmail.trim(),
        purpose: purpose.trim()
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="access-request-title"
      >
        {/* Header - Clean Light Styling */}
        <div className="bg-slate-50 text-slate-900 p-5 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-600">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 id="access-request-title" className="text-base font-bold tracking-tight text-slate-900">
                Restricted Document Access Request
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official DSWD Clearance &amp; Electronic Authorization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Info Pill */}
        <div className="bg-amber-50 border-b border-amber-200/80 p-4 text-xs">
          <div className="flex items-start gap-2 text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-950">
                Target Record: {issuance.number}
              </p>
              <p className="text-amber-800 leading-snug line-clamp-2">
                {issuance.title}
              </p>
              <p className="text-[11px] text-amber-700 mt-1 italic">
                *Upon administrative approval in Module B, a secured, time-sensitive download link will be automatically generated and dispatched to your email.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Maria Teresa S. Alcantara, RSW"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Position / Designation *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Social Welfare Officer IV / Center Head"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Center / Office */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>Center / Operating Office *</span>
              </label>
              <select
                value={centerOffice}
                onChange={(e) => setCenterOffice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              >
                {DSWD_CENTERS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Other">Other Operating Division</option>
              </select>
            </div>

            {/* Official Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Registered DSWD Email *</span>
              </label>
              <input
                type="email"
                placeholder="e.g. jdelacruz@dswd.gov.ph"
                value={dswdEmail}
                onChange={(e) => setDswdEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>
          </div>

          {centerOffice === 'Other' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specify Division or Branch Name *
              </label>
              <input
                type="text"
                placeholder="Enter office name"
                value={customCenter}
                onChange={(e) => setCustomCenter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          )}

          {/* Purpose of Request */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Purpose of Request / Official Justification *</span>
            </label>
            <textarea
              rows={3}
              placeholder="State the official basis, legal requirement, casework necessity, or audit compliance reason for accessing this restricted issuance..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
              required
            />
          </div>

          {/* Data Privacy & Oath */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
            By submitting this request, I affirm under oath that I am an authorized DSWD personnel, that the requested records will be used strictly for official social welfare casework/administration, and that unauthorized disclosure is punishable under the Data Privacy Act (RA 10173).
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Routing to Admin...' : 'Submit Access Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
