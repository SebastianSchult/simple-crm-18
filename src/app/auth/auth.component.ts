import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatButtonModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  loginEmail = new FormControl('', [Validators.required, Validators.email]);
  loginPassword = new FormControl('', [Validators.required, Validators.minLength(6)]);

  registerEmail = new FormControl('', [Validators.required, Validators.email]);
  registerPassword = new FormControl('', [Validators.required, Validators.minLength(6)]);

  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Versucht den Benutzer mit der E-Mail und dem Passwort anzumelden.
   * Wenn die E-Mail oder das Passwort ungültig ist, tut nichts.
   * Wenn die Anmeldung erfolgreich ist, leitet den Benutzer auf das Dashboard um.
   * Wenn die Anmeldung fehlschlägt, zeigt die Fehlermeldung an.
   */
  login() {
    if (this.loginEmail.invalid || this.loginPassword.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.authService.login(this.loginEmail.value!, this.loginPassword.value!)
      .then(() => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        this.loading = false;
        this.errorMessage = error.message;
      });
  }

  /**
   * Versucht einen neuen Benutzer mit der E-Mail und dem Passwort anzulegen.
   * Wenn die E-Mail oder das Passwort ungültig ist, tut nichts.
   * Wenn die Registrierung erfolgreich ist, leitet den Benutzer auf das Dashboard um.
   * Wenn die Registrierung fehlschlägt, zeigt die entsprechende Fehlermeldung an.
   */
  register() {
    if (this.registerEmail.invalid || this.registerPassword.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.authService.register(this.registerEmail.value!, this.registerPassword.value!)
      .then(() => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        this.loading = false;
        console.error("Registration error: ", error);
        switch (error.code) {
          case 'auth/weak-password':
            this.errorMessage = 'Das Passwort ist zu schwach. Bitte wähle ein stärkeres Passwort.';
            break;
          case 'auth/email-already-in-use':
            this.errorMessage = 'Diese E-Mail wird bereits verwendet.';
            break;
          case 'auth/invalid-email':
            this.errorMessage = 'Ungültige E-Mail-Adresse.';
            break;
          default:
            this.errorMessage = error.message;
        }
      });
  }

  /**
   * Logs in as a guest user, without asking for any login credentials.
   * After a successful login, redirects to the dashboard.
   * If the login fails, shows the corresponding error message.
   */
  loginAsGuest() {
    this.loading = true;
    this.authService.loginAsGuest()
      .then(() => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        this.loading = false;
        this.errorMessage = error.message;
      });
  }
}