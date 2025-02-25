import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, getCountFromServer } from '@angular/fire/firestore';
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
} 