import { useState, useEffect } from "react";
import "./App.css";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  clearCompletedTodos,
} from "./api";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load tasks from the backend when the page opens
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Run an API action and show any error message
  const run = async (action) => {
    try {
      setError("");
      await action();
    } catch (e) {
      setError(e.message);
    }
  };

  const addTodo = () =>
    run(async () => {
      if (task.trim() === "") return;
      const created = await createTodo(task);
      setTodos([...todos, created]);
      setTask("");
    });

  const toggleTodo = (todo) =>
    run(async () => {
      const updated = await updateTodo(todo.id, { done: !todo.done });
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    });

  const removeTodo = (id) =>
    run(async () => {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    });

  const clearCompleted = () =>
    run(async () => {
      await clearCompletedTodos();
      setTodos(todos.filter((t) => !t.done));
    });

  const visibleTodos = todos.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "completed") return t.done;
    return true;
  });

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="container">
      <h1>My To-Do List</h1>
      <p className="subtitle">React + Node.js + SQLite</p>

      {error && <div className="error">{error}</div>}

      <div className="input-row">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a new task..."
          maxLength={200}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <div className="filters">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            className={filter === f ? "filter active" : "filter"}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul>
        {loading && <li className="empty">Loading...</li>}
        {!loading && visibleTodos.length === 0 && (
          <li className="empty">No tasks here.</li>
        )}
        {visibleTodos.map((t) => (
          <li key={t.id}>
            <span onClick={() => toggleTodo(t)} className={t.done ? "done" : ""}>
              {t.text}
            </span>
            <button className="delete" onClick={() => removeTodo(t.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="footer">
        <span>
          {remaining} {remaining === 1 ? "task" : "tasks"} remaining
        </span>
        <button className="link" onClick={clearCompleted}>
          Clear completed
        </button>
      </div>
    </div>
  );
}

export default App;
