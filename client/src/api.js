// All communication with the Express backend lives here
const BASE = "/api/todos";

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

export const getTodos = () => request(BASE);

export const createTodo = (text) =>
  request(BASE, { method: "POST", body: JSON.stringify({ text }) });

export const updateTodo = (id, changes) =>
  request(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(changes) });

export const deleteTodo = (id) => request(`${BASE}/${id}`, { method: "DELETE" });

export const clearCompletedTodos = () =>
  request(`${BASE}/completed`, { method: "DELETE" });
