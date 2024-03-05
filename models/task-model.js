const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['high priority', 'moderate priority', 'low priority'],
    required: true
  },
  checklist: {
    type: [{
        text: {
            type: String,
            required: true
        },
        check: {
            type: String,
            default:'false'
        }
    }],
    required: true
  },
  dueDate: {
    type: Date
  },
  status:{
    type: String,
    enum: ['backlog', 'todo', 'progress','done'],
    required:true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  }
  
},{timestamps:true});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;