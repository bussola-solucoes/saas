module.exports = {
  apps: [
    {
      name: 'whatsapp-server',
      exec_mode: 'cluster',
      instances: '1', // Or a number of instances
      script: 'dist/src/main.js',
      args: 'start',
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }
  ]
}