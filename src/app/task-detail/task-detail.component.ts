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
import { DialogEditTaskComponent } from '../dialog-edit-task/dialog-edit-task.component'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskStateService } from '../services/task-state.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatMenuModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
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
    this.route.data.subscribe((data) => {
      if (data['task']) {
        this.task = data['task'];
      } else {
        console.error('Fehler: Task-Daten nicht gefunden.');
        this.task = null; // Fallback für Sicherheit
      }
    });
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
            this.openSnackBar('Task aktualisiert');
          })
          .catch((error: any) => {
            console.error('Fehler beim Aktualisieren des Tasks:', error);
          });
      }
    });
  }

  deleteTask(): void {
    if (!this.task || !this.task.id) { // Sicherheit gegen 'null' oder 'undefined'
      console.error('Keine gültige Task-ID gefunden');
      return;
    }

    const taskId: string = this.task.id; // Erzwingt Typensicherheit

    if (!confirm('Möchten Sie diesen Task wirklich löschen?')) return;

    this.firebaseService.deleteTask(taskId)
      .then(() => {
        this.openSnackBar('Task gelöscht');
        this.taskStateService.deleteTask(taskId);
        this.router.navigate(['/tasks']);
      })
      .catch((error: any) => {
        console.error('Fehler beim Löschen des Tasks:', error);
      });
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message, 'Schließen', { duration: 3000 });
  }
}