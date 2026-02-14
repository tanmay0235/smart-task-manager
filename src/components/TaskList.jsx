/* src/components/TaskList.jsx */
import TaskItem from './TaskItem';

function TaskList({ tasks }) {
  
  // 1. Filter: Only get tasks that have NO parent (The Root Folders)
  const rootTasks = tasks.filter(task => !task.parentId);

  if (tasks.length === 0) {
    return <div style={{ textAlign: "center", color: "#888" }}>No tasks yet! 👆</div>;
  }

  return (
    <div className="task-list">
      {/* 2. Map only the Root Tasks */}
      {rootTasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
        />
      ))}
    </div>
  );
}

export default TaskList;