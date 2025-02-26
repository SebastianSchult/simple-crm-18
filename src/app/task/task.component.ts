import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Task } from '../../models/task.class';
import { TaskDialogComponent } from '../tasks/task-dialog/task-dialog.component';
import { FirebaseService } from '../services/firebase.service'; 

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'], 
})
export class TasksComponent implements OnInit {
  task = new Task();
  allTasks: any[] = [];
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[1]);
  readonly dialog = inject(MatDialog);

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.getTasks().subscribe((changes: any) => {
      this.allTasks = changes.map((u: any) => {
        if (
          u.dueDate &&
          typeof u.dueDate === 'object' &&
          'seconds' in u.dueDate
        ) {
          u.dueDate = new Date(u.dueDate.seconds * 1000);
        }
        return u;
      });
    });
  }

  openDialog(): void {
    this.dialog.open(TaskDialogComponent);
  }

  saveTask(task: Task): void {
    this.firebaseService.addTask(task)
  }
}