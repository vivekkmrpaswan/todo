import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes';
import { setupSocket } from './socket/taskSocket';
import { connectToMongo } from './config/mongoClient';
import { redisClient } from './config/redisClient';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/fetchAllTasks', taskRoutes);


// Setup Redis and Mongo
redisClient.connect().catch(console.error);
connectToMongo();

// WebSocket setup
setupSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
