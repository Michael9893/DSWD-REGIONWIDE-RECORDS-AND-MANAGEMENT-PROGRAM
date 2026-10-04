import React, { useState } from 'react';
import { 
  BarChart3, 
  Trash2, 
  FileCheck2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ShieldAlert, 
  Send, 
  Check, 
  X, 
  Search, 
  Filter, 
  Building, 
  User, 
  Calendar, 
  ArrowUpRight, 
  Layers, 
  FileSpreadsheet, 
  PlusCircle, 
  Sparkles,
  ExternalLink,
  KeyRound,
  FileText
} from 'lucide-react';
import { 
  AccessRequest, 
  DisposalBatch, 
  DigitizationFacilityMetric, 
  LogisticsDelivery 
} from '../types';

interface ExecutiveDashboardProps {
  requests: AccessRequest[];
  disposalBatches: DisposalBatch[];
  digitizationData: DigitizationFacilityMetric[];
  deliveries: LogisticsDelivery[];
  onApproveRequest: (requestId: string, notes?: string, validityHours?: number) => void;
  onDenyRequest: (requestId: string, reason: string) => void;
  onOpenNewDisposalModal: () => void;
  onSignDisposalBatch: (batchId: string) => void;
  onOpenLogisticsModule: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  requests,
  disposalBatches,
  digitizationData,
  deliveries,
  onApproveRequest,
  onDenyRequest,
  onOpenNewDisposalModal,
  onSignDisposalBatch,
  onOpenLogisticsModule
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'disposal' | 'digitization'>('requests');
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('pending');
  const [selectedRequestForReview, setSelectedRequestForReview] = useState<AccessRequest | null>(null);
  const [denyReason, setDenyReason] = useState('');
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('Approved for verified official casework audit.');
  const [validityHours, setValidityHours] = useState(48);
  const [showApproveModal, setShowApproveModal] = useState(false);

  // 1. Calculate Total Submitted for Disposal:
  // Volume physically awaiting shredding/destruction schedules
  const awaitingShreddingBatches = disposalBatches.filter(
    (b) => b.status === 'Scheduled for Shredding' || b.status === 'Awaiting NAP Inspection'
  );
  const totalWeightSubmittedForDisposal = awaitingShreddingBatches.reduce((acc, b) => acc + b.weightKg, 0);
  const totalBoxesSubmittedForDisposal = awaitingShreddingBatches.reduce((acc, b) => acc + b.totalBoxes, 0);

  // 2. Calculate Total Pending Request for Disposal:
  // Official operational requests from centers awaiting final management signature
  const pendingDisposalRequests = disposalBatches.filter(
    (b) => b.status === 'Pending Management Signature'
  );
  const totalPendingDisposalRequestsCount = pendingDisposalRequests.length;
  const pendingDisposalWeight = pendingDisposalRequests.reduce((acc, b) => acc + b.weightKg, 0);

  // 3. Calculate Total Digitized Files:
  // Counter indicating successfully scanned and uploaded historical records
  const totalDigitizedFilesCount = digitizationData.reduce((acc, d) => acc + d.digitizedRecords, 0);
  const totalTargetRecords = digitizationData.reduce((acc, d) => acc + d.targetRecords, 0);
  const overallDigitizationRate = totalTargetRecords > 0 
    ? ((totalDigitizedFilesCount / totalTargetRecords) * 100).toFixed(1) 
    : '0.0';

  // Active Messenger in-transit dispatches
  const activeMessengerDispatches = deliveries.filter(
    (d) => d.status === 'In Transit' || d.status === 'Dispatched'
  ).length;

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    if (requestFilter === 'all') return true;
    return r.status === requestFilter;
  });

  const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length;

  const handleConfirmApproval = () => {
    if (!selectedRequestForReview) return;
    onApproveRequest(selectedRequestForReview.id, approvalNotes, validityHours);
    setShowApproveModal(false);
    setSelectedRequestForReview(null);
  };

  const handleConfirmDenial = () => {
    if (!selectedRequestForReview) return;
    onDenyRequest(selectedRequestForReview.id, denyReason || 'Request does not fulfill official verification prerequisites.');
    setShowDenyModal(false);
    setSelectedRequestForReview(null);
    setDenyReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Executive Identity - Clean Light Card */}
      <div className="bg-white text-slate-900 rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Executive Monitoring Dashboard (Admin / Management View)
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded">
              Live Regional Aggregation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Real-time executive oversight of regional center records status, National Archives (NAP) disposal pipelines, digitized archives, and access authorization requests.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onOpenNewDisposalModal}
            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Endorse Disposal Batch</span>
          </button>
          <button
            onClick={onOpenLogisticsModule}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Logistics Tracker</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Real-time Metrics Dashboard: Visual Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Submitted for Disposal */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Submitted for Disposal
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200/60">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {totalWeightSubmittedForDisposal.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-slate-600">kg</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <strong>{totalBoxesSubmittedForDisposal} archival boxes</strong> physically awaiting NAP shredding/destruction schedules.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>NAP Clearances: {awaitingShreddingBatches.length} batches</span>
            <span className="text-amber-700 font-medium">Scheduled CY 2026</span>
          </div>
        </div>

        {/* Metric 2: Total Pending Request for Disposal */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Pending Disposal Requests
            </span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-lg border border-rose-200/60">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-700 tracking-tight">
                {totalPendingDisposalRequestsCount}
              </span>
              <span className="text-sm font-semibold text-slate-600">batches</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Official operational requests from centers awaiting final management signature ({pendingDisposalWeight.toLocaleString()} kg).
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Requires Regional Director Sign-Off</span>
            <button
              onClick={() => setActiveTab('disposal')}
              className="text-blue-700 hover:underline font-semibold cursor-pointer"
            >
              Review Batches &rarr;
            </button>
          </div>
        </div>

        {/* Metric 3: Total Digitized Files */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Total Digitized Files
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200/60">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tracking-tight">
                {totalDigitizedFilesCount.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                {overallDigitizationRate}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Successfully scanned and indexed historical records across 6 facilities.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Target: {totalTargetRecords.toLocaleString()}</span>
            <button
              onClick={() => setActiveTab('digitization')}
              className="text-blue-700 hover:underline font-semibold cursor-pointer"
            >
              Center Details &rarr;
            </button>
          </div>
        </div>

        {/* Metric 4: Access Requests / Messenger Dispatches */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Access Requests Queue
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200/60">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {pendingRequestsCount}
              </span>
              <span className="text-sm font-semibold text-slate-500">pending</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Restricted RCSO document requests requiring administrative authorization.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Active Messengers: {activeMessengerDispatches}</span>
            <button
              onClick={() => setActiveTab('requests')}
              className="text-blue-700 hover:underline font-semibold cursor-pointer"
            >
              Action Panel &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Tabs navigation for Module B */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="border-b border-slate-200 px-4 py-2 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'requests'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>Access Request Management Panel</span>
              {pendingRequestsCount > 0 && (
                <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                  activeTab === 'requests' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
                }`}>
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('disposal')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'disposal'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>Disposal Monitoring &amp; Signatures</span>
              {totalPendingDisposalRequestsCount > 0 && (
                <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                  activeTab === 'disposal' ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
                }`}>
                  {totalPendingDisposalRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('digitization')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'digitization'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>Digitization Progress by Facility</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            <span>DSWD Regional Records Section · Executive Oversight</span>
          </div>
        </div>

        {/* Tab 1: Access Request Management Panel */}
        {activeTab === 'requests' && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Filter Pill Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-slate-500 mr-1">Filter Status:</span>
                <button
                  onClick={() => setRequestFilter('pending')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    requestFilter === 'pending'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Pending Review ({pendingRequestsCount})
                </button>
                <button
                  onClick={() => setRequestFilter('approved')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    requestFilter === 'approved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Approved ({requests.filter(r => r.status === 'approved').length})
                </button>
                <button
                  onClick={() => setRequestFilter('denied')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    requestFilter === 'denied'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Denied ({requests.filter(r => r.status === 'denied').length})
                </button>
                <button
                  onClick={() => setRequestFilter('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    requestFilter === 'all'
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({requests.length})
                </button>
              </div>

              <div className="text-xs text-slate-500">
                Action requires administrator authority
              </div>
            </div>

            {/* Requests List */}
            <div className="space-y-3">
              {filteredRequests.length === 0 ? (
                <div className="py-12 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-slate-700 font-semibold text-sm">
                    No requests found in this view
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    All center requests for restricted documents have been addressed.
                  </p>
                </div>
              ) : (
                filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-3"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {req.trackingCode}
                          </span>
                          {req.status === 'pending' && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Awaiting Executive Decision
                            </span>
                          )}
                          {req.status === 'approved' && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              Approved · Active Link Dispatched
                            </span>
                          )}
                          {req.status === 'denied' && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              Access Denied
                            </span>
                          )}
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-500">
                            Submitted {new Date(req.submittedAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="pt-0.5">
                          <div className="text-xs font-semibold text-rose-800">
                            Target Issuance: {req.issuanceNumber}
                          </div>
                          <div className="text-sm font-bold text-slate-900 leading-snug">
                            {req.issuanceTitle}
                          </div>
                        </div>

                        {/* Requester Identity */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Requester:</span>
                            <span className="font-bold text-slate-900">{req.fullName}</span>
                            <div className="text-slate-500">{req.position}</div>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Center / Station:</span>
                            <span className="font-semibold text-slate-900">{req.centerOffice}</span>
                            <div className="text-blue-800 font-mono text-[11px]">{req.dswdEmail}</div>
                          </div>
                        </div>

                        {/* Stated Purpose */}
                        <div className="text-xs text-slate-700 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                          <strong className="text-amber-950 font-semibold">Official Stated Purpose:</strong>{' '}
                          <span>{req.purpose}</span>
                        </div>

                        {/* Reviewer notes if approved or denied */}
                        {req.adminNotes && (
                          <div className="text-xs text-slate-600 flex items-start gap-1.5 pt-1">
                            <span className="font-semibold text-slate-800">Decision Notes:</span>
                            <span>{req.adminNotes}</span>
                          </div>
                        )}

                        {/* Active Token Details if Approved */}
                        {req.secureToken && (
                          <div className="text-xs text-emerald-900 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex flex-wrap items-center justify-between gap-2">
                            <span>
                              <strong>Secure Token:</strong> <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-bold">{req.secureToken}</code>
                            </span>
                            <span>
                              Expires: {req.tokenExpiresAt ? new Date(req.tokenExpiresAt).toLocaleString() : 'Active'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons: Standard [Approve] and [Deny] */}
                      {req.status === 'pending' && (
                        <div className="flex md:flex-col items-center gap-2 flex-shrink-0 self-end md:self-center">
                          <button
                            onClick={() => {
                              setSelectedRequestForReview(req);
                              setShowApproveModal(true);
                            }}
                            className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Access</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequestForReview(req);
                              setShowDenyModal(true);
                            }}
                            className="px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Deny Request</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Disposal Monitoring & Signatures */}
        {activeTab === 'disposal' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Regional Records Disposal Batches &amp; National Archives Endorsement
                </h3>
                <p className="text-xs text-slate-500">
                  Monitor linear volume of records scheduled for pulping/shredding across all residential centers.
                </p>
              </div>
              <button
                onClick={onOpenNewDisposalModal}
                className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit New Center Disposal Request</span>
              </button>
            </div>

            {disposalBatches.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
                <Trash2 className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">No Disposal Batches Submitted Yet</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    No physical records are currently queued for destruction. Center custodians can endorse inventory batches (NAP Form 1) to schedule National Archives shredding.
                  </p>
                </div>
                <button
                  onClick={onOpenNewDisposalModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Submit First Disposal Request</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="p-3">Batch Number</th>
                      <th className="p-3">Center / Facility</th>
                      <th className="p-3">Record Series &amp; Years</th>
                      <th className="p-3">Volume &amp; Boxes</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">NAP Clearance / Destruction</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {disposalBatches.map((batch) => (
                      <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                          {batch.batchNumber}
                        </td>
                        <td className="p-3 font-medium text-slate-900">
                          {batch.centerOffice}
                          <div className="text-[11px] text-slate-500">Custodian: {batch.custodianName}</div>
                        </td>
                        <td className="p-3 max-w-xs">
                          <span className="text-slate-800 font-medium">{batch.recordSeries}</span>
                          <div className="text-[11px] text-slate-500">Years: {batch.inclusiveYears}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="font-bold text-slate-900">{batch.weightKg.toLocaleString()} kg</span>
                          <div className="text-[11px] text-slate-500">{batch.totalBoxes} boxes</div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {batch.status === 'Pending Management Signature' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                              Pending Signature
                            </span>
                          )}
                          {batch.status === 'Scheduled for Shredding' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                              Scheduled for Shredding
                            </span>
                          )}
                          {batch.status === 'Disposed & Certified' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Disposed &amp; Certified
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[11px] text-slate-600">
                          {batch.napClearanceNo ? (
                            <div>
                              <span className="font-mono text-blue-800 font-semibold">{batch.napClearanceNo}</span>
                              <div>Date: {batch.scheduledDestructionDate}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Awaiting clearance endorsement</span>
                          )}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          {batch.status === 'Pending Management Signature' ? (
                            <button
                              onClick={() => onSignDisposalBatch(batch.id)}
                              className="px-3 py-1.5 text-xs font-semibold bg-blue-800 hover:bg-blue-900 text-white rounded-md transition-colors cursor-pointer"
                            >
                              Sign &amp; Endorse to NAP
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400">Signed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Digitization Progress by Facility */}
        {activeTab === 'digitization' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Historical Records Digitization Status by Facility
              </h3>
              <p className="text-xs text-slate-500">
                Tracking scanning, OCR indexing, and secure archival upload progress against regional annual targets.
              </p>
            </div>

            {digitizationData.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
                <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">No Digitization Records Logged Yet</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    No regional facilities have submitted their scanning metrics. Upload or record historical record digitization progress across centers.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {digitizationData.map((facility) => (
                  <div 
                    key={facility.centerOffice}
                    className="bg-white border border-slate-200 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {facility.centerOffice}
                        </h4>
                        <div className="text-[11px] text-slate-500">
                          Last sync: {facility.lastUploadDate}
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-blue-900 font-mono">
                        {facility.completionRate}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          facility.completionRate >= 90 
                            ? 'bg-emerald-600' 
                            : facility.completionRate >= 75 
                            ? 'bg-blue-600' 
                            : 'bg-amber-600'
                        }`}
                        style={{ width: `${facility.completionRate}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-slate-200/80">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Scanned &amp; Uploaded</span>
                        <strong className="text-emerald-700">{facility.digitizedRecords.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Pending Physical</span>
                        <strong className="text-amber-700">{facility.pendingPhysicalRecords.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Total Target</span>
                        <strong className="text-slate-800">{facility.targetRecords.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Approve Request */}
      {showApproveModal && selectedRequestForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-800">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Approve Restricted Document Access
                </h3>
                <p className="text-xs text-slate-500">
                  Issue time-sensitive token to {selectedRequestForReview.fullName}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 border border-slate-200">
              <div><strong>Document:</strong> {selectedRequestForReview.issuanceNumber}</div>
              <div><strong>Recipient Email:</strong> {selectedRequestForReview.dswdEmail}</div>
              <div><strong>Stated Purpose:</strong> {selectedRequestForReview.purpose}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Link Validity Duration:
              </label>
              <select
                value={validityHours}
                onChange={(e) => setValidityHours(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600"
              >
                <option value={24}>24 Hours (Strict Confidential)</option>
                <option value={48}>48 Hours (Standard Operational)</option>
                <option value={72}>72 Hours (Extended Casework)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Executive Endorsement Note / Audit Comment:
              </label>
              <textarea
                rows={2}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
              *Upon clicking Confirm, the system dynamically dispatches an automated notification email containing the secured, time-sensitive download link to {selectedRequestForReview.dswdEmail}.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproval}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm &amp; Dispatch Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Deny Request */}
      {showDenyModal && selectedRequestForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-100 rounded-lg text-rose-800">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Deny Document Access Request
                </h3>
                <p className="text-xs text-slate-500">
                  Request: {selectedRequestForReview.trackingCode}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Denial (Official Feedback to Center Custodian):
              </label>
              <textarea
                rows={3}
                placeholder="State why this access request is declined (e.g. requires division chief endorsement letter, incorrect jurisdiction)..."
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-600 resize-none"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDenyModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDenial}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Confirm Denial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
