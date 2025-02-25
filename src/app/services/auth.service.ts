import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);
  authState$: Observable<any>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Nur im Browser den authState beobachten – im SSR einen leeren Observable liefern
    if (isPlatformBrowser(this.platformId)) {
      this.authState$ = authState(this.auth);
    } else {
      this.authState$ = of(null);
    }
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  loginAsGuest() {
    return signInAnonymously(this.auth);
  }

  logout() {
    return signOut(this.auth);
  }
}