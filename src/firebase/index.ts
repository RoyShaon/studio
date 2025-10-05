'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!firebaseConfig || !firebaseConfig.apiKey) {
    console.error("Firebase config is missing or invalid. Please check your src/firebase/config.ts file.");
    // Return a dummy object to prevent app crash, but services will not work.
    return {
      firebaseApp: null,
      auth: null,
      firestore: null,
    };
  }
  
  if (getApps().length) {
    return getSdks(getApp());
  }

  // Always initialize with the config object to ensure the API key is available.
  const firebaseApp = initializeApp(firebaseConfig);

  return getSdks(firebaseApp);
}


export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
