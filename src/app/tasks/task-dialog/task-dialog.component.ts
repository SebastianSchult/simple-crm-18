import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../../models/task.class';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core'; 
import { FirebaseService } from './../../services/firebase.service'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { GermanDateAdapter } from '../../shared/german-date-adapter';

export const DE_DATE_FORMATS = {
  parse: {
    dateInput: 'dd-MM-yyyy',
  },
  display: {
    dateInput: 'dd-MM-yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'dd-MM-yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  providers: [
    { provide: DateAdapter, useClass: GermanDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DE_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    provideNativeDateAdapter(), 
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './task-dialog.component.html'
})
export class TaskDialogComponent {
  taskForm: FormGroup;
  statusOptions = ['offen', 'in Bearbeitung', 'erledigt'];

  private firebaseService = inject(FirebaseService);
  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null // Optionaler Typ erlaubt null
  ) {
    this.taskForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      description: [data?.description || ''],
      dueDate: [data?.dueDate || null, Validators.required],
      status: [data?.status || 'offen', Validators.required] // Standardwert setzen
    });
  }

  save(): void {
    if (this.taskForm.valid) {
      const taskData = {
        ...this.taskForm.value,
        dueDate: this.taskForm.value.dueDate ? new Date(this.taskForm.value.dueDate) : null
      };
      this.firebaseService.addTask(taskData)
        .then(() => {
          this.openSnackBar();
          this.dialogRef.close(taskData); // Dialog schließen nach dem Speichern
        })
        .catch((error) => {
          console.error('Fehler beim Speichern des Tasks:', error);
        });
    } else {
      console.warn('Task Form is invalid:', this.taskForm.errors);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  
  openSnackBar() {
    this._snackBar.open('Task erfolgreich gespeichert!', 'Schließen', { duration: 3000 });
  }
}