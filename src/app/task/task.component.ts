import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { query, orderBy } from 'firebase/firestore';
import { Task } from '../../models/task.class';
import { TaskDialogComponent } from '../tasks/task-dialog/task-dialog.component';

@Component({
  selector: 'app-user',
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
  styleUrl: './task.component.scss',
})
export class TasksComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  task = new Task();
  allTasks: any[] = [];
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[1]);
  readonly dialog = inject(MatDialog);

  /**
   * Initializes the component by fetching and subscribing to user data from Firestore.
   * Sorts the users by their last name and converts Firestore timestamp to JavaScript Date object for birthDate.
   * Updates the allUsers array with the fetched and processed user data.
   */

  ngOnInit(): void {
    const tasksCollection = collection(this.firestore, 'tasks');
    const sortedQuery = query(tasksCollection, orderBy('title'));

    collectionData(sortedQuery, { idField: 'id' }).subscribe((changes: any) => {
      console.log('Changes:', changes);
      this.allTasks = changes.map((u: any) => {
        if (
          u.dueDate &&
          typeof u.birthDate === 'object' &&
          'seconds' in u.dueDate
        ) {
          u.dueDate = new Date(u.dueDate.seconds * 1000);
        }
        return u;
      });
    });
  }

  /**
   * Opens the DialogAddUserComponent dialog with the MatDialog service.
   * The MatDialog service will create and open the dialog with the given component.
   * The user can then interact with the dialog to add a new user.
   */
  openDialog(): void {
    this.dialog.open(TaskDialogComponent);
  }
}
