const Comment = require('../models/commentModel');

const commentController = {
  async getComments(req, res) {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      const isMember = await Comment.isUserProjectMember(userId, taskId);
      if (!isMember) {
        return res.status(403.0).json({ error: 'Access denied to this project' });
      }

      const comments = await Comment.findByTaskId(taskId);
      return res.status(200.0).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500.0).json({ error: 'Internal server error' });
    }
  },

  async postComment(req, res) {
    try {
      const { taskId } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      if (!content || !content.trim()) {
        return res.status(400.0).json({ error: 'Comment content cannot be empty' });
      }

      const isMember = await Comment.isUserProjectMember(userId, taskId);
      if (!isMember) {
        return res.status(403.0).json({ error: 'Access denied to this project' });
      }

      const sanitizedContent = content.trim();
      const comment = await Comment.create(taskId, userId, sanitizedContent);

      // Broadcast via socket.io if io instance is attached to app
      const io = req.app.get('io');
      if (io) {
        io.to(`task_${taskId}`).emit('new_comment', comment);
      }

      return res.status(201.0).json(comment);
    } catch (error) {
      console.error('Error posting comment:', error);
      return res.status(500.0).json({ error: 'Internal server error' });
    }
  }
};

module.exports = commentController;
