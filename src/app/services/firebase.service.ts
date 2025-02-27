import { Task } from './../../models/task.class';
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, getDoc, doc, updateDoc, deleteDoc, getCountFromServer, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) { }


  
  /**
   * Retrieves a list of users from the Firestore 'users' collection.
   * Each user document includes an auto-generated 'id' field.
   * 
   * @returns An observable array of user objects.
   */

  getUsers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'id' });
  }

  
  /**
   * Adds a new user document to the Firestore 'users' collection.
   * Each user document will have an auto-generated 'id' field.
   * 
   * @param data The data to add to the new user document.
   * @returns A promise that resolves with the ID of the new user document.

   */
  addUser(data: any): Promise<any> {
    const usersCollection = collection(this.firestore, 'users');
    return addDoc(usersCollection, data);
  }


  
  /**
   * Updates an existing user document in the Firestore 'users' collection.
   * 
   * @param id The ID of the user document to update.
   * @param data The data to update in the user document.
   * @returns A promise that resolves with the result of the update operation.
   */
  updateUser(id: string, data: any): Promise<any> {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return updateDoc(userDocRef, data);
  }

  
  /**
   * Deletes a user document from the Firestore 'users' collection.
   * 
   * @param id The ID of the user document to delete.
   * @returns A promise that resolves with the result of the delete operation.
   */
  deleteUser(id: string): Promise<any> {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return deleteDoc(userDocRef);
  }

  
  /**
   * Returns an observable that emits an array of all tasks in the Firestore 'tasks' collection.
   * Each task will have an 'id' field.
   * 
   * @returns An observable that emits an array of task objects.
   */
  getTasks(): Observable<any[]> {
    const tasksCollection = collection(this.firestore, 'tasks');
    return collectionData(tasksCollection, { idField: 'id' });
  }
  async getUsersCount(): Promise<number> {
    const usersCol = collection(this.firestore, 'users');
    const snapshot = await getCountFromServer(usersCol);
    return snapshot.data().count;
  }

  /**
   * Adds a new task document to the Firestore 'tasks' collection.
   * Each task document will have an auto-generated 'id' field.
   * 
   * @param task The task data to add to the new task document.
   * @returns A promise that resolves with a DocumentReference to the newly added task.
   * Logs messages to the console upon success or failure.
   * @throws Will throw an error if the task could not be saved.
   */

  addTask(task: any): Promise<DocumentReference> {
    if (!task.createdAt) {
      task.createdAt = new Date();
    }
    const tasksCollection = collection(this.firestore, 'tasks');
    return addDoc(tasksCollection, task)
      .then((docRef) => {
        return docRef;
      })
      .catch((error) => {
        console.error('Error saving task:', error);
        throw error;
      });
  }

  /**
   * Retrieves the total number of tasks in the Firestore 'tasks' collection.
   * 
   * @returns A promise that resolves with the total number of tasks.
   */
  async getTasksCount(): Promise<number> {
    const tasksCollection = collection(this.firestore, 'tasks');
    const snapshot = await getCountFromServer(tasksCollection);
    return snapshot.data().count;
  }

  /**
   * Retrieves a task document from the Firestore 'tasks' collection by its ID.
   * 
   * @param taskId The ID of the task document to retrieve.
   * @returns A promise that resolves with the Task object for the retrieved task.
   * @throws Will throw an error if the task does not exist.
   */
  async getTaskById(taskId: string): Promise<Task> {
    const taskDocRef = doc(this.firestore, 'tasks', taskId);
    const taskSnap = await getDoc(taskDocRef);
    if (taskSnap.exists()) {
      return new Task({ id: taskSnap.id, ...taskSnap.data() });
    } else {
      throw new Error('No such task!');
    }
  }

  /**
   * Deletes a task document from the Firestore 'tasks' collection by its ID.
   * 
   * @param taskId The ID of the task document to delete.
   * @returns A promise that resolves when the delete operation is complete.
   */
  deleteTask(taskId: string): Promise<void> {
    const taskDocRef = doc(this.firestore, 'tasks', taskId);
    return deleteDoc(taskDocRef);
  }

  updateTask(taskId: string, updatedData: any): Promise<void> {
    const taskDocRef = doc(this.firestore, 'tasks', taskId);
    return updateDoc(taskDocRef, updatedData);
  }
} 