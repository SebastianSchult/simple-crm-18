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
  selector: 'app-dialog-edit-user',
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
  templateUrl: './dialog-edit-user.component.html',
  styleUrls: ['./dialog-edit-user.component.scss'], // Beachte: styleUrls (Plural)
})
export class DialogEditUserComponent {
  firestore: Firestore = inject(Firestore);
  user!: User;
  loading = false;
  dialogRef = inject(MatDialogRef<DialogEditUserComponent>);
  private _snackBar = inject(MatSnackBar);

  /**
   * Constructor for the DialogEditUserComponent.
   * It takes in a {user: User} object as a parameter and assigns it to the
   * user property of the component. This user object is then used to
   * populate the form fields in the dialog.
   * @param data The {user: User} object to be edited.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: { user: User }) {
    this.user = data.user;
  }

  /**
   * Saves the edited user to the Firestore.
   * If the user has no ID, it prints an error message and does nothing.
   * If the user ID is valid, it updates the user document in the Firestore
   * with the edited values. If the update is successful, it logs a success
   * message, closes the dialog with the edited user as the result, and
   * shows a snackbar with a success message. If the update fails, it logs
   * an error message and does nothing.
   */
  saveUser() {
    if (this.loading) return;
    this.loading = true;

    if (!this.user.id) {
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
        this.loading = false;
      });
  }

  /**
   * Opens a snackbar with a success message after a user has been edited.
   * The snackbar shows the message "User edited" and has a duration of 3 seconds.
   */
  openSnackBar() {
    this._snackBar.open('User edited', 'Close', { duration: 3000 });
  }
}
