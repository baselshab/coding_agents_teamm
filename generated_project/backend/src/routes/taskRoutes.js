const express = require('express');
const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateTaskCreate, validateTaskUpdate } = require('../validators/taskValidator');

const router = express.Router();

router.post('/projects/:projectId/tasks', authMiddleware, validateTaskCreate, createTask);
router.get('/projects/:projectId/tasks', authMiddleware, getProjectTasks);
router.get('/tasks/:id', authMiddleware, getTaskById);
router.put('/tasks/:id', authMiddleware, validateTaskUpdate, updateTask);
router.delete('/tasks/:id', authMiddleware, deleteTask);

module.exports = router;