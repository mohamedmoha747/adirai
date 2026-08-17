import http from 'http';
import app from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { initSocket } from './services/socket.js';

const server = http.createServer(app);
initSocket(server);

connectDb(env.mongoUri)
  .then(() => {
    server.listen(env.port, () => {
      console.log(`Adirai API listening on port ${env.port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
