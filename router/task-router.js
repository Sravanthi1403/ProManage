const express = require('express');
const router = express.Router();
const taskControllers = require('../controllers/task-controller.js');
const authMiddleware = require('../middlewares/auth-middleware.js');

router.post('/', authMiddleware, taskControllers.createTask);
router.get('/:status', authMiddleware, taskControllers.getTasksByStatus);
router.put('/:id', authMiddleware, taskControllers.updateTask);
router.put('/:id', authMiddleware, taskControllers.updateTaskStatus);
router.delete('/:id', authMiddleware, taskControllers.deleteTask);


module.exports = router;