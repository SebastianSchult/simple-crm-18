import { Task } from './../../models/task.class';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  private route = inject(ActivatedRoute);
  private firebaseService = inject(FirebaseService);

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.firebaseService.getTaskById(taskId)
        .then((data: Task) => {
          // Erstellen einer neuen Instanz von Task, die bereits die Umwandlung vornimmt.
          this.task = new Task(data);
          console.log('Task Details:', this.task);
        })
        .catch((error: any) => {
          console.error('Error fetching task details:', error);
        });
    }
  }
}