// Starts the backend and the frontend together.
// Extra words typed after "npm run dev" are ignored on purpose.
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const missing = ["node_modules", "server/node_modules", "client/node_modules"].filter(
  (dir) => !fs.existsSync(path.join(root, dir))
);
if (missing.length > 0) {
  console.error("\nPackages are not installed yet. Run this first:  npm run setup\n");
  process.exit(1);
}

const cmd =
  'npx concurrently -n server,client -c blue,green "npm run dev --prefix server" "npm run dev --prefix client"';
const child = spawn(cmd, { cwd: root, stdio: "inherit", shell: true });
child.on("exit", (code) => process.exit(code ?? 0));
