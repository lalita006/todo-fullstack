import { Router } from "express";
import db from "../db.js";

const router = Router();

// Convert a database row into the JSON shape used by the frontend
const toTodo = (row) => ({
  id: row.id,
  text: row.text,
  done: Boolean(row.done),
  createdAt: row.created_at,
});

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// GET /api/todos  -> list all tasks
router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM todos ORDER BY id").all();
  res.json(rows.map(toTodo));
});

// POST /api/todos  -> create a task  { text }
router.post("/", (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text) return res.status(400).json({ error: "Task text is required" });
  if (text.length > 200)
    return res.status(400).json({ error: "Task text must be 200 characters or less" });

  const info = db.prepare("INSERT INTO todos (text) VALUES (?)").run(text);
  const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(toTodo(row));
});

// DELETE /api/todos/completed  -> remove all completed tasks
router.delete("/completed", (req, res) => {
  const info = db.prepare("DELETE FROM todos WHERE done = 1").run();
  res.json({ deleted: info.changes });
});

// PUT /api/todos/:id  -> update a task  { text?, done? }
router.put("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid id" });

  const existing = db.prepare("SELECT * FROM todos WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Task not found" });

  let text = existing.text;
  if (req.body?.text !== undefined) {
    text = typeof req.body.text === "string" ? req.body.text.trim() : "";
    if (!text) return res.status(400).json({ error: "Task text cannot be empty" });
  }
  const done = req.body?.done !== undefined ? (req.body.done ? 1 : 0) : existing.done;

  db.prepare("UPDATE todos SET text = ?, done = ? WHERE id = ?").run(text, done, id);
  const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(id);
  res.json(toTodo(row));
});

// DELETE /api/todos/:id  -> remove one task
router.delete("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid id" });

  const info = db.prepare("DELETE FROM todos WHERE id = ?").run(id);
  if (info.changes === 0) return res.status(404).json({ error: "Task not found" });
  res.status(204).end();
});

export default router;
