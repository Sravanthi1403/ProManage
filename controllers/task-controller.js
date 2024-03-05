const Task = require('../models/task-model');

// *------------------------
// CREATE TASK 
// *-------------------------

const createTask = async (req, res) => {
  try {
    console.log('from createTask',req.token)
      console.log('create task ',req.body)
      const newTaskData = req.body;
      
      // validation

      if (!newTaskData.title || !newTaskData.priority || !newTaskData.checklist || newTaskData.checklist.length === 0) {
          return res.status(400).json({ error: 'Title, priority, and at least one checklist item are required fields' });
      }

      if (newTaskData.checklist.some(item => !item.text)) {
          return res.status(400).json({ error: 'Checklist items must have text' });
      }

      // Creating a new Task 
      const newTask = new Task({
        ...newTaskData,
        userId : req.userID
      });
      console.log(newTask);
      // Saving the Task
      const savedTask = await newTask.save();

      res.status(201).json(savedTask);
  } catch (error) {
      console.error('Error saving task:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};


// *------------------------
// GET TASK USING STATUS
// *-------------------------


// Route to fetch tasks based on status and creation date range
const getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { dateRange } = req.query;
    console.log('query', req.query)
    const userID = req.userID;

    let startDate, endDate;
    if (dateRange === 'today') {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0); // Set to beginning of today
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999); // Set to end of today
    } else if (dateRange === 'thisWeek') {
      // Calculate start and end of the current week
      const currentDate = new Date();
      startDate = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())); // Start of the week
      endDate = new Date(currentDate.setDate(startDate.getDate() + 6)); // End of the week
    } else if (dateRange === 'thisMonth') {
      // Calculate start and end of the current month
      const currentDate = new Date();
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of the month
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // End of the month
    } else {
      // If no valid date range provided, return an error
      return res.status(400).json({ message: 'Invalid date range parameter' });
    }

    const tasks = await Task.find({
      userId: userID,
      status: status,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    res.status(200).json({ tasks, message: 'Tasks fetched successfully' });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// *------------------------
// UPDATE TASK STATUS 
// *-------------------------

const updateTaskStatus = async (req, res) => {
  const { id: taskId } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.userID },
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ task, message: "Task status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
// *------------------------
// UPDATE TASK 
// *-------------------------

const updateTask = async (req, res) => {
  console.log('from update task',req.body)
  const { id: taskId } = req.params;
  console.log('from update task',taskId)
  console.log('from update task', req.params)
  const { title,priority,checklist,dueDate,status } = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.userID },
      { title, priority,checklist,dueDate,status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found to Update" });
    }

    res.json({ task, message: "Task  updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error",error });
  }
};

// *------------------------
// DELETE TASK 
// *-------------------------

const deleteTask = async (req, res) =>{
  const taskId = req.params.id;
  try {
      const task = await Task.findOneAndDelete({
          _id: taskId,
          userId : req.userID
      });
      if(!task){
          return res.status(404).json({message: "Task not found"});
      }
      res.status(200).json({task, message:"Task Deleted Successfully"});

  } catch (err) {
      res.status(500).send({error : err})
  }
}



module.exports = {createTask,getTasksByStatus,updateTask, updateTaskStatus, deleteTask};