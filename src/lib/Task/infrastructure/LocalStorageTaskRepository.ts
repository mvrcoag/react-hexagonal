import { Task } from "../domain/Task";
import { TaskRepository } from "../domain/TaskRepository";

export const createLocalStorageTaskRepository = (): TaskRepository => {
  return {
    getAll: () => {
      const tasks = localStorage.getItem("tasks");
      const parsedTasks = tasks ? (JSON.parse(tasks) as Task[]) : [];
      return Promise.resolve(parsedTasks);
    },
    save: (task: Task) => {
      const tasks = localStorage.getItem("tasks");

      const parsedTasks = tasks ? (JSON.parse(tasks) as Task[]) : [];

      const taskExists = parsedTasks.findIndex((t) => t.id === task.id);

      // actualización
      if (taskExists !== -1) {
        parsedTasks[taskExists] = task;
      } else {
        // creación
        parsedTasks.push(task);
      }

      localStorage.setItem("tasks", JSON.stringify(parsedTasks));

      return Promise.resolve();
    },
    delete: (id: string) => {
      const tasks = localStorage.getItem("tasks");

      const parsedTasks = tasks ? (JSON.parse(tasks) as Task[]) : [];

      const newTasks = parsedTasks.filter((t) => t.id !== id);

      localStorage.setItem("tasks", JSON.stringify(newTasks));

      return Promise.resolve();
    },
  };
};
