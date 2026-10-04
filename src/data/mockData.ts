import { 
  DocumentForm, 
  Issuance, 
  AccessRequest, 
  DisposalBatch, 
  DigitizationFacilityMetric, 
  LogisticsDelivery,
  NotificationItem 
} from '../types';

export const DSWD_CENTERS = [
  'Reception and Study Center for Children (RSCC)',
  'Regional Haven for Women and Girls',
  'Home for Girls - Region Office',
  'Sanctuary Center for Persons with Disabilities',
  'National Vocational Rehabilitation Center (NVRC)',
  'Elsie Gaches Village Center',
  'Jose Fabella Center',
  'SWAD Office - Bulacan',
  'SWAD Office - Pampanga',
  'SWAD Office - Cavite',
  'SWAD Office - Laguna',
  'Field Office - Regional Records & Archives Unit (Main)',
  'Office of the Regional Director (ORD)',
  'Financial Management Division (FMD)',
  'Protective Services Division (PSD)'
];

// All initial datasets start 100% EMPTY per user request: "make all empty first like ill be the one uploading it"
export const INITIAL_FORMS: DocumentForm[] = [];
export const INITIAL_ISSUANCES: Issuance[] = [];
export const INITIAL_REQUESTS: AccessRequest[] = [];
export const INITIAL_DISPOSAL_BATCHES: DisposalBatch[] = [];
export const INITIAL_DIGITIZATION_DATA: DigitizationFacilityMetric[] = [];
export const INITIAL_DELIVERIES: LogisticsDelivery[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

// Sample datasets preserved in case user ever chooses to load demo records
export const SAMPLE_FORMS: DocumentForm[] = [
  {
    id: 'form-1',
    code: 'DSWD-REC-ANNEX-A',
    title: 'Records Inventory and Inspection Report (RIIR)',
    category: 'Inventory Sheets',
    fileType: 'XLSX',
    fileSize: '348 KB',
    version: 'Rev. 2026.1',
    updatedDate: '2026-08-15',
    downloads: 0,
    description: 'Mandatory standard NAP-aligned inventory template used by regional center custodians to log physical folders and linear volume prior to disposal.',
    issuingUnit: 'Records Section & NAP Compliance Desk'
  },
  {
    id: 'form-2',
    code: 'DSWD-REC-ANNEX-B',
    title: 'General Records Disposal Schedule (GRDS) Matrix',
    category: 'Disposal Requests',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    version: 'Series 2026',
    updatedDate: '2026-07-20',
    downloads: 0,
    description: 'Official retention period reference guide for social work case studies, feeding reports, financial vouchers, and residential intake files.',
    issuingUnit: 'Records & Archives Division'
  }
];

export const SAMPLE_ISSUANCES: Issuance[] = [
  {
    id: 'iss-1',
    number: 'AO No. 04, Series of 2026',
    title: 'Omnibus Guidelines on the Decentralized Records Management, Archiving, and Digital Preservation Across DSWD Centers',
    type: 'Administrative Order',
    seriesYear: 2026,
    issuingOffice: 'Office of the Secretary / Regional Directorate',
    dateIssued: '2026-02-14',
    isRestricted: false,
    accessClassification: 'Public',
    summary: 'Establishes standard protocol for records retention periods, digitization schedules, digital signature authentication, and center archivist responsibilities.',
    pageCount: 38
  },
  {
    id: 'iss-2',
    number: 'RCSO No. 09-2026 (RESTRICTED)',
    title: 'Protocols on the Custody, Storage, and Restricted Access to Adoption Case Files and Protective Child Registry Records',
    type: 'Regional Center Special Order (RCSO)',
    seriesYear: 2026,
    issuingOffice: 'Protective Services & Legal Unit',
    dateIssued: '2026-06-15',
    isRestricted: true,
    accessClassification: 'Restricted / Confidential',
    summary: 'Classified protocol governing sealed child placement records under RA 11642. Requires vetted DSWD authorization before release.',
    pageCount: 24,
    restrictedReason: 'Contains sensitive personal data and legal juvenile case records protected under the Data Privacy Act of 2012 and Domestic Administrative Adoption Act.',
    securityClearanceRequired: 'Division Chief / Center Head Endorsement Required'
  }
];
