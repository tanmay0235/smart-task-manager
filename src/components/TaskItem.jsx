function TaskItem({ task,onDeleteTask,onToggleComplete }) {
  return (
    <div className="task-item">
      {/* 2. Use the data to control the checkbox */}
      <input type="checkbox" checked={task.completed} onClick={()=>onToggleComplete(task.id)} />
      
      {/* 3. Display the text */}
      <span>{task.text}</span>
      
      <button onClick={()=>onDeleteTask(task.id)}>Delete</button>
    </div>
  );
}

export default TaskItem;