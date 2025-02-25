import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../../models/task.class';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.taskForm = this.fb.group({
      title: [data.title, Validators.required],
      description: [data.description],
      dueDate: [data.dueDate, Validators.required],
      status: [data.status, Validators.required]
    });
  }

  save(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close({
        ...this.taskForm.value,
        dueDate: new Date(this.taskForm.value.dueDate)
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}