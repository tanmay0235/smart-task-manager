// 1. Grab our Mongoose tool
const mongoose = require('mongoose');

// 2. Create the Blueprint (Schema)
// This tells the database exactly what a "Task" should look like
const taskSchema = new mongoose.Schema({
  text: {           // Changed from 'title' to 'text' to match your frontend
    type: String,     
    required: true    
  },
  completed: {
    type: Boolean,    
    default: false    
  },
  parentId: {       // NEW: Added so the database can save your AI Tree structure!
    type: String,
    default: null
  }
});

// 3. Turn the Blueprint into a usable Model
const Task = mongoose.model('Task', taskSchema);

// 4. Export it so our server.js can use it
module.exports = Task;