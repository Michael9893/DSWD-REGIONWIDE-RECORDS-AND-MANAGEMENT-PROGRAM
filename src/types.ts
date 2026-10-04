export type DocumentCategory = 
  | 'Templates' 
  | 'Inventory Sheets' 
  | 'Annexes' 
  | 'Disposal Requests' 
  | 'Transmittal & Logistics';

export type FileFormat = 'PDF' | 'DOCX' | 'XLSX';

export interface DocumentForm {
  id: string;
  code: string; // e.g. DSWD-FO-REC-F01
  title: string;
  category: DocumentCategory;
  fileType: FileFormat;
  fileSize: string;
  version: string;
  updatedDate: string;
  downloads: number;
  description: string;
  issuingUnit: string;
}

export type IssuanceType = 
  | 'Administrative Order'
  | 'Memorandum Circular'
  | 'Regional Center Special Order (RCSO)'
  | 'Special Order';

export interface Issuance {
  id: string;
  number: string; // e.g., RCSO No. 18-2026
  title: string;
  type: IssuanceType;
  seriesYear: number;
  issuingOffice: string;
  dateIssued: string;
  isRestricted: boolean;
  accessClassification: 'Public' | 'Restricted / Confidential';
  summary: string;
  pageCount: number;
  restrictedReason?: string;
  securityClearanceRequired?: string;
}

export interface AccessRequest {
  id: string;
  trackingCode: string; // REQ-2026-XXXX
  issuanceId: string;
  issuanceNumber: string;
  issuanceTitle: string;
  fullName: string;
  position: string;
  centerOffice: string;
  dswdEmail: string;
  purpose: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'denied';
  reviewedBy?: string;
  reviewedAt?: string;
  adminNotes?: string;
  secureToken?: string;
  tokenExpiresAt?: string;
  downloadAccessCount: number;
}

export type DisposalStatus = 
  | 'Pending Management Signature' 
  | 'Awaiting NAP Inspection' 
  | 'Scheduled for Shredding' 
  | 'Disposed & Certified';

export interface DisposalBatch {
  id: string;
  batchNumber: string; // DISP-2026-042
  centerOffice: string;
  custodianName: string;
  recordSeries: string;
  inclusiveYears: string;
  totalBoxes: number;
  weightKg: number;
  status: DisposalStatus;
  submittedDate: string;
  scheduledDestructionDate?: string;
  napClearanceNo?: string;
  destructionMethod: 'High-Volume Shredding' | 'Pulping & Recycling' | 'Witnessed Incineration';
  witnessingOfficer?: string;
}

export interface DigitizationFacilityMetric {
  centerOffice: string;
  targetRecords: number;
  digitizedRecords: number;
  pendingPhysicalRecords: number;
  lastUploadDate: string;
  completionRate: number;
}

export type DeliveryPriority = 'Routine' | 'Urgent' | 'Rush - COA / Legal' | 'Confidential';
export type DeliveryStatus = 'Dispatched' | 'In Transit' | 'Arrived at Facility' | 'Delivered & Acknowledged';

export interface DeliveryCheckpoint {
  id: string;
  timestamp: string;
  location: string;
  statusNote: string;
  recordedBy: string;
}

export interface LogisticsDelivery {
  id: string;
  trackingNumber: string; // DSWD-LOG-2026-0849
  subject: string;
  originOffice: string;
  destinationOffice: string;
  senderName: string;
  recipientDesignation: string;
  assignedMessenger: string;
  messengerContact: string;
  vehicleType: 'Motorcycle Dispatch' | 'Service Vehicle' | 'Field Courier';
  priority: DeliveryPriority;
  status: DeliveryStatus;
  dispatchedAt: string;
  estimatedDelivery: string;
  actualDeliveredAt?: string;
  receivedByName?: string;
  receivingSignature?: string;
  acknowledgmentReceiptNo?: string;
  notes?: string;
  checkpoints: DeliveryCheckpoint[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'access_approved' | 'access_denied' | 'disposal_update' | 'delivery_update' | 'new_request';
  secureToken?: string;
  trackingCode?: string;
  issuanceTitle?: string;
  recipientEmail?: string;
}
