// src/firebase-initializer.ts
import { getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { environment } from './environments/environment';

/**
 * Initializes the Firebase app if it is not already initialized, or returns the existing app
 * @returns The Firebase app
 */
export function firebaseInitializer(): FirebaseApp {
  const apps = getApps();
  if (!apps.length) {
    return initializeApp(environment.firebaseConfig);
  } else {
    return apps[0];
  }
}