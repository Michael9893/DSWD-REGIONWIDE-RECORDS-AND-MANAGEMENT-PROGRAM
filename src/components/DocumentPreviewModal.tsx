import React from 'react';
import { 
  X, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileCheck, 
  Building, 
  Calendar, 
  CheckCircle, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { DocumentForm, Issuance } from '../types';

interface DocumentPreviewModalProps {
  formItem?: DocumentForm | null;
  issuanceItem?: Issuance | null;
  onClose: () => void;
  onDownload: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  formItem,
  issuanceItem,
  onClose,
  onDownload
}) => {
  if (!formItem && !issuanceItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header - Clean Light Styling */}
        <div className="bg-slate-50 text-slate-900 p-5 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-xs text-blue-700 font-bold block">
                {formItem ? formItem.code : issuanceItem?.number}
              </span>
              <h2 className="text-base font-bold tracking-tight text-slate-900 line-clamp-1">
                {formItem ? formItem.title : issuanceItem?.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-4 text-xs">
          {formItem && (
            <>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                    Template Specifications &amp; Archival Usage
                  </span>
                  <span className="px-2 py-0.5 font-bold rounded bg-blue-100 text-blue-900 text-[10px]">
                    {formItem.fileType} Format
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {formItem.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Issuing Section:</span>
                    <strong>{formItem.issuingUnit}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">File Size:</span>
                    <strong>{formItem.fileSize}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Version:</span>
                    <strong>{formItem.version}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Last Revision:</span>
                    <strong>{formItem.updatedDate}</strong>
                  </div>
                </div>
              </div>

              {/* Instructions on Form Completion */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Mandatory National Archives Compliance Guidelines:
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  <li>Fill in all linear volume measurements in both linear meters and equivalent archival box counts.</li>
                  <li>Ensure the designated Center Records Custodian and Facility Head sign in ink or authenticated GovNet PKI signature.</li>
                  <li>Annex A (RIIR) must accompany all disposal endorsement requests forwarded to the Regional Records Section.</li>
                  <li>Retain one original copy in center archival custody for COA auditing and inspection.</li>
                </ul>
              </div>
            </>
          )}

          {issuanceItem && (
            <>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {issuanceItem.type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Public Reading
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {issuanceItem.summary}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Issuing Authority:</span>
                    <strong>{issuanceItem.issuingOffice}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Date Issued:</span>
                    <strong>{issuanceItem.dateIssued}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Series Year:</span>
                    <strong>Series of {issuanceItem.seriesYear}</strong>
                  </div>
                </div>
              </div>

              {/* Mock Document Reader Preview */}
              <div className="border border-slate-300 rounded-xl p-4 bg-white space-y-3 font-serif shadow-xs">
                <div className="text-center border-b border-slate-200 pb-2">
                  <p className="text-[10px] uppercase text-slate-500">Republic of the Philippines</p>
                  <p className="font-bold text-xs uppercase text-slate-900">DEPARTMENT OF SOCIAL WELFARE AND DEVELOPMENT</p>
                  <p className="font-bold text-sm text-blue-950 mt-1">{issuanceItem.number}</p>
                </div>
                <div className="text-xs text-slate-800 space-y-2 leading-relaxed">
                  <p className="font-bold">SUBJECT: {issuanceItem.title}</p>
                  <p>
                    <strong>SECTION 1. RATIONALE &amp; OBJECTIVE:</strong> In pursuant to Republic Act No. 9470 (National Archives of the Philippines Act) and DSWD Department Order, standard operating procedures for regional records retention and decentralized custody are hereby promulgated.
                  </p>
                  <p>
                    <strong>SECTION 2. SCOPE:</strong> This order covers all residential care facilities, regional centers, specialized care facilities, and SWAD satellite offices.
                  </p>
                  <p className="text-slate-500 italic text-[11px]">
                    [Official authenticated copy - Total {issuanceItem.pageCount} pages available for offline study]
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onDownload();
                onClose();
              }}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
