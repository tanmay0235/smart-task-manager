function TaskItem({ task, onDeleteTask, onToggleComplete, onAiBreakdown }) {
  return (
    <div className="task-item">
      {/* 1. Checkbox */}
      <input 
        type="checkbox" 
        checked={task.completed} 
        onChange={() => onToggleComplete(task.id)} 
      />
      
      {/* 2. Task Text */}
      <span style={{ flexGrow: 1, marginLeft: "10px" }}>
        {task.text}
      </span>

      {/* 3. The Magic Button ✨ */}
      <button 
        onClick={() => onAiBreakdown(task.id, task.text)}
        style={{ marginRight: "5px", background: "purple", color: "white" }}
      >
        ✨ Split
      </button>

      {/* 4. Delete Button */}
      <button onClick={() => onDeleteTask(task.id)}>Delete</button>
    </div>
  );
}

export default TaskItem;