import React from 'react';

export default function TaskCard({ task, onSelect, onStatusChange }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <div 
      onClick={() => onSelect(task)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer flex flex-col gap-2"
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2">{task.title}</h4>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase
          ${task.status === 'TODO' ? 'bg-gray-100 text-gray-700' : ''}
          ${task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700' : ''}
          ${task.status === 'DONE' ? 'bg-green-50 text-green-700' : ''}
        `}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
            {task.assignee?.email ? task.assignee.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="text-gray-600 truncate max-w-[100px]">{task.assignee?.email || 'Unassigned'}</span>
        </div>

        {task.dueDate && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
            isOverdue ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-600'
          }`}>
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="flex gap-1 mt-1 justify-end" onClick={(e) => e.stopPropagation()}>
        {task.status !== 'TODO' && (
          <button 
            onClick={() => onStatusChange(task.id, 'TODO')}
            className="text-[10px] text-gray-500 hover:text-gray-800 bg-gray-50 px-1.5 py-0.5 rounded"
          >
            &larr; To-Do
          </button>
        )}
        {task.status !== 'IN_PROGRESS' && (
          <button 
            onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
            className="text-[10px] text-blue-600 hover:text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded"
          >
            In Progress
          </button>
        )}
        {task.status !== 'DONE' && (
          <button 
            onClick={() => onStatusChange(task.id, 'DONE')}
            className="text-[10px] text-green-600 hover:text-green-800 bg-green-50 px-1.5 py-0.5 rounded"
          >
            Done &rarr;
          </button>
        )}
      </div>
    </div>
  );
}