# Full-Stack To-Do List (React + Node.js + SQLite)

A full-stack web application with three layers:

| Layer | Technology | Folder |
|-------|-----------|--------|
| Frontend | React 18 + Vite | `client/` |
| Backend (REST API) | Node.js + Express | `server/` |
| Database | SQLite (file database) | `server/data/todos.db` (created automatically) |

## Features
- Add, complete, and delete tasks (stored in the database)
- Filter tasks: All / Active / Completed
- Remaining-tasks counter and "Clear completed"
- Input validation and error messages
- Data stays after page refresh and server restart

## Run on your computer
1. Install [Node.js](https://nodejs.org) (LTS version).
2. Open a terminal **inside this folder** (the one containing this README) and run these **one at a time**, waiting for each to finish:
   ```bash
   npm run setup
   ```
   ```bash
   npm run dev
   ```
3. Open **http://localhost:5173** in your browser.
   (The backend runs on http://localhost:5000 and the frontend talks to it automatically.)

## Run as a single production server
```bash
npm run build
npm start
```
Open **http://localhost:5000**. Express serves both the API and the built React app.

## REST API
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/todos` | Get all tasks |
| POST | `/api/todos` | Create a task. Body: `{ "text": "..." }` |
| PUT | `/api/todos/:id` | Update a task. Body: `{ "done": true }` and/or `{ "text": "..." }` |
| DELETE | `/api/todos/:id` | Delete one task |
| DELETE | `/api/todos/completed` | Delete all completed tasks |
| GET | `/api/health` | Health check |

## Database schema
```sql
CREATE TABLE todos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  text       TEXT    NOT NULL,
  done       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

## Deploy (Render, free) - one link for frontend + backend + database
1. Push this folder to a GitHub repository.
2. On [render.com](https://render.com): **New + > Web Service** > connect the repository.
3. Use these settings:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Instance type:** Free
4. Click **Create Web Service**. After a few minutes you get a link like `https://your-app.onrender.com`.

Note: on Render's free plan the file system is temporary, so saved tasks can reset when the service restarts or is redeployed, and the first load after inactivity can take about a minute. This is fine for a demo.

## Project structure
```
todo-fullstack/
├── package.json          (root scripts: setup, dev, build, start)
├── scripts/              (setup.js, dev.js, build.js helper scripts)
├── client/               (React frontend)
│   ├── index.html
│   ├── vite.config.js    (dev proxy: /api -> localhost:5000)
│   └── src/
│       ├── main.jsx
│       ├── App.jsx       (UI + state)
│       ├── api.js        (fetch calls to the backend)
│       └── App.css
└── server/               (Node + Express backend)
    ├── index.js          (server setup, serves React build)
    ├── db.js             (SQLite connection + table creation)
    └── routes/todos.js   (REST API routes)
```
