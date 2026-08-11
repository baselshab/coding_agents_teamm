const TaskModel = require('../models/taskModel');
const pool = require('../config/db');

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, dueDate, assigneeId } = req.body;
    const userId = req.user.id;

    const projectCheck = await pool.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (assigneeId) {
      const memberCheck = await pool.query(
        'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
        [projectId, assigneeId]
      );
      if (memberCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Assignee must be a member of the project' });
      }
    }

    const task = await TaskModel.create({
      title,
      description,
      status,
      dueDate,
      projectId,
      assigneeId,
      creatorId: userId
    });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const projectCheck = await pool.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = await TaskModel.findByProjectId(projectId);
    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get Project Tasks Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ task });
  } catch (error) {
    console.error('Get Task Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, assigneeId } = req.body;

    const existingTask = await TaskModel.findById(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (status && !['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value. Must be TODO, IN_PROGRESS, or DONE.' });
    }

    if (assigneeId) {
      const memberCheck = await pool.query(
        'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
        [existingTask.project_id, assigneeId]
      );
      if (memberCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Assignee must be a member of the project' });
      }
    }

    const updatedTask = await TaskModel.update(id, {
      title,
      description,
      status,
      dueDate,
      assigneeId
    });

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const existingTask = await TaskModel.findById(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await TaskModel.delete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask
};