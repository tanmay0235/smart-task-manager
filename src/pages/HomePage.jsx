/* src/components/HomePage.jsx */
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import { useTasks } from '../Context/TasksContext'; // 1. Import the Hook

function HomePage() {
  // 2. Grab EVERYTHING we need from the Context (The Engine Room)
  const { tasks, addTask, deleteTask, toggleComplete, handleAiBreakdown, isThinking } = useTasks();

  return (
    <div className="home-page">
      <h1>AI Task Master 🤖</h1>
      
      {/* 3. Pass functions directly. No more "State" management here! */}
      <TaskInput onAddTask={addTask} />
      
      {/* Loading Banner */}
      {isThinking && (
        <div style={{ padding: "10px", background: "#e0f7fa", color: "#006064", borderRadius: "8px", margin: "10px 0", textAlign: "center" }}>
          ✨ AI is brainstorming...
        </div>
      )}

      <TaskList 
        tasks={tasks} 
        onDeleteTask={deleteTask} 
        onToggleComplete={toggleComplete} 
        onAiBreakdown={handleAiBreakdown}
      />
    </div>
  );
}

export default HomePage;