import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Task } from '../../models/task.class';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly collection = 'tasks';

  constructor(private firestore: AngularFirestore) {}

  getTasks() {
    return this.firestore.collection<Task>(this.collection).valueChanges({ idField: 'id' });
  }

  createTask(task: Task) {
    return this.firestore.collection<Task>(this.collection).add(task);
  }

  updateTask(id: string, task: Partial<Task>) {
    return this.firestore.doc<Task>(`${this.collection}/${id}`).update(task);
  }

  deleteTask(id: string) {
    return this.firestore.doc<Task>(`${this.collection}/${id}`).delete();
  }
}