import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Task } from '../../models/task.class';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly collection = 'tasks';

  constructor(private firestore: AngularFirestore) {}

  /**
   * Returns an observable that emits an array of all tasks in the Firestore 'tasks' collection.
   * Each task will have an 'id' field.
   * 
   * @returns An observable that emits an array of task objects.
   */
  getTasks() {
    return this.firestore.collection<Task>(this.collection).valueChanges({ idField: 'id' });
  }

  /**
   * Adds a new task document to the Firestore 'tasks' collection.
   * 
   * @param task The task data to add to the new task document.
   * @returns A promise that resolves with the document reference of the newly added task.
   */

  createTask(task: Task) {
    return this.firestore.collection<Task>(this.collection).add(task);
  }

  /**
   * Updates an existing task document in the Firestore 'tasks' collection.
   * 
   * @param id The ID of the task document to update.
   * @param task The data to update in the task document.
   * @returns A promise that resolves with the result of the update operation.
   */
  updateTask(id: string, task: Partial<Task>) {
    return this.firestore.doc<Task>(`${this.collection}/${id}`).update(task);
  }

  /**
   * Deletes a task document from the Firestore 'tasks' collection.
   * 
   * @param id The ID of the task document to delete.
   * @returns A promise that resolves with the result of the delete operation.
   */
  deleteTask(id: string) {
    return this.firestore.doc<Task>(`${this.collection}/${id}`).delete();
  }
}