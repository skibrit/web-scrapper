module.exports = {
  apps: [
    {
      name: "WebScrapper",
      exec_interpreter: "babel-node",
      script: "./src/server.js",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
