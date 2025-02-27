import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.class';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { DialogEditTaskComponent } from '../dialog-edit-task/dialog-edit-task.component'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskStateService } from '../services/task-state.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatMenuModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }
  ]
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  private route = inject(ActivatedRoute);
  private firebaseService = inject(FirebaseService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private taskStateService = inject(TaskStateService);

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      // Zuerst im globalen Signal nachsehen:
      const tasks = this.taskStateService.tasks();
      const foundTask = tasks.find(t => t.id === taskId);
      if (foundTask) {
        this.task = foundTask;
      } else {
        // Falls nicht vorhanden, über Firebase abrufen und den globalen Zustand aktualisieren.
        this.firebaseService.getTaskById(taskId)
          .then((data: Task) => {
            // Konvertieren Sie Firestore-Timestamps in Date, falls nötig:
            if (data.dueDate && typeof (data.dueDate as any).toDate === 'function') {
              data.dueDate = (data.dueDate as any).toDate();
            }
            if (data.createdAt && typeof (data.createdAt as any).toDate === 'function') {
              data.createdAt = (data.createdAt as any).toDate();
            }
            const taskInstance = new Task(data);
            this.task = taskInstance;
            // Optional: Globalen Zustand aktualisieren
            this.taskStateService.updateTask(taskInstance);
          })
          .catch((error: any) => {
            console.error('Error fetching task details:', error);
          });
      }
    }
  }

  editTask(): void {
    if (!this.task) return;
    const taskCopy = new Task({ ...this.task });
    const dialogRef = this.dialog.open(DialogEditTaskComponent, {
      data: { task: taskCopy }
    });
    dialogRef.afterClosed().subscribe((result: Task | undefined) => {
      if (result && result.id) {
        this.firebaseService.updateTask(result.id, result.toJSON())
          .then(() => {
            this.task = result;
            this.taskStateService.updateTask(result);
            this.openSnackBar('Task updated');
          })
          .catch((error: any) => {
            console.error('Error updating task:', error);
          });
      }
    });
  }

  deleteTask(): void {
    const taskId = this.task?.id;
    if (!taskId) {
      console.error('Keine gültige Task-ID gefunden');
      return;
    }
    if (!confirm('Möchten Sie diesen Task wirklich löschen?')) return;
  
    this.firebaseService.deleteTask(taskId)
      .then(() => {
        this.openSnackBar('Task deleted');
        this.taskStateService.deleteTask(taskId);
        this.router.navigate(['/tasks']);
      })
      .catch((error: any) => {
        console.error('Fehler beim Löschen des Tasks:', error);
      });
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message, 'Close', { duration: 3000 });
  }
}