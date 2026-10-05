import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertCircle, 
  Building, 
  Paperclip,
  ShieldAlert
} from 'lucide-react';
import { DocumentForm, Issuance, DocumentCategory, FileFormat, IssuanceType } from '../types';
import { DSWD_CENTERS } from '../data/mockData';

interface UploadDocumentModalProps {
  initialType: 'form' | 'issuance';
  onClose: () => void;
  onAddForm: (form: DocumentForm) => void;
  onAddIssuance: (issuance: Issuance) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  initialType,
  onClose,
  onAddForm,
  onAddIssuance
}) => {
  const [docType, setDocType] = useState<'form' | 'issuance'>(initialType);

  // Form / Template fields
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<DocumentCategory>('Templates');
  const [formFileType, setFormFileType] = useState<FileFormat>('PDF');
  const [formDescription, setFormDescription] = useState('');
  const [formIssuingUnit, setFormIssuingUnit] = useState('Records and Archives Management Section (AD-RAMS)');
  const [formVersion, setFormVersion] = useState('Rev. 2026.1');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');

  // Issuance fields
  const [issuanceNumber, setIssuanceNumber] = useState('');
  const [issuanceTitle, setIssuanceTitle] = useState('');
  const [issuanceType, setIssuanceType] = useState<IssuanceType>('Memorandum Circular');
  const [issuanceOffice, setIssuanceOffice] = useState('Administrative Division - Records and Archives');
  const [dateIssued, setDateIssued] = useState(new Date().toISOString().split('T')[0]);
  const [isRestricted, setIsRestricted] = useState(false);
  const [restrictedReason, setRestrictedReason] = useState('Restricted personnel or case records requiring formal clearance.');
  const [issuanceSummary, setIssuanceSummary] = useState('');
  const [pageCount, setPageCount] = useState(8);

  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const sizeKb = Math.round(file.size / 1024);
      setUploadedFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`);
      
      // Auto-detect format if possible
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        setFormFileType('XLSX');
      } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        setFormFileType('DOCX');
      } else {
        setFormFileType('PDF');
      }

      // Default title if empty
      if (!formTitle && docType === 'form') {
        setFormTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      if (!issuanceTitle && docType === 'issuance') {
        setIssuanceTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (docType === 'form') {
      if (!formTitle.trim()) {
        setError('Please provide a title for the template.');
        return;
      }
      const code = formCode.trim() || `RAMS-TMP-${Math.floor(100 + Math.random() * 900)}`;

      const newForm: DocumentForm = {
        id: `form-${Date.now()}`,
        code,
        title: formTitle.trim(),
        category: formCategory,
        fileType: formFileType,
        fileSize: uploadedFileSize || '245 KB',
        version: formVersion.trim() || 'Rev. 2026',
        updatedDate: new Date().toISOString().split('T')[0],
        downloads: 0,
        description: formDescription.trim() || 'Official template uploaded to the AD-RAMS Portal.',
        issuingUnit: formIssuingUnit.trim()
      };

      onAddForm(newForm);
      onClose();
    } else {
      if (!issuanceTitle.trim()) {
        setError('Please enter the subject / title of the issuance.');
        return;
      }
      const number = issuanceNumber.trim() || `${issuanceType === 'Regional Special Order (RSO)' ? 'RSO' : 'MC'} No. ${Math.floor(10 + Math.random() * 80)}-2026`;

      const newIssuance: Issuance = {
        id: `iss-${Date.now()}`,
        number,
        title: issuanceTitle.trim(),
        type: issuanceType,
        seriesYear: 2026,
        issuingOffice: issuanceOffice.trim(),
        dateIssued,
        isRestricted,
        accessClassification: isRestricted ? 'Restricted / Confidential' : 'Public',
        summary: issuanceSummary.trim() || 'Official circular issued under the authority of the Records and Archives Management Section.',
        pageCount: Number(pageCount) || 1,
        restrictedReason: isRestricted ? restrictedReason.trim() : undefined,
        securityClearanceRequired: isRestricted ? 'Division Chief / Center Head Endorsement Required' : undefined
      };

      onAddIssuance(newIssuance);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header - Clean Light Styling */}
        <div className="bg-slate-50 text-slate-900 p-5 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                Upload New Document to RAMS Portal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Administrative Division · Records &amp; Archives Management Section
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection: Template/Form vs Administrative Issuance */}
        <div className="bg-slate-100 p-1.5 flex gap-1 border-b border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setDocType('form')}
            className={`flex-1 py-2 font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              docType === 'form'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Downloadable Template / Form</span>
          </button>
          <button
            type="button"
            onClick={() => setDocType('issuance')}
            className={`flex-1 py-2 font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              docType === 'issuance'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-700" />
            <span>Administrative Issuance / RSO</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* File input attachment area */}
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center bg-slate-50 transition-colors cursor-pointer relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <Paperclip className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
            <p className="font-semibold text-slate-700 text-xs">
              {uploadedFileName ? (
                <span className="text-blue-900 font-bold">Selected: {uploadedFileName} ({uploadedFileSize})</span>
              ) : (
                <span>Click or drag a file to attach (PDF, DOCX, XLSX)</span>
              )}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Supports standard DSWD formats &middot; Automatic metadata detection
            </p>
          </div>

          {docType === 'form' ? (
            /* TEMPLATE / FORM INPUTS */
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Form Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DSWD-REC-ANNEX-A"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Template Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Records Inventory and Inspection Report"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="Templates">Templates</option>
                    <option value="Inventory Sheets">Inventory Sheets</option>
                    <option value="Annexes">Annexes</option>
                    <option value="Disposal Requests">Disposal Requests</option>
                    <option value="Transmittal & Logistics">Transmittal &amp; Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    File Format *
                  </label>
                  <select
                    value={formFileType}
                    onChange={(e) => setFormFileType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="DOCX">DOCX Word Template</option>
                    <option value="XLSX">XLSX Excel Spreadsheet</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Revision Version
                  </label>
                  <input
                    type="text"
                    value={formVersion}
                    onChange={(e) => setFormVersion(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description / Archival Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain usage for center custodians, National Archives retention rules, or required annex attachments..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                />
              </div>
            </div>
          ) : (
            /* ISSUANCE / RSO INPUTS */
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Issuance Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AO No. 04, S. 2026 or RSO No. 12-2026"
                    value={issuanceNumber}
                    onChange={(e) => setIssuanceNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Issuance Type *
                  </label>
                  <select
                    value={issuanceType}
                    onChange={(e) => setIssuanceType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="Administrative Order">Administrative Order (AO)</option>
                    <option value="Memorandum Circular">Memorandum Circular (MC)</option>
                    <option value="Regional Special Order (RSO)">Regional Special Order (RSO)</option>
                    <option value="Special Order">Special Order (SO)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subject / Full Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Guidelines on the Disposal of Expired Records Across Centers"
                  value={issuanceTitle}
                  onChange={(e) => setIssuanceTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Issuing Office
                  </label>
                  <input
                    type="text"
                    value={issuanceOffice}
                    onChange={(e) => setIssuanceOffice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date Issued
                  </label>
                  <input
                    type="date"
                    value={dateIssued}
                    onChange={(e) => setDateIssued(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Summary / Policy Directives
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief synopsis of circular directives, legal authority, and compliance deadlines..."
                  value={issuanceSummary}
                  onChange={(e) => setIssuanceSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                />
              </div>

              {/* Classification Toggle: Public vs Restricted with Lock */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isRestricted ? (
                      <Lock className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Unlock className="w-4 h-4 text-emerald-600" />
                    )}
                    <span className="font-bold text-slate-900">
                      Security &amp; Access Classification:
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRestricted(false)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                        !isRestricted
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      Public
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRestricted(true)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer flex items-center gap-1 ${
                        isRestricted
                          ? 'bg-rose-700 text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      <span>Restricted</span>
                    </button>
                  </div>
                </div>

                {isRestricted && (
                  <div className="pt-2 border-t border-slate-200 text-[11px] space-y-2">
                    <p className="text-rose-800 font-semibold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                      <span>Sensitive Document Locked (Module A Rule):</span>
                    </p>
                    <input
                      type="text"
                      placeholder="Specify reason for restriction (e.g. juvenile case data, audit findings)"
                      value={restrictedReason}
                      onChange={(e) => setRestrictedReason(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-rose-300 rounded text-xs bg-white focus:ring-1 focus:ring-rose-500"
                    />
                    <p className="text-slate-500 italic">
                      Users clicking this document will be prompted to fill out the Access Request Form.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

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
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Publish to RAMS Portal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
