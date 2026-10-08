// Installs server + client packages and builds the React app.
// Used locally and by Render. Extra words after "npm run build" are ignored.
const { execSync } = require("child_process");

const steps = [
  "npm install --prefix server",
  "npm install --prefix client --include=dev",
  "npm run build --prefix client",
];

for (const cmd of steps) {
  console.log(`\n>>> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}
