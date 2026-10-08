// Installs packages for the root, server and client folders.
// Extra words typed after "npm run setup" are ignored on purpose.
const { execSync } = require("child_process");

const steps = [
  ["root", "npm install"],
  ["server", "npm install --prefix server"],
  ["client", "npm install --prefix client --include=dev"],
];

for (const [name, cmd] of steps) {
  console.log(`\n>>> Installing ${name} packages...`);
  execSync(cmd, { stdio: "inherit" });
}

console.log("\nSetup complete. Now run:  npm run dev");
