import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { io } from 'socket.io-client';
import noteIcon from "./assets/noteIcon.png";
import plus from "./assets/plus.png";
const socket = io('http://localhost:4000'); // WebSocket URL

interface Task {
  task: string;
  createdAt: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  console.log(tasks)

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:4000/fetchAllTasks');
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();

    // Listen for new tasks from WebSocket
    socket.on('newTask', (task: Task) => {
      setTasks((prevTasks) => [...prevTasks, task]);
    });

    return () => {
      socket.off('newTask');
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  // Handle form submission to add new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      socket.emit('add', { task: newTask });
      setNewTask('');
    }
  };

  return (
    <div className="App">
      <div className='container'>
        <div className='heading'>
          <img src={noteIcon} alt="" />
          Note App
        </div>
        <div className='form-div'>
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              value={newTask}
              onChange={handleInputChange}
              placeholder="New Note..."
            />
            <button type="submit"> <img src={plus} alt="" />Add</button>
          </form>
        </div>
        <div className='all-notes'>
          <h2>Notes</h2>
          <div className='all-tasks'>
            <ul>
              {tasks.map((taskObj, index) => (
                <li key={index}>{taskObj.task} <hr /></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
