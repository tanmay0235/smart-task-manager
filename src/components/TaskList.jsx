import TaskItem from './TaskItem';

// 1. We receive 'onAiBreakdown' (Match the prop name from HomePage)
function TaskList({ tasks, onDeleteTask, onToggleComplete, onAiBreakdown }) {
  
  // 2. Now this log works because the variable exists
  console.log("TaskList received tool?", onAiBreakdown);

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onDeleteTask={onDeleteTask} 
          onToggleComplete={onToggleComplete}
          // 3. Pass it down to the Item
          onAiBreakdown={onAiBreakdown} 
        />
      ))}
    </div>
  );
}

export default TaskList;