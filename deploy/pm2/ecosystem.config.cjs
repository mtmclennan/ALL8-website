const path = require("node:path");

const appRoot = path.resolve(__dirname, "../..");

module.exports = {
  apps: [
    {
      name: "all8-webworks",
      cwd: appRoot,
      script: path.join(appRoot, "node_modules", "next", "dist", "bin", "next"),
      args: ["start", "-p", "3000", "-H", "127.0.0.1"],
      interpreter: process.execPath,
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      kill_timeout: 10000,
      listen_timeout: 10000,
      time: true,
      env_production: {
        NODE_ENV: "production",
        DEPLOYMENT_ENV: "production",
      },
    },
  ],
};
