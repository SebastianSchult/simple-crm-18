import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  provideNativeDateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';

/** @title Basic datepicker */
export const DE_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY', // Format für das Parsen von Eingaben
  },
  display: {
    dateInput: 'DD.MM.YYYY', // Format für das Eingabefeld
    monthYearLabel: 'MM/YYYY', // Format für Monat-Jahr Label
    dateA11yLabel: 'LL', // Format für Barrierefreiheit
  },
};

@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: DE_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
  ],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAddUserComponent {}
