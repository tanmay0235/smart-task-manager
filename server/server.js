// 1. Grab our tools
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // NEW: Bring in Mongoose!
require('dotenv').config();
const Task = require('./models/Task'); // Bring in the Task blueprint

// 2. Create the App
const app = express();

// 3. Setup Security and JSON reader
app.use(cors()); 
app.use(express.json()); 

// 4. Connect to MongoDB (The Filing Cabinet)
// We tell Mongoose to connect using the secret link in our .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Success! Connected to the MongoDB Database.');
  })
  .catch((error) => {
    console.log('Oops! Database connection failed:', error.message);
  });

// 5. Create a Welcome Mat
app.get('/', (req, res) => {
  res.send('Hello World! Your Smart Task Manager backend is running.');
});
// --- NEW DRIVE-THRU WINDOW FOR TASKS ---
app.post('/api/tasks', async (req, res) => {
  try {
    // 1. Open the package (Now we look for 'text', 'completed', and 'parentId')
    const { text, completed, parentId } = req.body;

    // 2. Build a new Task using our updated blueprint
    const newTask = new Task({
      text: text,
      completed: completed || false,
      parentId: parentId || null
    });

    // 3. Save it to the database
    const savedTask = await newTask.save();

    // 4. Send the completely saved task back to React
    res.status(201).json(savedTask);

  } catch (error) {
    console.log("Error saving task:", error.message);
    res.status(500).json({ message: "Oops! Could not save the task." });
  }
});
// --- NEW WINDOW TO GET ALL TASKS ---
app.get('/api/tasks', async (req, res) => {
  try {
    // 1. Ask the database to find ALL tasks in our filing cabinet
    const allTasks = await Task.find();

    // 2. Send the whole list back to the user
    res.status(200).json(allTasks);

  } catch (error) {
    // 3. Catch any errors if the database is asleep
    console.log(error);
    res.status(500).json({ message: "Oops! Could not get the tasks." });
  }
});
// --- NEW WINDOW TO UPDATE A SPECIFIC TASK ---
app.put('/api/tasks/:id', async (req, res) => {
  try {
    // 1. Grab the specific ID from the URL link
    const taskId = req.params.id; 

    // 2. Grab the new changes the user sent in the package
    const changes = req.body;

    // 3. Tell the database: "Find the task with this ID, and apply these changes"
    // { new: true } tells the database to send us back the UPDATED version, not the old one
    const updatedTask = await Task.findByIdAndUpdate(taskId, changes, { returnDocument: 'after' });

    // 4. Send the freshly updated task back to the user
    res.status(200).json(updatedTask);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Oops! Could not update the task." });
  }
});
// --- NEW WINDOW TO DELETE A SPECIFIC TASK ---
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    // 1. Grab the specific ID from the URL link
    const taskId = req.params.id;

    // 2. Tell the database: "Find the task with this ID and throw it in the trash"
    await Task.findByIdAndDelete(taskId);

    // 3. Send a message confirming it is gone
    res.status(200).json({ message: "Task successfully deleted!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Oops! Could not delete the task." });
  }
});
// 6. Start the Server
// We tell it to look in the .env file for the PORT, or use 5000 as a backup
const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
  console.log(`Server is awake and running on port: ${PORT}`);
});