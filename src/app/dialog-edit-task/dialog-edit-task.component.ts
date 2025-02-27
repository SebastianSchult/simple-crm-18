import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.class';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { GermanDateAdapter } from '../shared/german-date-adapter';

export const GERMAN_DATE_FORMATS = {
  parse: {
    dateInput: 'dd-MM-yyyy'
  },
  display: {
    dateInput: 'dd-MM-yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'dd-MM-yyyy',
    monthYearA11yLabel: 'MMMM yyyy'
  }
};

@Component({
  selector: 'app-dialog-edit-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './dialog-edit-task.component.html',
  styleUrls: ['./dialog-edit-task.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: GermanDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: GERMAN_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }
  ]
})
export class DialogEditTaskComponent {
  taskForm: FormGroup;
  statusOptions = ['to Do', 'in progress', 'done'];

  
/**
 * Constructs an instance of DialogEditTaskComponent.
 * Initializes the task form using FormBuilder with the provided task data.
 * 
 * @param fb The FormBuilder service used to create the form group.
 * @param dialogRef A reference to the dialog containing this component.
 * @param data The injected data containing the task to be edited.
 */

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogEditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task }
  ) {
    const convertedDueDate =
      data.task.dueDate && typeof (data.task.dueDate as any).toDate === 'function'
        ? (data.task.dueDate as any).toDate()
        : data.task.dueDate;
    
    this.taskForm = this.fb.group({
      title: [data.task.title, Validators.required],
      description: [data.task.description],
      dueDate: [convertedDueDate, Validators.required],
      status: [data.task.status, Validators.required]
    });
  }

  /**
   * Save the edited task.
   * If the form is valid, a new Task object is created with the edited values,
   * and the MatDialogRef is closed with this new Task object.
   */
  save(): void {
    if (this.taskForm.valid) {
      const updatedTask: Task = new Task({
        ...this.data.task,
        ...this.taskForm.value
      });
      this.dialogRef.close(updatedTask);
    }
  }

  
  /**
   * Close the dialog without saving any changes.
   * The MatDialogRef is closed with no value.
   */
  cancel(): void {
    this.dialogRef.close();
  }
}