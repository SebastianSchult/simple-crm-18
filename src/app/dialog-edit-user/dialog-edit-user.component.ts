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
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseService } from './../services/firebase.service'; 

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
  styleUrls: ['./dialog-edit-user.component.scss'],
})
export class DialogEditUserComponent {
  user!: User;
  loading = false;
  dialogRef = inject(MatDialogRef<DialogEditUserComponent>);
  private _snackBar = inject(MatSnackBar);

  
  /**
   * The constructor of the DialogEditUserComponent.
   * It takes in a {user: User} object as a parameter and assigns it to the
   * user property of the component. This user object is then used to
   * populate the form fields in the dialog.
   * @param data The {user: User} object to be edited.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private firebaseService: FirebaseService
  ) {
    this.user = data.user;
  }

  
  /**
   * Saves the user to the Firestore.
   * If the user is not valid, it doesn't do anything.
   * If the user is valid, it updates the user in the Firestore and logs the user-id.
   * If the update is successful, it logs a success message, resets the user object,
   * closes the dialog with the updated user as the result, and shows a snackbar with
   * a success message. If the update fails, it logs an error message and does nothing.
   */
  saveUser() {
    if (this.loading) return;
    this.loading = true;

    if (!this.user.id) {
      this.loading = false;
      return;
    }
    this.firebaseService.updateUser(this.user.id, this.user.toJSON())
      .then(() => {
        this.loading = false;
        this.openSnackBar();
        this.dialogRef.close(this.user);
      })
      .catch((error) => {
        this.loading = false;
        console.error('Error updating user:', error);
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