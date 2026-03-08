import { createContext, useContext, useState, useEffect } from "react";
import { suggestSubtasks } from "../services/aiService"; 

const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  
  // 1. UPDATED ADDRESS
  // Updated the url
  const API_URL = "https://smart-task-manager-0qdz.onrender.com/api/tasks";

  // --- 1. FETCH (Load on startup) ---
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // TRANSLATOR: React likes 'id', but Mongo uses '_id'. Let's map it!
        const translatedTasks = data.map(dbTask => ({
            ...dbTask,
            id: dbTask._id 
        }));
        
        setTasks(translatedTasks);
      } catch (error) {
        console.error("❌ Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []); 

  // --- 2. ADD (Send to Server) ---
  const addTask = async (text) => {
    try {
      // 1. Send to database FIRST to get the real permanent ID
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, completed: false, parentId: null })
      });
      
      const savedTask = await response.json();
      
      // 2. Put the REAL task into React state
      const taskForScreen = { ...savedTask, id: savedTask._id };
      setTasks(prev => [...prev, taskForScreen]);

    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // --- 3. DELETE (Tell Server to remove) ---
  const deleteTask = async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // --- 4. TOGGLE & EDIT (Tell Server to update) ---
  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    const updatedTask = { ...task, completed: !task.completed };

    setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask)
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const editTask = async (id, newText) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, text: newText } : t
    ));

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT", // Changed to PUT to match your backend route
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText })
      });
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

// --- 5. AI BREAKDOWN ---
  const handleAiBreakdown = async (parentId, taskText) => {
    setIsThinking(true);
    try {
      const subtasks = await suggestSubtasks(taskText);
      const savedSubtasks = [];
      
      // Save each to server FIRST so the database generates real IDs
      for (const step of subtasks) {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: step, parentId: parentId, completed: false })
        });
        
        const dbTask = await response.json();
        // Translate the Mongo _id before saving to state
        savedSubtasks.push({ ...dbTask, id: dbTask._id });
      }

      // Update Screen with the real saved tasks
      setTasks(prev => [...prev, ...savedSubtasks]);

    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const value = {
    tasks,
    isThinking,
    addTask,
    deleteTask,
    toggleComplete,
    editTask,
    handleAiBreakdown
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}