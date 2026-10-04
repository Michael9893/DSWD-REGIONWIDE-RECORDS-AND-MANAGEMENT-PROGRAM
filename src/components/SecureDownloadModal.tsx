import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  ExternalLink,
  FileText,
  KeyRound,
  Building
} from 'lucide-react';
import { AccessRequest, Issuance } from '../types';

interface SecureDownloadModalProps {
  initialToken?: string;
  requests: AccessRequest[];
  issuances: Issuance[];
  onClose: () => void;
  onRecordDownload: (requestId: string) => void;
}

export const SecureDownloadModal: React.FC<SecureDownloadModalProps> = ({
  initialToken = '',
  requests,
  issuances,
  onClose,
  onRecordDownload
}) => {
  const [tokenInput, setTokenInput] = useState(initialToken);
  const [activeRequest, setActiveRequest] = useState<AccessRequest | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Automatically lookup if initialToken is provided
  useEffect(() => {
    if (initialToken) {
      verifyToken(initialToken);
    }
  }, [initialToken, requests]);

  const verifyToken = (code: string) => {
    setErrorMsg(null);
    const clean = code.trim().toUpperCase();
    if (!clean) {
      setErrorMsg('Please enter a valid Access Token or Request Tracking Code.');
      return;
    }

    const found = requests.find(
      (r) => (r.secureToken && r.secureToken.toUpperCase() === clean) ||
             (r.trackingCode && r.trackingCode.toUpperCase() === clean)
    );

    if (!found) {
      setErrorMsg('No record found matching this token. Please check your official DSWD notification email or verify the code.');
      setActiveRequest(null);
      return;
    }

    if (found.status === 'pending') {
      setErrorMsg(`Request ${found.trackingCode} is currently PENDING review by the Regional Records Section.`);
      setActiveRequest(found);
      return;
    }

    if (found.status === 'denied') {
      setErrorMsg(`Request ${found.trackingCode} was DENIED by the reviewer. Reason: ${found.adminNotes || 'Insufficient justification'}`);
      setActiveRequest(found);
      return;
    }

    // Check expiration
    if (found.tokenExpiresAt) {
      const expires = new Date(found.tokenExpiresAt).getTime();
      const now = new Date().getTime();
      if (now > expires) {
        setErrorMsg('This secured download link has EXPIRED. In compliance with DSWD security protocols, please submit a renewed access request.');
        setActiveRequest(found);
        return;
      }
    }

    setActiveRequest(found);
  };

  const handleDownload = () => {
    if (!activeRequest) return;
    onRecordDownload(activeRequest.id);
    setDownloadSuccess(true);

    // Simulate downloading an authenticated PDF file with a dynamic blob
    const content = `================================================================================
REPUBLIC OF THE PHILIPPINES
DEPARTMENT OF SOCIAL WELFARE AND DEVELOPMENT
REGIONAL RECORDS AND ARCHIVES SECTION
================================================================================
OFFICIAL RESTRICTED DOCUMENT CLEARANCE & SECURED DELIVERY

DOCUMENT: ${activeRequest.issuanceNumber}
TITLE: ${activeRequest.issuanceTitle}

AUTHORIZED CLEARANCE DETAILS:
--------------------------------------------------------------------------------
Authorized Recipient: ${activeRequest.fullName}
Position / Designation: ${activeRequest.position}
Center / Operating Unit: ${activeRequest.centerOffice}
Official Email: ${activeRequest.dswdEmail}
Access Request Tracking: ${activeRequest.trackingCode}
Security Authorization Token: ${activeRequest.secureToken}
Approved By: ${activeRequest.reviewedBy || 'Regional Director / Records Head'}
Timestamp Authorized: ${activeRequest.reviewedAt || new Date().toISOString()}
Security Protocol: Classified Custody under DSWD Memorandum Circular No. 04
Watermark: CONFIDENTIAL - OFFICIAL DSWD USE ONLY - UNLAWFUL DISTRIBUTION PROHIBITED
--------------------------------------------------------------------------------

SUMMARY & POLICY DIRECTIVES:
This issuance contains confidential guidelines for authorized personnel only.
Any duplication, dissemination, or transmission without written authority
violates Republic Act No. 10173 (Data Privacy Act of 2012) and Civil Service Rules.

================================================================================
Generated and Authenticated via DSWD Regionwide Records Portal (CY 2026)
================================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeRequest.issuanceNumber.replace(/[^a-zA-Z0-9]/g, '_')}_AUTHENTICATED.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    if (!activeRequest?.secureToken) return;
    const url = `${window.location.origin}?token=${activeRequest.secureToken}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Find linked issuance
  const matchedIssuance = activeRequest 
    ? issuances.find(i => i.id === activeRequest.issuanceId) 
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header - Clean Light Styling */}
        <div className="bg-slate-50 text-slate-900 p-5 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                Secure Link Verification Terminal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated Delivery &amp; Time-Sensitive Download Center
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

        <div className="p-6 space-y-5">
          {/* Token Search Bar */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              <span>Enter Security Token or Request Tracking Code</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. SEC-DSWD-8492-9F1C or REQ-2026-0194"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-mono tracking-wider uppercase focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => verifyToken(tokenInput)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Validate Token
              </button>
            </div>
          </div>

          {/* Error / Alert Message */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Security Alert</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Successful Validation Details */}
          {activeRequest && activeRequest.status === 'approved' && (
            <div className="space-y-4">
              {/* Authenticated Clearance Banner */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-xs uppercase tracking-wider">
                      Clearance Verified &amp; Active
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-200/70 text-emerald-900 rounded">
                    AUTHENTICATED
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {activeRequest.issuanceNumber}
                  </h3>
                  <p className="text-xs text-slate-700 leading-snug">
                    {activeRequest.issuanceTitle}
                  </p>
                </div>

                {/* Expiration and Recipient Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-emerald-200 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Authorized Personnel:</span>
                    <strong className="text-slate-800">{activeRequest.fullName}</strong>
                    <div className="text-[11px] text-slate-500">{activeRequest.position}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Center / Station:</span>
                    <strong className="text-slate-800">{activeRequest.centerOffice}</strong>
                    <div className="text-[11px] text-slate-500">{activeRequest.dswdEmail}</div>
                  </div>
                </div>

                {/* Countdown / Expiration Pill */}
                <div className="flex items-center gap-2 text-xs text-amber-900 bg-amber-100/70 p-2 rounded-lg border border-amber-300/50">
                  <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>
                    <strong>Time-Sensitive Link:</strong> Active until{' '}
                    {activeRequest.tokenExpiresAt ? new Date(activeRequest.tokenExpiresAt).toLocaleString() : '48 Hours'}
                  </span>
                </div>
              </div>

              {/* Watermark Notice */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                Notice: All downloaded files are dynamically watermarked with your official email ({activeRequest.dswdEmail}) and IP timestamp for security and auditing purposes.
              </div>

              {/* Download Action */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  onClick={handleDownload}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Authorized RCSO Package</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto py-2.5 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Copy permanent verification link"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Token Link'}</span>
                </button>
              </div>

              {downloadSuccess && (
                <p className="text-xs text-center text-emerald-700 font-semibold animate-in fade-in">
                  Package downloaded successfully. Access count: {activeRequest.downloadAccessCount + 1}.
                </p>
              )}
            </div>
          )}

          {/* Quick Demo Helper */}
          <div className="bg-slate-100/80 rounded-xl p-3 text-xs text-slate-600 border border-slate-200 space-y-1.5">
            <span className="font-semibold text-slate-700 block">Sample Tokens Available for Testing:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setTokenInput('SEC-DSWD-8492-9F1C'); verifyToken('SEC-DSWD-8492-9F1C'); }}
                className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-[11px] hover:border-blue-500 hover:text-blue-800 cursor-pointer"
              >
                SEC-DSWD-8492-9F1C (Approved)
              </button>
              <button
                onClick={() => { setTokenInput('REQ-2026-0201'); verifyToken('REQ-2026-0201'); }}
                className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-[11px] hover:border-blue-500 hover:text-blue-800 cursor-pointer"
              >
                REQ-2026-0201 (Pending Review)
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
