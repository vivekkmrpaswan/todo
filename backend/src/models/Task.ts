import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TaskModel = mongoose.model('assignment_vivek', TaskSchema);

export default TaskModel;
