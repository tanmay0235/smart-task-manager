import { useState, useEffect, use } from 'react';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';

function HomePage() {
  const [tasks, setTasks] = useState(() => {
    // 1. Get the string from storage
    const saved = localStorage.getItem("my-tasks");
    
    // 2. Turn it back into an array (if it exists)
    if (saved) {
      return JSON.parse(saved);
    } 
    
    // 3. Otherwise, use these defaults
    return [
      { id: 1, text: "Learn React Fundamentals", completed: false },
      { id: 2, text: "Build a Portfolio", completed: true },
      { id: 3, text: "Get a Developer Job", completed: false },
    ];
  });
  useEffect(() => {
    localStorage.setItem('my-tasks', JSON.stringify(tasks));
  }, [tasks]);
const addTask=(taskText)=>{
 const newTask={
  id:Date.now(),
  text:taskText,
  completed:false
 };
 setTasks([...tasks,newTask]);
};
const deleteTask=(IdtoDelete)=>{
    const updatedTasks=tasks.filter((task)=>task.id!==IdtoDelete);
    setTasks(updatedTasks);
}

const toggleComplete=(IdtoToggle)=>{
  const updatedTasks=tasks.map((task)=>{
    if(task.id===IdtoToggle){
      return {...task,completed:!task.completed};
    }
    else{
      return task;
    }
  });
  setTasks(updatedTasks);
}
  return (
    <div className='home-page'>
      <h1>My Task</h1>
      <TaskInput onAddTask={addTask}/>
      <TaskList tasks={tasks} onDeleteTask={deleteTask} onToggleComplete={toggleComplete}/>
    </div>
  );
}
export default HomePage;