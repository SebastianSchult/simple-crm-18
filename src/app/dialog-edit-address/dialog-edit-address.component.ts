import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { User } from '../../models/user.class';
import { CommonModule } from '@angular/common';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-edit-address',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressBarModule,
    CommonModule,
  ],
  templateUrl: './dialog-edit-address.component.html',
  styleUrls: ['./dialog-edit-address.component.scss'],
})
export class DialogEditAddressComponent {
  firestore: Firestore = inject(Firestore);
  user: User;
  loading = false;
  dialogRef: MatDialogRef<DialogEditAddressComponent> = inject(MatDialogRef);
  private _snackBar = inject(MatSnackBar);

  /**
   * The constructor of the DialogEditAddressComponent.
   * It takes in a {user: User} object as a parameter and assigns it to the
   * user property of the component. This user object is then used to
   * populate the form fields in the dialog.
   * @param data The {user: User} object to be edited.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: { user: User }) {
    this.user = data.user;
  }

  /**
   * Updates the user information in the Firestore.
   * If the user is currently being saved (loading is true), the function returns immediately.
   * Sets the loading state to true and logs the user object to be updated.
   * If the user object does not have an ID, logs an error and sets loading to false.
   * Creates a reference to the user document in Firestore and attempts to update it with
   * the user's data. On success, logs a success message, sets loading to false, shows a
   * snackbar notification, and closes the dialog returning the updated user.
   * On failure, logs an error message and sets loading to false.
   */

  saveUser() {
    if (this.loading) return;
    this.loading = true;

    if (!this.user.id) {
      console.error('User hat keine ID, Update nicht möglich.');
      this.loading = false;
      return;
    }

    const userDocRef = doc(this.firestore, 'users', this.user.id);

    updateDoc(userDocRef, this.user.toJSON())
      .then(() => {
        this.loading = false;
        this.openSnackBar();
        this.dialogRef.close(this.user);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        this.loading = false;
      });
  }

  /**
   * Opens a snackbar notification with a success message after a user has been edited.
   * The snackbar shows the message "User edited" and has a duration of 3 seconds.
   */
  openSnackBar() {
    this._snackBar.open('User edited', 'Close', { duration: 3000 });
  }
}
