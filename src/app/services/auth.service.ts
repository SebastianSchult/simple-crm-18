// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, signOut } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);
  
  // Observable für den aktuellen Authentifizierungsstatus
  authState$ : Observable<any> = authState(this.auth);

  // Standard-Login mit Email und Passwort
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Registrierung
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Gastzugang: anonyme Authentifizierung
  loginAsGuest() {
    return signInAnonymously(this.auth);
  }

  // Logout
  logout() {
    return signOut(this.auth);
  }
}