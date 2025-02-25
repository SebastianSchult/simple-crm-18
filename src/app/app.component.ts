import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service'; 
import { RouterOutlet } from '@angular/router';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatSidenavModule, MatIconModule, RouterModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'simple-crm-18';
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  /**
   * Initializes an instance of AppComponent.
   * 
   * @param breakpointObserver - Used to observe media query breakpoints.
   * @param authService - Service used for authentication operations.
   * @param router - Angular Router for navigation.
   */

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Listens to the Handset breakpoint and updates the sidenav mode accordingly.
   * In handset mode, the sidenav is displayed as an overlay and is initially closed.
   * In other modes, the sidenav is displayed as a side drawer and is initially open.
   */
  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        this.sidenavMode = 'over';
        this.sidenavOpened = false;
      } else {
        this.sidenavMode = 'side';
        this.sidenavOpened = true;
      }
    });
  }

/**
 * Logs out the current user by calling the AuthService's logout method.
 * On successful logout, navigates to the login page.
 * Logs an error message to the console if logout fails.
 */

  logout() {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Logout failed:', error);
      });
  }
}