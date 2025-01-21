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
  NativeDateAdapter
} from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.class';
import { Firestore } from '@angular/fire/firestore';
import { collection, collectionData, addDoc } from '@angular/fire/firestore';



// Eigener DateAdapter für deutsches Format
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
    monthYearA11yLabel: 'MMMM yyyy'
  },
};

@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: GermanDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DE_DATE_FORMATS },
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
  ],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAddUserComponent {
  firestore: Firestore = inject(Firestore);
  user = new User();
  birthDate: Date = new Date();

  saveUser() {
    this.user.birthDate = this.birthDate.getTime(); // Direkt den Timestamp speichern
    console.log('User saved:', this.user);
    const usersCollection = collection(this.firestore, 'users');
    addDoc(usersCollection, this.user.toJSON())
    .then((result) => {
      console.log('User added with ID:', result.id);
    });
  }
}
