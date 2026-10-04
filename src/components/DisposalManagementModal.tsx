import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Building, 
  User, 
  Calendar, 
  Box, 
  Scale, 
  FileSpreadsheet, 
  Send,
  AlertCircle
} from 'lucide-react';
import { DisposalBatch } from '../types';
import { DSWD_CENTERS } from '../data/mockData';

interface DisposalManagementModalProps {
  onClose: () => void;
  onSubmitBatch: (batch: Omit<DisposalBatch, 'id' | 'batchNumber' | 'status' | 'submittedDate'>) => void;
}

export const DisposalManagementModal: React.FC<DisposalManagementModalProps> = ({
  onClose,
  onSubmitBatch
}) => {
  const [centerOffice, setCenterOffice] = useState(DSWD_CENTERS[0]);
  const [custodianName, setCustodianName] = useState('');
  const [recordSeries, setRecordSeries] = useState('');
  const [inclusiveYears, setInclusiveYears] = useState('2014 - 2019');
  const [totalBoxes, setTotalBoxes] = useState<number>(45);
  const [weightKg, setWeightKg] = useState<number>(1350);
  const [destructionMethod, setDestructionMethod] = useState<'High-Volume Shredding' | 'Pulping & Recycling' | 'Witnessed Incineration'>('High-Volume Shredding');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!custodianName.trim() || !recordSeries.trim() || totalBoxes <= 0 || weightKg <= 0) {
      setError('Please provide valid details for all required inventory fields.');
      return;
    }

    onSubmitBatch({
      centerOffice,
      custodianName: custodianName.trim(),
      recordSeries: recordSeries.trim(),
      inclusiveYears: inclusiveYears.trim(),
      totalBoxes: Number(totalBoxes),
      weightKg: Number(weightKg),
      destructionMethod
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-50 text-slate-900 p-5 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                Submit Regional Disposal Batch (NAP Form 1)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Records Inventory and Inspection Endorsement for CY 2026
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
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>Originating Center / Facility *</span>
            </label>
            <select
              value={centerOffice}
              onChange={(e) => setCenterOffice(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
            >
              {DSWD_CENTERS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Designated Center Custodian *</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Erlinda M. Gomez (Records Officer)"
              value={custodianName}
              onChange={(e) => setCustodianName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
              <span>Record Series Description (Per General Disposal Schedule) *</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Expired Food Assistance Slips & Medical Clinic Logs"
              value={recordSeries}
              onChange={(e) => setRecordSeries(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Inclusive Years *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 2014 - 2019"
                value={inclusiveYears}
                onChange={(e) => setInclusiveYears(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Box className="w-3.5 h-3.5 text-slate-400" />
                <span>Total Boxes *</span>
              </label>
              <input
                type="number"
                min={1}
                value={totalBoxes}
                onChange={(e) => setTotalBoxes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-slate-400" />
                <span>Estimated Weight (kg) *</span>
              </label>
              <input
                type="number"
                min={10}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Destruction / Disposal Method per NAP Guidelines:
            </label>
            <select
              value={destructionMethod}
              onChange={(e) => setDestructionMethod(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
            >
              <option value="High-Volume Shredding">High-Volume Shredding (Standard Security)</option>
              <option value="Pulping & Recycling">Pulping &amp; Recycling (Environment-Friendly Mill)</option>
              <option value="Witnessed Incineration">Witnessed Incineration (High-Risk Contaminated)</option>
            </select>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600">
            *Submitted batches enter <em>Pending Management Signature</em> status. The Regional Director will review and endorse the inventory to the National Archives of the Philippines (NAP) inspection team.
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
              <span>Submit for Executive Endorsement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
