import {useState} from 'react';
function TaskInput({onAddTask}) {
  const [inputValue, setInputValue]=useState("");
  const handleSubmit=(e)=>{
    e.preventDefault();
    if(!inputValue.trim()) return;
    onAddTask(inputValue);
    setInputValue("")
  };
  return (
    <form className='task-input' onSubmit={handleSubmit}>
      <input type='text' placeholder='Add a new task...' value={inputValue} 
      onChange={(e)=>setInputValue(e.target.value)}
      />
      <button type='submit'>Add</button>
    </form>
  );
}
export default TaskInput;