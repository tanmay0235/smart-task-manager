/* src/components/TaskItem.jsx */
import { useState } from 'react';
import { useTasks } from '../Context/TasksContext';

function TaskItem({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [isExpanded, setIsExpanded] = useState(true);
  
  const { tasks, deleteTask, toggleComplete, editTask, handleAiBreakdown } = useTasks();

  // 1. Find Children & Calculate Progress
  const childTasks = tasks.filter(t => t.parentId === task.id);
  const hasChildren = childTasks.length > 0;
  
  const totalChildren = childTasks.length;
  const completedChildren = childTasks.filter(t => t.completed).length;
  const progress = totalChildren === 0 ? 0 : (completedChildren / totalChildren) * 100;
  
  // Color: Red -> Yellow -> Green
  const progressColor = progress === 100 ? "var(--success)" : "var(--accent)";

  const handleSave = () => {
    if (editedText.trim()) {
      editTask(task.id, editedText);
      setIsEditing(false);
    }
  };

  return (
    <div className="task-tree-node" style={{ marginBottom: "8px" }}>
      
      {/* --- MAIN CARD --- */}
      <div className="task-item" style={{ 
          // Dynamic Border Color
          borderColor: hasChildren ? "var(--accent)" : "rgba(255,255,255,0.1)",
          position: "relative",
          overflow: "hidden"
        }}>
        
        {/* CHECKBOX */}
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={() => toggleComplete(task.id)} 
        />

        {/* --- EDIT OR VIEW MODE --- */}
        {isEditing ? (
          <div style={{ flexGrow: 1, display: 'flex', gap: '10px', marginLeft: '10px' }}>
            <input 
              type="text" 
              value={editedText} 
              onChange={(e) => setEditedText(e.target.value)}
              autoFocus
            />
            <button onClick={handleSave} style={{ background: "var(--success)", color: "white" }}>Save</button>
          </div>
        ) : (
          <>
            <span style={{ 
              flexGrow: 1, 
              marginLeft: "12px", 
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed ? "var(--text-secondary)" : "var(--text-primary)"
            }}>
              {task.text}
            </span>

            {/* FOLDER TOGGLE */}
            {hasChildren && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ background: "transparent", fontSize: "1.2rem", marginRight: "5px" }}
              >
                {isExpanded ? "📂" : "📁"}
              </button>
            )}

            <button onClick={() => setIsEditing(true)} style={{ background: "transparent", fontSize: "1.2rem" }}>✏️</button>
            
            <button 
              onClick={() => handleAiBreakdown(task.id, task.text)}
              className="btn-split"
            >
              ✨ Split
            </button>

            <button onClick={() => deleteTask(task.id)} className="btn-delete">🗑️</button>
          </>
        )}

        {/* --- PROGRESS BAR (INSIDE THE CARD NOW) --- */}
        {hasChildren && (
          <div style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            height: "4px",
            width: `${progress}%`,
            backgroundColor: progressColor,
            transition: "width 0.3s ease-in-out"
          }} />
        )}

      </div>

      {/* --- CHILDREN (RECURSION) --- */}
      {hasChildren && isExpanded && (
        <div style={{ 
          marginLeft: "24px",
          marginTop: "8px",
          paddingLeft: "12px", 
          borderLeft: "2px solid rgba(255,255,255,0.1)"
        }}>
          {childTasks.map(child => (
            <TaskItem key={child.id} task={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskItem;