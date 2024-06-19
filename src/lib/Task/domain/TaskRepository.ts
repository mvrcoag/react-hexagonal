import { Task } from "./Task";

export interface TaskRepository {
  getAll(): Promise<Task[]>;
  save(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
}
