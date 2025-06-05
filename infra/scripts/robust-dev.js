const { spawn } = require("node:child_process");

function runDev() {
  const devProcess = spawn(
    "npm run services:up && npm run services:wait:database && npm run migrations:up && next dev",
    {
      stdio: "inherit",
      shell: true,
    },
  );

  devProcess.on("error", (err) => {
    if (err > 0) {
      console.error(`Error in npm run dev: ${err}`);
    }
  });

  process.on("SIGINT", () => {
    spawn("npm run services:stop", {
      stdio: "inherit",
      shell: true,
    });
  });
}

runDev();
