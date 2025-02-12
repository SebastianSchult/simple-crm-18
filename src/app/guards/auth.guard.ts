import { AuthService } from '../services/auth.service';
// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.authState$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        }
        // Nicht authentifiziert? Umleitung zur AuthComponent.
        return this.router.createUrlTree(['/auth']);
      })
    );
  }
}