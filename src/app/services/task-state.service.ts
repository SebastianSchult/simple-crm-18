import { Injectable, signal } from '@angular/core';
import { Task } from '../../models/task.class';

@Injectable({
  providedIn: 'root'
})
export class TaskStateService {
  tasks = signal<Task[]>([]);

  setTasks(newTasks: Task[]): void {
    this.tasks.set(newTasks);
  }

  addTask(newTask: Task): void {
    this.tasks.update(tasks => [...tasks, newTask]);
  }

  updateTask(updatedTask: Task): void {
    this.tasks.update(tasks =>
      tasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
  }

  deleteTask(taskId: string): void {
    this.tasks.update(tasks =>
      tasks.filter(task => task.id !== taskId)
    );
  }
}