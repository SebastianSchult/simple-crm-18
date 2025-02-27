import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  NativeDateAdapter,
} from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.class';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseService } from '../services/firebase.service';


class GermanDateAdapter extends NativeDateAdapter {
  override parse(value: string | null, parseFormat?: any): Date | null {
    if (value && typeof value === 'string' && value.includes('.')) {
      const [day, month, year] = value.split('.');
      const date = new Date(+year, +month - 1, +day);
      return isNaN(date.getTime()) ? null : date;
    }
    return super.parse(value, parseFormat);
  }
}

export const DE_DATE_FORMATS = {
  parse: {
    dateInput: 'dd.MM.yyyy',
  },
  display: {
    dateInput: 'dd.MM.yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'dd.MM.yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    {
      provide: DateAdapter,
      useClass: GermanDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: DE_DATE_FORMATS },
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    MatProgressBarModule,
    CommonModule,
  ],
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss'],
})
export class DialogAddUserComponent {
  dialogRef = inject(MatDialogRef<DialogAddUserComponent>);
  private _snackBar = inject(MatSnackBar);
  private firebaseService: FirebaseService = inject(FirebaseService);

  user = new User();
  birthDate: Date = new Date();
  loading = false;

  
  
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
    this.user.birthDate = this.birthDate.getTime();
    this.firebaseService.addUser(this.user.toJSON())
      .then(() => {
        this.loading = false;
        this.user = new User();
        this.birthDate = new Date();
        this.openSnackBar();
        this.dialogRef.close();
      })
      .catch((error) => {
        console.error('Error adding user:', error);
        this.loading = false;
      });
  }

  /**
   * Zeigt eine Snackbar mit einer Erfolgsmeldung an.
   */
  openSnackBar() {
    this._snackBar.open('User added', 'Close', { duration: 3000 });
  }
}