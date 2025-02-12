import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service'; 
import { RouterOutlet } from '@angular/router';
import { MatDrawerContainer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatSidenavModule, MatIconModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'simple-crm-18';
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}

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

  logout() {
    this.authService.logout()
      .then(() => {
        // Nach dem Logout zur Login-Seite navigieren (oder Auth-Komponente)
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Logout failed:', error);
      });
  }
}