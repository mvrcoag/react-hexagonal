import { Task } from "../domain/Task";
import { TaskRepository } from "../domain/TaskRepository";

export const createFetchTaskRepository = (): TaskRepository => {
  return {
    getAll: async () => {
      const response = await fetch("http://miapi.com/tasks");
      const tasks = (await response.json()) as Task[];
      return tasks;
    },
    save: async (task: Task) => {
      await fetch("http://miapi.com/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
    },
    delete: async (id: string) => {
      await fetch(`http://miapi.com/tasks/${id}`, {
        method: "DELETE",
      });
    },
  };
};
