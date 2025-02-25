import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from '../../models/user.class';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { query, orderBy } from 'firebase/firestore';
import { FirebaseService } from '../services/firebase.service'; 

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'], 
})
export class UserComponent implements OnInit {
  user = new User();
  allUsers: any[] = [];
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[1]);
  readonly dialog = inject(MatDialog);

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    // Nutze den Service, um Benutzer abzurufen
    this.firebaseService.getUsers().subscribe((changes: any) => {
      console.log('Changes:', changes);
      this.allUsers = changes.map((u: any) => {
        if (u.birthDate && typeof u.birthDate === 'object' && 'seconds' in u.birthDate) {
          u.birthDate = new Date(u.birthDate.seconds * 1000);
        }
        return u;
      });
    });
  }

  openDialog(): void {
    this.dialog.open(DialogAddUserComponent);
  }
}