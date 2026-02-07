import { useState, useEffect } from 'react'; // <--- FIXED: Removed ', use'
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';

function HomePage() {
  // 1. STATE: Start with empty array + loading states
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. EFFECT: Fetch data when the page loads
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log("Fetching started...");
        const response = await fetch('http://localhost:5000/tasks');
        
        if (!response.ok) {
          throw new Error('Failed to connect to the server');
        }
        
        const data = await response.json();
        console.log("Data received:", data); // Check your console for this!
        setTasks(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching:", err);
        setError(err.message);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // 3. CREATE: Add a task to the server
  const addTask = async (taskText) => {
    // A. Create the task object (Server will create the ID, so we don't need Date.now())
    const newTask = { 
      text: taskText, 
      completed: false 
    };

    try {
      // B. Send the POST request
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST', // <--- Tell server we are ADDING data
        headers: {
          'Content-Type': 'application/json', // <--- Tell server we are sending JSON
        },
        body: JSON.stringify(newTask), // <--- Convert JS object to text
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      // C. Get the saved task back (It now has a real ID from the server!)
      const data = await response.json();

      // D. Update the UI with the *real* saved task
      setTasks([...tasks, data]); 
      
    } catch (err) {
      setError("Error adding task: " + err.message);
    }
  };

  // 5. UPDATE: Toggle completed status on server
  const toggleComplete = async (IdtoToggle) => {
    // 1. Find the task we want to toggle
    const taskToToggle = tasks.find((task) => task.id === IdtoToggle);
    
    // 2. Calculate the new status (Opposite of current)
    const updatedStatus = { completed: !taskToToggle.completed };

    try {
      // 3. Send a PATCH request (PATCH means "Update only part of the data")
      const response = await fetch(`http://localhost:5000/tasks/${IdtoToggle}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStatus),
      });

      if (!response.ok) throw new Error("Failed to update task");

      // 4. Update the UI with the new data from server
      const updatedTaskFromServer = await response.json();
      
      setTasks(tasks.map((task) => 
        task.id === IdtoToggle ? updatedTaskFromServer : task
      ));

    } catch (error) {
      setError("Error updating task: " + error.message);
    }
  };

  // 4. DELETE: Remove task from server
  const deleteTask = async (IdtoDelete) => {
    try {
      // A. Tell Server to delete
      await fetch(`http://localhost:5000/tasks/${IdtoDelete}`, {
        method: 'DELETE',
      });

      // B. Update UI (Filter out the deleted one)
      setTasks(tasks.filter((task) => task.id !== IdtoDelete));
    
    } catch (error) {
      setError("Failed to delete task");
    }
  };
  return (
    <div className='home-page'>
      <h1>My Task Manager</h1>

      {/* Show Loading or Error Status */}
      {isLoading && <p style={{ color: 'blue' }}>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <TaskInput onAddTask={addTask} />
      <TaskList 
        tasks={tasks} 
        onDeleteTask={deleteTask} 
        onToggleComplete={toggleComplete} 
      />
    </div>
  );
}

export default HomePage;