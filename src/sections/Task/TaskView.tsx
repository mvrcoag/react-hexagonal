import { FormEventHandler, useEffect, useState } from "react";
import { createTaskService } from "../../lib/Task/application/TaskService";
import { createLocalStorageTaskRepository } from "../../lib/Task/infrastructure/LocalStorageTaskRepository";
import {
  Task,
  generateTaskId,
  isValidTaskTitle,
} from "../../lib/Task/domain/Task";

const repository = createLocalStorageTaskRepository();
const service = createTaskService(repository);

export default function TaskView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [formErrors, setFormErrors] = useState<{
    title: string | null;
  }>({ title: null });

  const submit: FormEventHandler = (event) => {
    event.preventDefault();

    const isValid = isValidTaskTitle(title);
    setFormErrors((prev) => ({
      ...prev,
      title: isValid ? null : "Invalid title",
    }));
    if (!isValid) return;

    service
      .save(generateTaskId(), title, false)
      .then(() => {
        fetchTasks();
        setTitle("");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const fetchTasks = () => {
    service
      .getAll()
      .then((tasks) => {
        setTasks(tasks);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const toggleTask = (task: Task) => {
    service
      .save(task.id, task.title, !task.isDone)
      .then(() => {
        fetchTasks();
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const deleteTask = (task: Task) => {
    const isConfirmed = confirm("Are you sure?");
    if (!isConfirmed) return;
    service
      .delete(task.id)
      .then(() => {
        fetchTasks();
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setFormErrors((prev) => ({
      ...prev,
      title: null,
    }));
  }, [title]);

  return (
    <div>
      <h1>TaskView</h1>

      {tasks.length === 0 && <p>No tasks</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <div style={{ display: "flex" }}>
              <button
                onClick={() => {
                  toggleTask(task);
                }}
              >
                {task.isDone ? "🟢" : "⚪️"}
              </button>
              <p>{task.isDone ? <s>{task.title}</s> : task.title}</p>
              <button
                onClick={() => {
                  deleteTask(task);
                }}
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={submit}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <button type="submit">Add task</button>
      </form>

      {formErrors.title !== null && <p>{formErrors.title}</p>}
    </div>
  );
}
