// src/auth-factory.ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth, getAuth } from '@angular/fire/auth';

/**
 * Factory-Funktion, die je nach Plattform einen Auth-Client oder einen Stub zurückgibt.
 * In Browser-Umgebungen wird der echte Auth-Client von Angular Fire verwendet.
 * In Server-Side-Rendering-Umgebungen wird ein Stub zurückgegeben, da Auth dort nicht genutzt wird.
 * @returns {Auth}
 */
export function getAuthFactory(): Auth {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    return getAuth();
  } else {
    return {} as Auth;
  }
}