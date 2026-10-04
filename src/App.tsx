import React, { useState, useEffect } from 'react';
import { 
  INITIAL_FORMS, 
  INITIAL_ISSUANCES, 
  SAMPLE_FORMS,
  SAMPLE_ISSUANCES,
  INITIAL_REQUESTS, 
  INITIAL_DISPOSAL_BATCHES, 
  INITIAL_DIGITIZATION_DATA, 
  INITIAL_DELIVERIES, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { 
  DocumentForm, 
  Issuance, 
  AccessRequest, 
  DisposalBatch, 
  DigitizationFacilityMetric, 
  LogisticsDelivery, 
  NotificationItem,
  DeliveryStatus 
} from './types';
import { RamsHeroBanner } from './components/RamsHeroBanner';
import { FormsRepository } from './components/FormsRepository';
import { IssuancesRepository } from './components/IssuancesRepository';
import { UploadDocumentModal } from './components/UploadDocumentModal';
import { AccessRequestModal } from './components/AccessRequestModal';
import { SecureDownloadModal } from './components/SecureDownloadModal';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { DisposalManagementModal } from './components/DisposalManagementModal';
import { LogisticsTracker } from './components/LogisticsTracker';
import { NewDispatchModal } from './components/NewDispatchModal';
import { DeliveryDetailModal } from './components/DeliveryDetailModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { 
  CheckCircle, 
  AlertTriangle, 
  Bell, 
  X, 
  ExternalLink,
  ShieldCheck,
  Building2,
  FileText,
  Truck,
  BarChart3,
  KeyRound,
  Upload,
  Info
} from 'lucide-react';

const STORAGE_FORMS_KEY = 'rams_portal_forms_empty_v1';
const STORAGE_ISSUANCES_KEY = 'rams_portal_issuances_empty_v1';
const STORAGE_REQUESTS_KEY = 'rams_portal_requests_empty_v1';
const STORAGE_DISPOSAL_KEY = 'rams_portal_disposal_empty_v1';
const STORAGE_DELIVERIES_KEY = 'rams_portal_deliveries_empty_v1';

export default function App() {
  // Navigation views: 'public' or 'executive'
  const [activeView, setActiveView] = useState<'public' | 'executive'>('public');
  const [activeModuleTab, setActiveModuleTab] = useState<'forms' | 'issuances' | 'logistics'>('forms');
  const [navbarCategoryFilter, setNavbarCategoryFilter] = useState<string>('All');
  const [navbarIssuanceTypeFilter, setNavbarIssuanceTypeFilter] = useState<string>('All');

  // Core Data States: 100% EMPTY by default per user request
  const [forms, setForms] = useState<DocumentForm[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FORMS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [issuances, setIssuances] = useState<Issuance[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ISSUANCES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [requests, setRequests] = useState<AccessRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REQUESTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [disposalBatches, setDisposalBatches] = useState<DisposalBatch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DISPOSAL_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [digitizationData, setDigitizationData] = useState<DigitizationFacilityMetric[]>(INITIAL_DIGITIZATION_DATA);

  const [deliveries, setDeliveries] = useState<LogisticsDelivery[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DELIVERIES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FORMS_KEY, JSON.stringify(forms));
    } catch (e) {
      console.error('Failed to save forms', e);
    }
  }, [forms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ISSUANCES_KEY, JSON.stringify(issuances));
    } catch (e) {
      console.error('Failed to save issuances', e);
    }
  }, [issuances]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(requests));
    } catch (e) {
      console.error('Failed to save requests', e);
    }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DISPOSAL_KEY, JSON.stringify(disposalBatches));
    } catch (e) {
      console.error('Failed to save disposal batches', e);
    }
  }, [disposalBatches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DELIVERIES_KEY, JSON.stringify(deliveries));
    } catch (e) {
      console.error('Failed to save deliveries', e);
    }
  }, [deliveries]);

  // Modal Dialog States
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadModalType, setUploadModalType] = useState<'form' | 'issuance'>('form');
  const [accessRequestTarget, setAccessRequestTarget] = useState<Issuance | null>(null);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [activeTokenCode, setActiveTokenCode] = useState('');
  const [disposalModalOpen, setDisposalModalOpen] = useState(false);
  const [newDispatchModalOpen, setNewDispatchModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<LogisticsDelivery | null>(null);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [previewFormItem, setPreviewFormItem] = useState<DocumentForm | null>(null);
  const [previewIssuanceItem, setPreviewIssuanceItem] = useState<Issuance | null>(null);

  // Real-time toast alert state
  const [bannerAlert, setBannerAlert] = useState<{
    id: string;
    type: 'success' | 'info' | 'warning';
    title: string;
    message: string;
    actionLabel?: string;
    actionToken?: string;
  } | null>(null);

  // Check URL query parameters for ?token= on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setActiveTokenCode(token);
      setTokenModalOpen(true);
    }
  }, []);

  const triggerToast = (
    title: string, 
    message: string, 
    type: 'success' | 'info' | 'warning' = 'info', 
    actionLabel?: string, 
    actionToken?: string
  ) => {
    const id = Date.now().toString();
    setBannerAlert({ id, type, title, message, actionLabel, actionToken });
    setTimeout(() => {
      setBannerAlert((prev) => (prev?.id === id ? null : prev));
    }, 7000);
  };

  // Add Uploaded Form / Template
  const handleAddForm = (newForm: DocumentForm) => {
    setForms((prev) => [newForm, ...prev]);
    setActiveView('public');
    setActiveModuleTab('forms');
    triggerToast(
      'Template Uploaded Successfully',
      `"${newForm.title}" (${newForm.code}) is now live on the RAMS Portal for all regional centers.`,
      'success'
    );
  };

  // Add Uploaded Issuance / RCSO
  const handleAddIssuance = (newIssuance: Issuance) => {
    setIssuances((prev) => [newIssuance, ...prev]);
    setActiveView('public');
    setActiveModuleTab('issuances');
    triggerToast(
      'Issuance Published Successfully',
      `"${newIssuance.number}" (${newIssuance.accessClassification}) is now published to the repository.`,
      'success'
    );
  };

  // Delete Form
  const handleDeleteForm = (formId: string) => {
    setForms((prev) => prev.filter((f) => f.id !== formId));
    triggerToast('Template Removed', 'Selected template was removed from the repository.', 'info');
  };

  // Delete Issuance
  const handleDeleteIssuance = (issuanceId: string) => {
    setIssuances((prev) => prev.filter((i) => i.id !== issuanceId));
    triggerToast('Issuance Removed', 'Selected issuance was removed from the repository.', 'info');
  };

  // Optional: Load sample data if requested by user for demo/testing
  const handleLoadSampleForms = () => {
    setForms(SAMPLE_FORMS);
    triggerToast('Sample Templates Loaded', 'Loaded standard NAP Annex templates for testing.', 'info');
  };

  const handleLoadSampleIssuances = () => {
    setIssuances(SAMPLE_ISSUANCES);
    triggerToast('Sample Issuances Loaded', 'Loaded standard Circulars & Restricted RCSO orders for testing.', 'info');
  };

  // 1. Submit Access Request for Restricted Document (Module A)
  const handleSubmitAccessRequest = (
    data: Omit<AccessRequest, 'id' | 'trackingCode' | 'submittedAt' | 'status' | 'downloadAccessCount'>
  ) => {
    const trackingCode = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: AccessRequest = {
      ...data,
      id: `req-${Date.now()}`,
      trackingCode,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      downloadAccessCount: 0
    };

    setRequests((prev) => [newRequest, ...prev]);
    setAccessRequestTarget(null);

    // Add alert notification for Admin
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Restricted Access Request',
      message: `${data.fullName} (${data.centerOffice}) requested access to ${data.issuanceNumber}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'new_request',
      trackingCode
    };
    setNotifications((prev) => [newNotif, ...prev]);

    triggerToast(
      'Access Request Filed Successfully',
      `Tracking Code: ${trackingCode}. Routed to the Records Section (AD-RAMS) for review.`,
      'success'
    );
  };

  // 2. Approve Access Request in Executive Dashboard (Module B)
  const handleApproveRequest = (requestId: string, notes?: string, validityHours = 48) => {
    const target = requests.find((r) => r.id === requestId);
    if (!target) return;

    const secureToken = `SEC-DSWD-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + validityHours * 60 * 60 * 1000).toISOString();

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'approved',
              reviewedBy: 'Atty. Victoriano Ramos (Regional Director / AD-RAMS)',
              reviewedAt: new Date().toISOString(),
              adminNotes: notes || 'Approved for verified official casework audit.',
              secureToken,
              tokenExpiresAt: expiresAt
            }
          : r
      )
    );

    // Create Automated Delivery Notification
    const notifItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Automated Delivery: Restricted RCSO Approved',
      message: `Access to ${target.issuanceNumber} granted for ${target.fullName}. A secured, time-sensitive download link (valid for ${validityHours}h) has been dispatched to ${target.dswdEmail}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'access_approved',
      secureToken,
      trackingCode: target.trackingCode,
      issuanceTitle: target.issuanceTitle,
      recipientEmail: target.dswdEmail
    };

    setNotifications((prev) => [notifItem, ...prev]);

    triggerToast(
      'Request Approved & Secure Link Dispatched',
      `Secured link for ${target.fullName} generated. Dispatched to ${target.dswdEmail}.`,
      'success',
      'Open Secure Link',
      secureToken
    );
  };

  // 3. Deny Request
  const handleDenyRequest = (requestId: string, reason: string) => {
    const target = requests.find((r) => r.id === requestId);
    if (!target) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'denied',
              reviewedBy: 'Records Section Management',
              reviewedAt: new Date().toISOString(),
              adminNotes: reason
            }
          : r
      )
    );

    const notifItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Access Request Denied',
      message: `Request ${target.trackingCode} for ${target.issuanceNumber} was denied. Reason: ${reason}`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'access_denied',
      trackingCode: target.trackingCode
    };

    setNotifications((prev) => [notifItem, ...prev]);

    triggerToast(
      'Request Denied',
      `Request ${target.trackingCode} marked as denied with feedback notes.`,
      'warning'
    );
  };

  // 4. Sign and endorse disposal batch
  const handleSignDisposalBatch = (batchId: string) => {
    const clearanceCode = `NAP-AUTH-2026-${Math.floor(100 + Math.random() * 900)}`;
    setDisposalBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              status: 'Scheduled for Shredding',
              napClearanceNo: clearanceCode,
              scheduledDestructionDate: '2026-11-15'
            }
          : b
      )
    );

    triggerToast(
      'Batch Endorsed & NAP Clearance Issued',
      `Clearance #${clearanceCode} issued. Scheduled for high-volume shredding on Nov 15, 2026.`,
      'success'
    );
  };

  // 5. Submit new disposal batch
  const handleSubmitDisposalBatch = (
    batch: Omit<DisposalBatch, 'id' | 'batchNumber' | 'status' | 'submittedDate'>
  ) => {
    const batchNumber = `DISP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBatch: DisposalBatch = {
      ...batch,
      id: `disp-${Date.now()}`,
      batchNumber,
      status: 'Pending Management Signature',
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setDisposalBatches((prev) => [newBatch, ...prev]);
    setDisposalModalOpen(false);

    triggerToast(
      'Disposal Batch Submitted',
      `Batch ${batchNumber} (${batch.weightKg.toLocaleString()} kg) is awaiting Regional Director sign-off.`,
      'info'
    );
  };

  // 6. Submit new messenger dispatch (Module C)
  const handleSubmitDispatch = (
    dispatch: Omit<LogisticsDelivery, 'id' | 'trackingNumber' | 'status' | 'dispatchedAt' | 'checkpoints'>
  ) => {
    const trackingNumber = `DSWD-LOG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDelivery: LogisticsDelivery = {
      ...dispatch,
      id: `del-${Date.now()}`,
      trackingNumber,
      status: 'Dispatched',
      dispatchedAt: new Date().toISOString(),
      checkpoints: [
        {
          id: `cp-${Date.now()}`,
          timestamp: new Date().toISOString(),
          location: 'Field Office Central Records Outbound Dock',
          statusNote: 'Envelope sealed with security tape and handed over to courier.',
          recordedBy: 'Records Dispatcher'
        }
      ]
    };

    setDeliveries((prev) => [newDelivery, ...prev]);
    setNewDispatchModalOpen(false);

    triggerToast(
      'Document Dispatch Logged',
      `Tracking #${trackingNumber} assigned to ${dispatch.assignedMessenger}.`,
      'success'
    );
  };

  // 7. Update delivery checkpoint / status
  const handleUpdateDeliveryStatus = (
    deliveryId: string, 
    newStatus: DeliveryStatus, 
    checkpointNote: string, 
    location: string, 
    recipientName?: string
  ) => {
    const receiptNo = newStatus === 'Delivered & Acknowledged' 
      ? `AR-2026-${Math.floor(1000 + Math.random() * 9000)}` 
      : undefined;

    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id !== deliveryId) return d;

        const updatedCheckpoints = [
          ...d.checkpoints,
          {
            id: `cp-${Date.now()}`,
            timestamp: new Date().toISOString(),
            location,
            statusNote: checkpointNote,
            recordedBy: `Messenger Handover (${d.assignedMessenger})`
          }
        ];

        return {
          ...d,
          status: newStatus,
          checkpoints: updatedCheckpoints,
          actualDeliveredAt: newStatus === 'Delivered & Acknowledged' ? new Date().toISOString() : d.actualDeliveredAt,
          receivedByName: recipientName || d.receivedByName,
          acknowledgmentReceiptNo: receiptNo || d.acknowledgmentReceiptNo
        };
      })
    );

    if (selectedDelivery && selectedDelivery.id === deliveryId) {
      setSelectedDelivery((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              actualDeliveredAt: newStatus === 'Delivered & Acknowledged' ? new Date().toISOString() : prev.actualDeliveredAt,
              receivedByName: recipientName || prev.receivedByName,
              acknowledgmentReceiptNo: receiptNo || prev.acknowledgmentReceiptNo,
              checkpoints: [
                ...prev.checkpoints,
                {
                  id: `cp-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  location,
                  statusNote: checkpointNote,
                  recordedBy: 'Courier Update'
                }
              ]
            }
          : null
      );
    }

    triggerToast(
      'Transit Checkpoint Recorded',
      `Status updated to "${newStatus}" at ${location}.`,
      'info'
    );
  };

  // 8. Record download
  const handleRecordDownload = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, downloadAccessCount: r.downloadAccessCount + 1 } : r
      )
    );
  };

  const handleDownloadForm = (form: DocumentForm) => {
    setForms((prev) =>
      prev.map((f) => (f.id === form.id ? { ...f, downloads: f.downloads + 1 } : f))
    );

    const content = `DEPARTMENT OF SOCIAL WELFARE AND DEVELOPMENT
ADMINISTRATIVE DIVISION - RECORDS AND ARCHIVES MANAGEMENT SECTION (AD-RAMS)
RAMS PORTAL (CY 2026)
--------------------------------------------------------------------------------
DOCUMENT TEMPLATE: ${form.code}
TITLE: ${form.title}
CATEGORY: ${form.category}
VERSION: ${form.version}
ISSUED BY: ${form.issuingUnit}

MANDATORY INSTRUCTIONS FOR DSWD REGIONAL CENTERS:
This is an authorized template aligned with the National Archives of the Philippines (NAP)
General Records Disposal Schedules and DSWD Department Orders.

Please complete this template in offline mode and retain one authenticated wet-ink copy
at your center archives before submitting electronic transmittals.
--------------------------------------------------------------------------------`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.code}_TEMPLATE.${form.fileType.toLowerCase() === 'xlsx' ? 'csv' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      {/* Toast Notification Banner - Light & Crisp */}
      {bannerAlert && (
        <div className="fixed top-4 right-4 z-50 max-w-md w-full animate-in slide-in-from-top-4 duration-200">
          <div className="bg-white text-slate-900 rounded-xl shadow-xl p-4 border border-slate-200/80 flex items-start gap-3">
            <div className="p-2 bg-blue-50/80 rounded-lg text-blue-600 mt-0.5 flex-shrink-0 border border-blue-100">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-xs text-slate-900">{bannerAlert.title}</h4>
              <p className="text-xs text-slate-600 leading-snug">{bannerAlert.message}</p>
              {bannerAlert.actionLabel && bannerAlert.actionToken && (
                <button
                  onClick={() => {
                    setActiveTokenCode(bannerAlert.actionToken!);
                    setTokenModalOpen(true);
                    setBannerAlert(null);
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-md transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>{bannerAlert.actionLabel}</span>
                </button>
              )}
            </div>
            <button
              onClick={() => setBannerAlert(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AD-RAMS Hero Banner & Top Nav */}
      <RamsHeroBanner
        activeView={activeView}
        setActiveView={setActiveView}
        activeModuleTab={activeModuleTab}
        setActiveModuleTab={setActiveModuleTab}
        onOpenUploadForm={() => {
          setUploadModalType('form');
          setUploadModalOpen(true);
        }}
        onOpenUploadIssuance={() => {
          setUploadModalType('issuance');
          setUploadModalOpen(true);
        }}
        onSelectCategoryFilter={(cat) => setNavbarCategoryFilter(cat)}
        onSelectIssuanceTypeFilter={(type) => setNavbarIssuanceTypeFilter(type)}
        pendingRequestsCount={pendingRequestsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setNotificationDrawerOpen(true)}
        onOpenTokenVerifier={() => {
          setActiveTokenCode('');
          setTokenModalOpen(true);
        }}
      />

      {/* View Switcher Bar & Section Toggles - Pure White Modern Aesthetic */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => { setActiveView('public'); setActiveModuleTab('forms'); }}
              className={`px-3.5 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeView === 'public' && activeModuleTab === 'forms'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
              }`}
            >
              Templates Repository ({forms.length})
            </button>
            <button
              onClick={() => { setActiveView('public'); setActiveModuleTab('issuances'); }}
              className={`px-3.5 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeView === 'public' && activeModuleTab === 'issuances'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
              }`}
            >
              Issuances &amp; RCSO ({issuances.length})
            </button>
            <button
              onClick={() => { setActiveView('public'); setActiveModuleTab('logistics'); }}
              className={`px-3.5 py-1.5 font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'public' && activeModuleTab === 'logistics'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Messenger Logistics</span>
            </button>
            <button
              onClick={() => setActiveView('executive')}
              className={`px-3.5 py-1.5 font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'executive'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Executive Dashboard</span>
              {pendingRequestsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setUploadModalType(activeModuleTab === 'issuances' ? 'issuance' : 'form');
                setUploadModalOpen(true);
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {activeView === 'public' ? (
          <div>
            {activeModuleTab === 'forms' && (
              <FormsRepository
                forms={forms}
                onPreviewForm={(form) => setPreviewFormItem(form)}
                onDownloadForm={handleDownloadForm}
                onOpenUpload={() => {
                  setUploadModalType('form');
                  setUploadModalOpen(true);
                }}
                onDeleteForm={handleDeleteForm}
                selectedCategoryFilter={navbarCategoryFilter}
              />
            )}

            {activeModuleTab === 'issuances' && (
              <IssuancesRepository
                issuances={issuances}
                onRequestAccess={(issuance) => setAccessRequestTarget(issuance)}
                onViewPublicIssuance={(issuance) => setPreviewIssuanceItem(issuance)}
                onOpenTokenVerifier={() => {
                  setActiveTokenCode('');
                  setTokenModalOpen(true);
                }}
                onOpenUpload={() => {
                  setUploadModalType('issuance');
                  setUploadModalOpen(true);
                }}
                onDeleteIssuance={handleDeleteIssuance}
                selectedTypeFilter={navbarIssuanceTypeFilter}
              />
            )}

            {activeModuleTab === 'logistics' && (
              <LogisticsTracker
                deliveries={deliveries}
                onOpenNewDispatch={() => setNewDispatchModalOpen(true)}
                onViewDeliveryDetails={(item) => setSelectedDelivery(item)}
                onQuickUpdateStatus={(item) => setSelectedDelivery(item)}
              />
            )}
          </div>
        ) : (
          <ExecutiveDashboard
            requests={requests}
            disposalBatches={disposalBatches}
            digitizationData={digitizationData}
            deliveries={deliveries}
            onApproveRequest={handleApproveRequest}
            onDenyRequest={handleDenyRequest}
            onOpenNewDisposalModal={() => setDisposalModalOpen(true)}
            onSignDisposalBatch={handleSignDisposalBatch}
            onOpenLogisticsModule={() => {
              setActiveView('public');
              setActiveModuleTab('logistics');
            }}
          />
        )}
      </main>

      {/* Modal: Upload Document (Form / Template or Issuance / RCSO) */}
      {uploadModalOpen && (
        <UploadDocumentModal
          initialType={uploadModalType}
          onClose={() => setUploadModalOpen(false)}
          onAddForm={handleAddForm}
          onAddIssuance={handleAddIssuance}
        />
      )}

      {/* Modal: Restricted Document Access Request (Module A) */}
      {accessRequestTarget && (
        <AccessRequestModal
          issuance={accessRequestTarget}
          onClose={() => setAccessRequestTarget(null)}
          onSubmitRequest={handleSubmitAccessRequest}
        />
      )}

      {/* Modal: Time-Sensitive Secure Link & Token Terminal */}
      {tokenModalOpen && (
        <SecureDownloadModal
          initialToken={activeTokenCode}
          requests={requests}
          issuances={issuances}
          onClose={() => setTokenModalOpen(false)}
          onRecordDownload={handleRecordDownload}
        />
      )}

      {/* Modal: Submit Disposal Batch (Module B) */}
      {disposalModalOpen && (
        <DisposalManagementModal
          onClose={() => setDisposalModalOpen(false)}
          onSubmitBatch={handleSubmitDisposalBatch}
        />
      )}

      {/* Modal: New Messenger Dispatch (Module C) */}
      {newDispatchModalOpen && (
        <NewDispatchModal
          onClose={() => setNewDispatchModalOpen(false)}
          onSubmitDispatch={handleSubmitDispatch}
        />
      )}

      {/* Modal: Delivery Timeline & Transmittal Slip (Module C) */}
      {selectedDelivery && (
        <DeliveryDetailModal
          delivery={selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
          onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
        />
      )}

      {/* Modal: Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        notifications={notifications}
        onOpenTokenTerminalWithToken={(token) => {
          setActiveTokenCode(token);
          setTokenModalOpen(true);
        }}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
      />

      {/* Modal: Form or Issuance Preview */}
      {(previewFormItem || previewIssuanceItem) && (
        <DocumentPreviewModal
          formItem={previewFormItem}
          issuanceItem={previewIssuanceItem}
          onClose={() => {
            setPreviewFormItem(null);
            setPreviewIssuanceItem(null);
          }}
          onDownload={() => {
            if (previewFormItem) {
              handleDownloadForm(previewFormItem);
            } else if (previewIssuanceItem) {
              triggerToast(
                'Issuance Circular Downloaded',
                `Official PDF copy of ${previewIssuanceItem.number} downloaded.`,
                'success'
              );
            }
          }}
        />
      )}
    </div>
  );
}
