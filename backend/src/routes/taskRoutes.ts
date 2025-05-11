import express from 'express';
import { getAllTasks } from '../controllers/taskController';

const router = express.Router();

// GET /fetchAllTasks
router.get('/', getAllTasks);

export default router;
