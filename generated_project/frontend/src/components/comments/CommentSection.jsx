import React, { useState, useEffect } from 'react';
import { CommentItem } from './CommentItem';
import { CommentInput } from './CommentInput';
import { apiClient } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';

export const CommentSection = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!taskId) return;

    let isMounted = true;
    setLoading(true);

    apiClient(`/tasks/${taskId}/comments`)
      .then((data) => {
        if (isMounted) {
          setComments(Array.isArray(data) ? data : data.comments || []);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // WebSocket real-time connection
    const socket = io('/', {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socket.emit('join_task', taskId);

    socket.on('new_comment', (newComment) => {
      setComments((prev) => {
        if (prev.some((c) => c.id === newComment.id)) return prev;
        return [...prev, newComment];
      });
    });

    return () => {
      isMounted = false;
      socket.emit('leave_task', taskId);
      socket.disconnect();
    };
  }, [taskId]);

  const handleSendComment = async (content) => {
    const tempId = 'temp-' + Date.now();
    const optimisticComment = {
      id: tempId,
      content,
      createdAt: new Date().toISOString(),
      author: {
        id: user?.id,
        email: user?.email,
      },
    };

    // Optimistic update
    setComments((prev) => [...prev, optimisticComment]);

    try {
      const savedComment = await apiClient(`/tasks/${taskId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });

      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? savedComment : c))
      );
    } catch (err) {
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      setError('Failed to send comment');
    }
  };

  return (
    <div className="mt-6 border-t border-slate-200 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={18} className="text-indigo-600" />
        <h3 className="text-lg font-medium text-slate-900">
          Discussion ({comments.length})
        </h3>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-4 text-center text-sm text-slate-500">
          Loading comments...
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {comments.length === 0 ? (
            <p className="text-sm text-slate-500 italic text-center py-4">
              No comments yet. Start the conversation below!
            </p>
          ) : (
            comments.map((comment) => (
              <CommentItem key={comment.id || Math.random()} comment={comment} />
            ))
          )}
        </div>
      )}

      <CommentInput onSend={handleSendComment} disabled={loading} />
    </div>
  );
};