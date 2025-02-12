// src/firebase-initializer.ts
import { getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { environment } from './environments/environment';

export function firebaseInitializer(): FirebaseApp {
  const apps = getApps();
  if (!apps.length) {
    return initializeApp(environment.firebaseConfig);
  } else {
    return apps[0];
  }
}