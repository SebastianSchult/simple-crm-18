import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';

export const routes: Routes = [
  // Unauthentifizierte Benutzer sehen standardmäßig den Auth-Bereich.
  { path: '', component: AuthComponent },
  { path: 'auth', component: AuthComponent },
  // Öffentliche Routen – keine AuthGuard, damit sie immer zugänglich sind.
  { path: 'impressum', component: ImpressumComponent },
  // Geschützte Routen – nur zugänglich, wenn der Benutzer eingeloggt ist.
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'user/:id', component: UserDetailComponent, canActivate: [AuthGuard] },
  // Fallback: Unbekannte Routen leiten zurück zur Auth-Seite.
  { path: '**', redirectTo: '/auth' }
];