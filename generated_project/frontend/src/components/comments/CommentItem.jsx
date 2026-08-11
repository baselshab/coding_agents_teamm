import React from 'react';
import { User } from 'lucide-react';

export const CommentItem = ({ comment }) => {
  const formattedDate = comment.createdAt
    ? new Date(comment.createdAt).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Just now';

  return (
    <div className="flex space-x-3 text-sm">
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
          {comment.author?.email ? comment.author.email.charAt(0).toUpperCase() : <User size={16} />}
        </div>
      </div>
      <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-200">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-slate-900">
            {comment.author?.email || 'Team Member'}
          </span>
          <span className="text-xs text-slate-500" title={comment.createdAt}>
            {formattedDate}
          </span>
        </div>
        <p className="text-slate-700 whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
};