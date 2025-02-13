import { AuthService } from '../services/auth.service';
// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Überprüft, ob der Benutzer authentifiziert ist. Wenn nicht, wird eine
   * Umleitung zur AuthComponent ausgelöst.
   *
   * @returns Ein Observable, das einen boolean-Wert oder einen UrlTree-Wert liefert.
   *          Der boolean-Wert gibt an, ob der Benutzer authentifiziert ist.
   *          Der UrlTree-Wert repräsentiert die Umleitung zur AuthComponent.
   */
  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.authState$.pipe(
      take(1),
      map((user) => {
        if (user) {
          return true;
        }
        return this.router.createUrlTree(['/auth']);
      })
    );
  }
}
