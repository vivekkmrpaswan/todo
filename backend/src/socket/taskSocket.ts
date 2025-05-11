import { Server } from 'socket.io';
import { redisClient } from '../config/redisClient';
import TaskModel from '../models/Task';

const REDIS_KEY = 'FULLSTACK_TASK_VIVEK';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('🟢 Client connected:', socket.id);

    socket.on('add', async (data) => {
      try {
        if (typeof data?.task !== 'string') {
          console.warn('❌ Invalid task format:', data);
          socket.emit('taskAdded', { success: false, message: 'Task must be a string' });
          return;
        }
    
        const task = data.task;
        const dataFromRedis = await redisClient.get(REDIS_KEY);
        let tasks = dataFromRedis ? JSON.parse(dataFromRedis) : [];
    
        const newTask = { task, createdAt: new Date() };
        tasks.push(newTask);
    
        if (tasks.length > 50) {
          await TaskModel.insertMany(tasks);
          await redisClient.del(REDIS_KEY);
          console.log('📦 Tasks moved to MongoDB and Redis flushed');
        } else {
          await redisClient.set(REDIS_KEY, JSON.stringify(tasks));
          console.log('➕ Task added to Redis');
        }
    
        io.emit('newTask', newTask);
    
      } catch (err) {
        console.error('❌ Error handling add event:', err);
        socket.emit('taskAdded', { success: false, message: 'Internal error' });
      }
    });
      
    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected:', socket.id);
    });
  });
};
