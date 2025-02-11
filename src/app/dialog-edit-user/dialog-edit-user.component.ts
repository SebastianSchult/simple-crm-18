import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  imports: [MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatProgressBarModule, CommonModule],
  templateUrl: './dialog-edit-user.component.html',
  styleUrls: ['./dialog-edit-user.component.scss']  // Beachte: styleUrls (Plural)
})
export class DialogEditUserComponent {
  firestore: Firestore = inject(Firestore);
  user!: User;
  loading = false;
  dialogRef = inject(MatDialogRef<DialogEditUserComponent>);
  private _snackBar = inject(MatSnackBar);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user: User }) {
    this.user = data.user;
  }
  
  saveUser() {
    if (this.loading) return;
    this.loading = true;
    console.log('User to update:', this.user);

    if (!this.user.id) {
      console.error('User hat keine ID, Update nicht möglich.');
      this.loading = false;
      return;
    }
    
    const userDocRef = doc(this.firestore, 'users', this.user.id);
    
    updateDoc(userDocRef, this.user.toJSON())
      .then(() => {
        console.log('User updated successfully.');
        this.loading = false;
        this.openSnackBar();
        this.dialogRef.close(this.user);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        this.loading = false;
      });
  }
  
  openSnackBar() {
    this._snackBar.open('User edited', 'Close', { duration: 3000 });
  }
}