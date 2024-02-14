module.exports = {
  apps : [{
    name: "movies",
    script: "./dist/infra/server.js",
    env: {
      NODE_ENV: "dev",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
