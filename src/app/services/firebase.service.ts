import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, getCountFromServer } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) { }

  getUsers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'id' });
  }

  addUser(data: any): Promise<any> {
    const usersCollection = collection(this.firestore, 'users');
    return addDoc(usersCollection, data);
  }


  updateUser(id: string, data: any): Promise<any> {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return updateDoc(userDocRef, data);
  }

  deleteUser(id: string): Promise<any> {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return deleteDoc(userDocRef);
  }

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