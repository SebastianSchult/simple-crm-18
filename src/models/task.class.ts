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
        this.dueDate = obj?.dueDate || new Date();
        this.status = obj?.status || 'to Do';
        this.createdAt = obj?.createdAt || new Date();
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

  
