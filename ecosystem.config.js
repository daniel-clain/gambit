module.exports = {
  apps: [
    {
      name: "gambit", // Name of your app
      script: "npm",
      args: "run run-prod-backend", // The npm script to run
      interpreter: "none", // Use the system shell to run the npm script
      env: {
        NODE_ENV: "development", // Environment variables for development
      },
      env_production: {
        NODE_ENV: "production", // Environment variables for production
      },
      watch: true, // Optional: Restart app when files change
    },
  ],
}
