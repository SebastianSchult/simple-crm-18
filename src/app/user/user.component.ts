import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule, TooltipPosition} from '@angular/material/tooltip';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[1]);
}
