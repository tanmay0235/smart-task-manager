import { useState, useEffect } from 'react';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';

function HomePage() {
  // 1. STATE MANAGEMENT
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');      // 'all', 'completed', 'pending'
  const [searchTerm, setSearchTerm] = useState(''); // Search text

  // 2. THE BRAIN: FETCH DATA (Search + Filter + Debounce)
  useEffect(() => {
    // Controller to cancel old requests if user types fast
    const controller = new AbortController();

    const fetchTasks = async () => {
      try {
        setIsLoading(true);

        // A. Build the URL smartly (No string concatenation errors)
        const url = new URL('http://localhost:5000/tasks');

        // B. Add Filter Params
        if (filter === 'completed') {
          url.searchParams.append('completed', 'true');
        } else if (filter === 'pending') {
          url.searchParams.append('completed', 'false');
        }

        // C. Add Search Params
        if (searchTerm) {
          url.searchParams.append('q', searchTerm);
        }

        // Debugging: See exactly what we are asking the server for
        console.log("Fetching URL:", url.toString());

        // D. The Request (Connected to the Abort Signal)
        const response = await fetch(url, { signal: controller.signal });
        
        if (!response.ok) throw new Error('Failed to fetch tasks');
        
        const data = await response.json();
        setTasks(data);
        setError(null);

      } catch (err) {
        // E. Ignore errors caused by us cancelling the request
        if (err.name !== 'AbortError') {
          setError(err.message);
          setTasks([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // F. Debounce Logic (Wait 500ms before sending request)
    const timerId = setTimeout(() => {
      fetchTasks();
    }, 500);

    // G. Cleanup (Runs if user types again or component unmounts)
    return () => {
      clearTimeout(timerId); // Stop the timer
      controller.abort();    // Cancel the network request
    };

  }, [filter, searchTerm]); // Re-run whenever Filter or Search changes


  // 3. CREATE TASK (POST)
  const addTask = async (taskText) => {
    const newTask = { text: taskText, completed: false };
    
    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error('Failed to add task');

      const data = await response.json(); // Get the saved task (with ID)
      setTasks([...tasks, data]);         // Add to UI
    } catch (err) {
      setError("Error adding task: " + err.message);
    }
  };


  // 4. UPDATE TASK (PATCH)
  const toggleComplete = async (id) => {
    const taskToToggle = tasks.find((t) => t.id === id);
    const updatedStatus = { completed: !taskToToggle.completed };

    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStatus),
      });

      if (!response.ok) throw new Error("Failed to update task");

      const data = await response.json();
      
      // Update only the matching task in the list
      setTasks(tasks.map((t) => (t.id === id ? data : t)));
    } catch (error) {
      setError(error.message);
    }
  };


  // 5. DELETE TASK (DELETE)
  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' });
      
      // Filter out the deleted task from UI
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      setError("Failed to delete task");
    }
  };


  // 6. THE UI RENDER
  return (
    <div className='home-page'>
      <h1>My Task Manager</h1>

      {isLoading && <p style={{ color: 'blue' }}>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <TaskInput onAddTask={addTask} />

      {/* SEARCH BAR */}
      <div className="search-bar" style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="Search tasks..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* FILTER TABS */}
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} disabled={filter === 'all'}>
          All
        </button>
        <button onClick={() => setFilter('pending')} disabled={filter === 'pending'}>
          Pending
        </button>
        <button onClick={() => setFilter('completed')} disabled={filter === 'completed'}>
          Completed
        </button>
      </div>

      {/* TASK LIST */}
      <TaskList 
        tasks={tasks} 
        onDeleteTask={deleteTask} 
        onToggleComplete={toggleComplete} 
      />
    </div>
  );
}

export default HomePage;