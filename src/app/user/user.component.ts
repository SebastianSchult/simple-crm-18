import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from '../../models/user.class';
import { MatCardModule } from '@angular/material/card';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { query, orderBy } from 'firebase/firestore';

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
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  user = new User();
  allUsers: any[] = [];
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[1]);
  readonly dialog = inject(MatDialog);

  /**
   * Initializes the component by fetching and subscribing to user data from Firestore.
   * Sorts the users by their last name and converts Firestore timestamp to JavaScript Date object for birthDate.
   * Updates the allUsers array with the fetched and processed user data.
   */

  ngOnInit(): void {
    const usersCollection = collection(this.firestore, 'users');
    const sortedQuery = query(usersCollection, orderBy('lastName'));

    collectionData(sortedQuery, { idField: 'id' }).subscribe((changes: any) => {
      console.log('Changes:', changes);
      this.allUsers = changes.map((u: any) => {
        if (
          u.birthDate &&
          typeof u.birthDate === 'object' &&
          'seconds' in u.birthDate
        ) {
          u.birthDate = new Date(u.birthDate.seconds * 1000);
        }
        return u;
      });
    });
  }

  /**
   * Opens the DialogAddUserComponent dialog with the MatDialog service.
   * The MatDialog service will create and open the dialog with the given component.
   * The user can then interact with the dialog to add a new user.
   */
  openDialog(): void {
    this.dialog.open(DialogAddUserComponent);
  }
}
