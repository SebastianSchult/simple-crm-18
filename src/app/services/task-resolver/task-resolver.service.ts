import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import { Task } from '../../../models/task.class';

@Injectable({
  providedIn: 'root'
})
export class TaskResolver implements Resolve<Task> {
  constructor(private firebaseService: FirebaseService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task> | Promise<Task> | Task {
    const taskId = route.paramMap.get('id') ?? ''; // Falls undefined, setze einen leeren String
    return this.firebaseService.getTaskById(taskId);
  }
}