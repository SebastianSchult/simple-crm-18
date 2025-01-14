import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule, MatToolbar } from '@angular/material/toolbar';
import {MatDrawerContainer, MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatToolbarModule, MatSidenavModule, MatDrawerContainer, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'simple-crm-18';
}
