const app = require('./app');
const config = require('./config/env');

const server = app.listen(config.port, () => {
  console.log(`
🚀 Server running in ${config.nodeEnv} mode
📡 Port: ${config.port}
🌐 API Version: ${config.api.version}
📝 API Docs: http://localhost:${config.port}/api/${config.api.version}/health
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to uncaught exception');
  process.exit(1);
}); 