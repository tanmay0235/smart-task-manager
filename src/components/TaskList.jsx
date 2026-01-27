import TaskItem from './TaskItem';

function TaskList({tasks,onDeleteTask,onToggleComplete}) {
  return (
    <div className="task-list">
      {tasks.map((task)=>(
    <TaskItem key={task.id} task={task} onDeleteTask={onDeleteTask} onToggleComplete={onToggleComplete}/>
    ))}
    </div>
  );
}
export default TaskList;