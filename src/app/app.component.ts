import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatToolbarModule, MatToolbar } from '@angular/material/toolbar';
import {MatDrawerContainer, MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import { UserComponent } from './user/user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatToolbarModule, MatSidenavModule, MatDrawerContainer, MatIconModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'simple-crm-18';
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  constructor(private breakpointObserver: BreakpointObserver) {}

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
}
