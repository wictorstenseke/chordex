/**
 * Firebase initialization (Firestore + Auth).
 * Config read from VITE_* environment variables.
 */

import {
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence,
  connectFirestoreEmulator,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

/**
 * Initialize Firebase. Safe to call multiple times; returns existing instances.
 * Only initializes if required config vars are present.
 */
export const initFirebase = (): {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  isConfigured: boolean;
} => {
  const hasConfig =
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.authDomain;

  if (!hasConfig) {
    return { app: null, db: null, auth: null, isConfigured: false };
  }

  if (app) {
    return { app, db, auth, isConfigured: true };
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // Enable Firestore offline persistence (IndexedDB) for offline editing
  enableIndexedDbPersistence(db).catch((err: { code?: string }) => {
    if (err.code === "failed-precondition") {
      console.warn(
        "Firestore persistence: multiple tabs open, persistence only works in one tab"
      );
    } else if (err.code === "unimplemented") {
      console.warn("Firestore persistence not supported in this browser");
    }
  });

  const useEmulator = import.meta.env.VITE_FIREBASE_USE_EMULATOR === "true";
  if (useEmulator) {
    const host = import.meta.env.VITE_FIREBASE_EMULATOR_HOST || "127.0.0.1";
    connectAuthEmulator(auth, `http://${host}:9099`);
    connectFirestoreEmulator(db, host, 8080);
  }

  return { app, db, auth, isConfigured: true };
};

/** Lazy init on first access */
export const getFirebaseApp = (): FirebaseApp | null => {
  if (!app && firebaseConfig.apiKey && firebaseConfig.projectId) {
    initFirebase();
  }
  return app;
};

export const getFirestoreDb = (): Firestore | null => {
  if (!db && firebaseConfig.apiKey && firebaseConfig.projectId) {
    initFirebase();
  }
  return db;
};

export const getFirebaseAuth = (): Auth | null => {
  if (!auth && firebaseConfig.apiKey && firebaseConfig.projectId) {
    initFirebase();
  }
  return auth;
};
