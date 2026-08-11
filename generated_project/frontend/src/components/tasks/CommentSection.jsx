import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/apiClient';

export default function CommentSection({ taskId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await apiRequest(`/tasks/${taskId}/comments`);
      setComments(res.comments || res || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchComments();
    }
  }, [taskId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await apiRequest(`/tasks/${taskId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: newComment }),
      });
      setComments(prev => [...prev, res.comment || res]);
      setNewComment('');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col gap-4">
      <h4 className="font-medium text-sm text-gray-800">Comments ({comments.length})</h4>

      <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
        {comments.map((c, idx) => (
          <div key={c.id || idx} className="bg-gray-50 p-3 rounded-lg text-xs flex flex-col gap-1">
            <div className="flex justify-between font-medium text-gray-700">
              <span>{c.author?.email || c.user?.email || 'User'}</span>
              <span className="text-gray-400 font-normal">
                {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'Just now'}
              </span>
            </div>
            <p className="text-gray-600">{c.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddComment} className="flex gap-2">
        <input 
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 text-xs font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          Post
        </button>
      </form>
    </div>
  );
}