import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Download, 
  ExternalLink, 
  Filter, 
  Info,
  Calendar,
  Building,
  KeyRound,
  Upload,
  Trash2,
  Plus
} from 'lucide-react';
import { Issuance, IssuanceType } from '../types';

interface IssuancesRepositoryProps {
  issuances: Issuance[];
  onRequestAccess: (issuance: Issuance) => void;
  onViewPublicIssuance: (issuance: Issuance) => void;
  onOpenTokenVerifier: () => void;
  onOpenUpload: () => void;
  onDeleteIssuance?: (issuanceId: string) => void;
  onLoadSamples?: () => void;
  selectedTypeFilter?: string;
}

const ISSUANCE_TYPES: IssuanceType[] = [
  'Administrative Order',
  'Memorandum Circular',
  'Regional Special Order (RSO)',
  'Special Order'
];

export const IssuancesRepository: React.FC<IssuancesRepositoryProps> = ({
  issuances,
  onRequestAccess,
  onViewPublicIssuance,
  onOpenTokenVerifier,
  onOpenUpload,
  onDeleteIssuance,
  onLoadSamples,
  selectedTypeFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>(selectedTypeFilter || 'All');
  const [selectedClassification, setSelectedClassification] = useState<string>('All');

  // React to prop changes if passed from navbar
  React.useEffect(() => {
    if (selectedTypeFilter) {
      setSelectedType(selectedTypeFilter);
    }
  }, [selectedTypeFilter]);

  const filteredIssuances = useMemo(() => {
    return issuances.filter((item) => {
      const matchesSearch = 
        item.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.issuingOffice.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = 
        selectedType === 'All' || item.type === selectedType;

      const matchesClassification = 
        selectedClassification === 'All' ||
        (selectedClassification === 'Restricted' && item.isRestricted) ||
        (selectedClassification === 'Public' && !item.isRestricted);

      return matchesSearch && matchesType && matchesClassification;
    });
  }, [issuances, searchQuery, selectedType, selectedClassification]);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice - Clean Light Card */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-200/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-blue-50/80 border border-blue-100 rounded-lg text-blue-600 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base">
                  Administrative Issuances &amp; RSO Repository
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 rounded">
                  Dual-Classification Protocol
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Standard circulars are open for immediate reading. Sensitive or restricted RSOs (adoption registry, confidential casework, audit reports) require a formal <strong>Access Request Form</strong>.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto flex-shrink-0">
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New Issuance</span>
            </button>
            <button
              onClick={onOpenTokenVerifier}
              className="px-3.5 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>Verify Access Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search issuances by order number (e.g., RSO No. 09-2026), subject, or issuing office..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1 px-1">
            <span>Showing</span>
            <strong className="text-slate-800">{filteredIssuances.length}</strong>
            <span>of {issuances.length} uploaded issuances</span>
          </div>
        </div>

        {/* Filter Controls: Type and Classification */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Type:
            </span>
            <button
              onClick={() => setSelectedType('All')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedType === 'All'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Types
            </button>
            {ISSUANCE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedType === type
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 self-start lg:self-auto">
            <span className="text-xs font-medium text-slate-500 mr-1">Classification:</span>
            <button
              onClick={() => setSelectedClassification('All')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedClassification === 'All'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedClassification('Public')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                selectedClassification === 'Public'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Unlock className="w-3 h-3" />
              <span>Public</span>
            </button>
            <button
              onClick={() => setSelectedClassification('Restricted')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                selectedClassification === 'Restricted'
                  ? 'bg-rose-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Restricted</span>
            </button>
          </div>
        </div>
      </div>

      {/* Issuances List or Empty State */}
      <div className="space-y-3.5">
        {issuances.length === 0 ? (
          /* Empty Repository State - Clean, light & inviting */
          <div className="bg-white border border-slate-200/80 rounded-xl p-12 sm:p-16 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Upload className="w-7 h-7 text-blue-600" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Administrative Issuances Repository Ready for Uploads
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No circulars or RSOs uploaded yet. You can upload official Administrative Orders, Memorandum Circulars, or Restricted Orders with access locks.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenUpload}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Your First Issuance</span>
              </button>
            </div>
          </div>
        ) : filteredIssuances.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-semibold text-sm">No issuances matched your search</p>
            <p className="text-slate-400 text-xs mt-1">Adjust search terms or reset filters to display records.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedType('All'); setSelectedClassification('All'); }}
              className="mt-3 px-3 py-1.5 text-xs text-blue-700 hover:underline font-semibold cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredIssuances.map((item) => (
            <div
              key={item.id}
              className={`bg-white border rounded-xl p-4 sm:p-5 transition-all shadow-xs ${
                item.isRestricted 
                  ? 'border-amber-200/90 hover:border-amber-300 bg-linear-to-r from-amber-50/20 to-white' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  {/* Top Header Row with Number, Classification, Date */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                      {item.number}
                    </span>

                    {item.isRestricted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                        <Lock className="w-3 h-3 text-rose-700" />
                        Restricted RSO · Access Clearance Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <Unlock className="w-3 h-3 text-emerald-700" />
                        Public Circular · Open Access
                      </span>
                    )}

                    <span className="text-xs text-slate-400">|</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Issued {item.dateIssued}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                    {item.summary}
                  </p>

                  {/* Restricted Warning Box if Restricted */}
                  {item.isRestricted && item.restrictedReason && (
                    <div className="bg-amber-50/90 border border-amber-200/80 rounded-lg p-2.5 text-xs text-amber-900 flex items-start gap-2 max-w-3xl mt-2">
                      <Lock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-amber-950">Security Constraint:</strong>{' '}
                        <span>{item.restrictedReason}</span>
                        {item.securityClearanceRequired && (
                          <div className="text-[11px] text-amber-800 mt-1 font-medium">
                            Required Endorsement: {item.securityClearanceRequired}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building className="w-3 h-3 text-slate-400" />
                      {item.issuingOffice}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span>Series of {item.seriesYear}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span>{item.pageCount} Pages (Official PDF)</span>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-center gap-2 flex-shrink-0">
                  {item.isRestricted ? (
                    <button
                      onClick={() => onRequestAccess(item)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-rose-200" />
                      <span>Request Document Access</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onViewPublicIssuance(item)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View &amp; Read Circular</span>
                    </button>
                  )}

                  {onDeleteIssuance && (
                    <button
                      onClick={() => onDeleteIssuance(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete uploaded issuance"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
