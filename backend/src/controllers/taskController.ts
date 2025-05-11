import { Request, Response } from 'express';
import { redisClient } from '../config/redisClient';
import TaskModel from '../models/Task';

const REDIS_KEY = 'FULLSTACK_TASK_VIVEK';

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    // Get tasks from Redis
    const cachedData = await redisClient.get(REDIS_KEY);
    const redisTasks = cachedData ? JSON.parse(cachedData) : [];

    // Get tasks from MongoDB
    const mongoTasks = await TaskModel.find({}).lean();

    const allTasks = [...redisTasks, ...mongoTasks];

    res.status(200).json({ success: true, tasks: allTasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
