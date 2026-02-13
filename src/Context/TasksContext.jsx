/* src/context/TasksContext.jsx */
import { createContext, useContext, useState, useEffect } from "react";
import { suggestSubtasks } from "../services/aiService"; // Import our AI Brain

// 1. Create the Context
const TasksContext = createContext();

// 2. The Provider (The Brain)
export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  
  // The Address of your Backend
  const API_URL = "http://localhost:5000/tasks";

  // --- 1. FETCH (Load on startup) ---
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setTasks(data); // Put the server data into State
      } catch (error) {
        console.error("❌ Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []); // Run once when app starts

  // --- 2. ADD (Send to Server) ---
  const addTask = async (text) => {
    const newTask = { 
      id: String(Date.now()), // JSON Server likes String IDs
      text, 
      completed: false 
    };

    // Optimistic Update (Show it immediately)
    setTasks(prev => [...prev, newTask]);

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      });
    } catch (error) {
      console.error("Error adding task:", error);
      // Rollback if server fails (optional advanced step)
    }
  };

  // --- 3. DELETE (Tell Server to remove) ---
  const deleteTask = async (id) => {
    // Optimistic Update
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // --- 4. TOGGLE (Tell Server to update) ---
  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    const updatedTask = { ...task, completed: !task.completed };

    // Optimistic Update
    setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT", // or PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask)
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // --- 5. AI BREAKDOWN (The Special Sauce) ---
  const handleAiBreakdown = async (id, taskText) => {
    setIsThinking(true);
    try {
      // 1. Ask Gemini
      const subtasks = await suggestSubtasks(taskText);
      
      // 2. Create sub-tasks locally
      const newTasks = subtasks.map(step => ({
        id: String(Date.now() + Math.random()),
        text: `↳ ${step}`,
        completed: false
      }));

      // 3. Update State immediately
      setTasks(prev => [...prev, ...newTasks]);

      // 4. Save each new subtask to the Server (Loop)
      // Note: In a real app, we'd use a "Batch Create" endpoint, but JSON Server is simple.
      for (const task of newTasks) {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task)
        });
      }

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
    handleAiBreakdown
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}

// Custom Hook
export function useTasks() {
  return useContext(TasksContext);
}