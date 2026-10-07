import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import type { 
  DocumentForm, 
  Issuance, 
  AccessRequest, 
  DisposalBatch, 
  LogisticsDelivery, 
  NotificationItem 
} from './types';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Sign in anonymously to authenticate sessions across incognito/shared windows
signInAnonymously(auth).catch((err) => {
  console.warn('Anonymous auth note:', err);
});

// Test connection per skill guidelines
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection check: client is offline or initializing.');
    }
  }
}
testConnection();

// Collection References
export const COLLECTIONS = {
  FORMS: 'forms',
  ISSUANCES: 'issuances',
  REQUESTS: 'requests',
  DISPOSAL_BATCHES: 'disposal_batches',
  DELIVERIES: 'deliveries',
  NOTIFICATIONS: 'notifications'
} as const;

// Real-time Subscriptions
export function subscribeToForms(callback: (forms: DocumentForm[]) => void) {
  const colRef = collection(db, COLLECTIONS.FORMS);
  return onSnapshot(colRef, (snapshot) => {
    const list: DocumentForm[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as DocumentForm);
    });
    // Sort newest first by updatedDate or id
    list.sort((a, b) => (b.updatedDate || '').localeCompare(a.updatedDate || ''));
    callback(list);
  }, (err) => {
    console.error('Firestore subscribeToForms error:', err);
  });
}

export function subscribeToIssuances(callback: (issuances: Issuance[]) => void) {
  const colRef = collection(db, COLLECTIONS.ISSUANCES);
  return onSnapshot(colRef, (snapshot) => {
    const list: Issuance[] = [];
    snapshot.forEach((d) => {
      const data = d.data() as Issuance;
      // Normalization
      list.push({
        ...data,
        type: (data.type as string) === 'Regional Center Special Order (RCSO)' 
          ? 'Regional Special Order (RSO)' 
          : data.type,
        number: typeof data.number === 'string' ? data.number.replace(/\bRCSO\b/g, 'RSO') : data.number
      });
    });
    list.sort((a, b) => (b.dateIssued || '').localeCompare(a.dateIssued || ''));
    callback(list);
  }, (err) => {
    console.error('Firestore subscribeToIssuances error:', err);
  });
}

export function subscribeToRequests(callback: (requests: AccessRequest[]) => void) {
  const colRef = collection(db, COLLECTIONS.REQUESTS);
  return onSnapshot(colRef, (snapshot) => {
    const list: AccessRequest[] = [];
    snapshot.forEach((d) => {
      const data = d.data() as AccessRequest;
      list.push({
        ...data,
        issuanceNumber: typeof data.issuanceNumber === 'string' ? data.issuanceNumber.replace(/\bRCSO\b/g, 'RSO') : data.issuanceNumber
      });
    });
    list.sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));
    callback(list);
  }, (err) => {
    console.error('Firestore subscribeToRequests error:', err);
  });
}

export function subscribeToDisposalBatches(callback: (batches: DisposalBatch[]) => void) {
  const colRef = collection(db, COLLECTIONS.DISPOSAL_BATCHES);
  return onSnapshot(colRef, (snapshot) => {
    const list: DisposalBatch[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as DisposalBatch);
    });
    callback(list);
  }, (err) => {
    console.error('Firestore subscribeToDisposalBatches error:', err);
  });
}

export function subscribeToDeliveries(callback: (deliveries: LogisticsDelivery[]) => void) {
  const colRef = collection(db, COLLECTIONS.DELIVERIES);
  return onSnapshot(colRef, (snapshot) => {
    const list: LogisticsDelivery[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as LogisticsDelivery);
    });
    list.sort((a, b) => (b.dispatchedAt || '').localeCompare(a.dispatchedAt || ''));
    callback(list);
  }, (err) => {
    console.error('Firestore subscribeToDeliveries error:', err);
  });
}

export function subscribeToNotifications(callback: (notifs: NotificationItem[]) => void) {
  const colRef = collection(db, COLLECTIONS.NOTIFICATIONS);
  return onSnapshot(colRef, (snapshot) => {
    const list: NotificationItem[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as NotificationItem);
    });
    list.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
    callback(list);
  }, (err) => {
    console.error('Firestore subscribeToNotifications error:', err);
  });
}

// Utility to strip undefined values so Firestore never throws unsupported field value errors
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map((item) => (typeof item === 'object' && item !== null ? sanitizeForFirestore(item) : item));
  }
  const clean: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (typeof value === 'object' && value !== null) {
        clean[key] = sanitizeForFirestore(value);
      } else {
        clean[key] = value;
      }
    }
  }
  return clean;
}

// Write / Update / Delete Helpers
export async function saveFormToFirestore(form: DocumentForm) {
  const ref = doc(db, COLLECTIONS.FORMS, form.id);
  await setDoc(ref, sanitizeForFirestore(form), { merge: true });
}

export async function deleteFormFromFirestore(formId: string) {
  const ref = doc(db, COLLECTIONS.FORMS, formId);
  await deleteDoc(ref);
}

export async function saveIssuanceToFirestore(issuance: Issuance) {
  const ref = doc(db, COLLECTIONS.ISSUANCES, issuance.id);
  await setDoc(ref, sanitizeForFirestore(issuance), { merge: true });
}

export async function deleteIssuanceFromFirestore(issuanceId: string) {
  const ref = doc(db, COLLECTIONS.ISSUANCES, issuanceId);
  await deleteDoc(ref);
}

export async function saveRequestToFirestore(request: AccessRequest) {
  const ref = doc(db, COLLECTIONS.REQUESTS, request.id);
  await setDoc(ref, sanitizeForFirestore(request), { merge: true });
}

export async function updateRequestInFirestore(requestId: string, updates: Partial<AccessRequest>) {
  const ref = doc(db, COLLECTIONS.REQUESTS, requestId);
  await updateDoc(ref, sanitizeForFirestore(updates));
}

export async function saveDisposalBatchToFirestore(batch: DisposalBatch) {
  const ref = doc(db, COLLECTIONS.DISPOSAL_BATCHES, batch.id);
  await setDoc(ref, sanitizeForFirestore(batch), { merge: true });
}

export async function updateDisposalBatchInFirestore(batchId: string, updates: Partial<DisposalBatch>) {
  const ref = doc(db, COLLECTIONS.DISPOSAL_BATCHES, batchId);
  await updateDoc(ref, sanitizeForFirestore(updates));
}

export async function saveDeliveryToFirestore(delivery: LogisticsDelivery) {
  const ref = doc(db, COLLECTIONS.DELIVERIES, delivery.id);
  await setDoc(ref, sanitizeForFirestore(delivery), { merge: true });
}

export async function updateDeliveryInFirestore(deliveryId: string, updates: Partial<LogisticsDelivery>) {
  const ref = doc(db, COLLECTIONS.DELIVERIES, deliveryId);
  await updateDoc(ref, sanitizeForFirestore(updates));
}

export async function saveNotificationToFirestore(notif: NotificationItem) {
  const ref = doc(db, COLLECTIONS.NOTIFICATIONS, notif.id);
  await setDoc(ref, sanitizeForFirestore(notif), { merge: true });
}

export async function markNotificationReadInFirestore(notifId: string) {
  const ref = doc(db, COLLECTIONS.NOTIFICATIONS, notifId);
  await updateDoc(ref, { read: true });
}
