const jwt = require('jsonwebtoken');
const Comment = require('../models/commentModel');

function setupCommentGateway(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected to socket: ${socket.user.id}`);

    socket.on('join_task', async ({ taskId }) => {
      try {
        const isMember = await Comment.isUserProjectMember(socket.user.id, taskId);
        if (!isMember) {
          socket.emit('error', { message: 'Unauthorized to join task room' });
          return;
        }
        socket.join(`task_${taskId}`);
        console.log(`User ${socket.user.id} joined task room: task_${taskId}`);
      } catch (err) {
        console.error('Error joining task room:', err);
      }
    });

    socket.on('leave_task', ({ taskId }) => {
      socket.leave(`task_${taskId}`);
      console.log(`User ${socket.user.id} left task room: task_${taskId}`);
    });

    socket.on('send_comment', async ({ taskId, content }) => {
      try {
        if (!content || !content.trim()) return;
        
        const isMember = await Comment.isUserProjectMember(socket.user.id, taskId);
        if (!isMember) {
          socket.emit('error', { message: 'Unauthorized to comment on this task' });
          return;
        }

        const sanitizedContent = content.trim();
        const comment = await Comment.create(taskId, socket.user.id, sanitizedContent);

        io.to(`task_${taskId}`).emit('new_comment', comment);
      } catch (err) {
        console.error('Error in send_comment socket event:', err);
        socket.emit('error', { message: 'Failed to post comment' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });
}

module.exports = setupCommentGateway;
