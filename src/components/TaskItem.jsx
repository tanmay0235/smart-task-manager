/* src/components/TaskItem.jsx */
import { useState } from 'react';
import { useTasks } from '../Context/TasksContext';

function TaskItem({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [isExpanded, setIsExpanded] = useState(true); // New: Folders can be open/closed
  
  // 1. Get ALL tasks from context to find our children
  const { tasks, deleteTask, toggleComplete, editTask, handleAiBreakdown } = useTasks();

  // 2. Find MY children (Tasks that point to ME as their parent)
  const childTasks = tasks.filter(t => t.parentId === task.id);
  const hasChildren = childTasks.length > 0;

  const handleSave = () => {
    if (editedText.trim()) {
      editTask(task.id, editedText);
      setIsEditing(false);
    }
  };

  return (
    // Wrap everything in a container to hold the item + its children
    <div className="task-tree-node" style={{ marginBottom: "8px" }}>
      
      {/* --- THE MAIN TASK ROW --- */}
      <div className="task-item" style={{ 
          // Visual tweak: Different border if it's a "folder"
          borderColor: hasChildren ? "var(--accent)" : "rgba(255,255,255,0.1)" 
        }}>
        
        {/* CHECKBOX */}
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={() => toggleComplete(task.id)} 
        />

        {/* EDITING MODE */}
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
          /* VIEWING MODE */
          <>
            <span style={{ 
              flexGrow: 1, 
              marginLeft: "12px", 
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed ? "var(--text-secondary)" : "var(--text-primary)"
            }}>
              {task.text}
            </span>

            {/* EXPAND/COLLAPSE BUTTON (Only if it has children) */}
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
      </div>

      {/* --- THE CHILDREN (RECURSION) --- */}
      {/* If expanded and has children, render them indented */}
      {hasChildren && isExpanded && (
        <div style={{ 
          marginLeft: "24px",  // Indentation
          marginTop: "8px",
          paddingLeft: "12px", 
          borderLeft: "2px solid rgba(255,255,255,0.1)" // The "Folder Line" visual
        }}>
          {childTasks.map(child => (
            // 🔄 RECURSION: The Component calls itself!
            <TaskItem key={child.id} task={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskItem;