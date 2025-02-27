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
@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatMenuModule, MatButtonModule],
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

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.firebaseService.getTaskById(taskId)
        .then((data: Task) => {
          if (data.dueDate && typeof (data.dueDate as any).toDate === 'function') {
            data.dueDate = (data.dueDate as any).toDate();
          }
          if (data.createdAt && typeof (data.createdAt as any).toDate === 'function') {
            data.createdAt = (data.createdAt as any).toDate();
          }
          this.task = new Task(data);
        })
        .catch((error: any) => {
          console.error('Error fetching task details:', error);
        });
    }
  }

  /**
   * Opens a dialog to edit the currently loaded task.
   * If the dialog is confirmed with a new task, the component's task is updated.
   * If the dialog is canceled, the component's task remains unchanged.
   */
  editTask(): void {
    if (!this.task) return;
    const taskCopy = new Task({ ...this.task });
    const dialogRef = this.dialog.open(DialogEditTaskComponent, {
      data: { task: taskCopy }
    });
    dialogRef.afterClosed().subscribe((result: Task | undefined) => {
      if (result) {
        this.task = result;
      }
    });
  }

/**
 * Deletes the currently loaded task after user confirmation.
 * If the task is successfully deleted, navigates to the '/tasks' route.
 * Logs an error if the deletion fails.
 */

deleteTask(): void {
  if (!this.task?.id) {
    console.error('Keine gültige Task-ID gefunden');
    return;
  }
  if (!confirm('Möchten Sie diesen Task wirklich löschen?')) return;
  this.firebaseService.deleteTask(this.task.id)
    .then(() => {
      this.router.navigate(['/tasks']);
    })
    .catch((error: any) => {
      console.error('Fehler beim Löschen des Tasks:', error);
    });
}

}