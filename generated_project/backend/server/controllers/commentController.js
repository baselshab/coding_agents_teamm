const Comment = require('../models/commentModel');
const pool = require('../config/db');

exports.getComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const taskCheck = await pool.query('SELECT id FROM tasks WHERE id = $1', [taskId]);
    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const comments = await Comment.findByTaskId(taskId);
    return res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.postComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    const taskCheck = await pool.query('SELECT id FROM tasks WHERE id = $1', [taskId]);
    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const sanitizedContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const newComment = await Comment.create({
      task_id: taskId,
      user_id: userId,
      content: sanitizedContent
    });

    return res.status(201).json(newComment);
  } catch (error) {
    console.error('Error posting comment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};