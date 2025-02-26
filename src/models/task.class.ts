import { Timestamp } from 'firebase/firestore';

export class Task {
  id?: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'to Do' | 'in progress' | 'done';
  createdAt: Date;

  constructor(obj?: Partial<Task>) {
    this.id = obj?.id;
    this.title = obj?.title || '';
    this.description = obj?.description || '';
    if (obj?.dueDate && typeof (obj.dueDate as any).toDate === 'function') {
      this.dueDate = (obj.dueDate as any).toDate();
    } else {
      this.dueDate = obj?.dueDate ? obj.dueDate as Date : new Date();
    }

    this.status = obj?.status || 'to Do';

    // Analog für createdAt
    if (obj?.createdAt && typeof (obj.createdAt as any).toDate === 'function') {
      this.createdAt = (obj.createdAt as any).toDate();
    } else {
      this.createdAt = obj?.createdAt ? obj.createdAt as Date : new Date();
    }
  }
  
  public toJSON() {
    return {
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}