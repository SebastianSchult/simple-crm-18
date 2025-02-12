// src/auth-factory.ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth, getAuth } from '@angular/fire/auth';

export function getAuthFactory(): Auth {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    return getAuth();
  } else {
    // In SSR-Umgebungen wird ein Stub zurückgegeben, da Auth dort nicht genutzt wird.
    return {} as Auth;
  }
}