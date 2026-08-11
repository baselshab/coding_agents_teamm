import React from 'react';
import TaskCard from './TaskCard';

export default function TaskColumn({ title, status, tasks, onSelectTask, onStatusChange }) {
  const filteredTasks = tasks.filter(t => t.status === status);

  return (
    <div className="bg-gray-100 rounded-xl p-4 flex flex-col flex-1 min-w-[280px] max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${
            status === 'TODO' ? 'bg-gray-400' : status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-green-500'
          }`}></span>
          {title}
          <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
            {filteredTasks.length}
          </span>
        </h3>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto flex-1 min-h-[400px]">
        {filteredTasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-xs">
            No tasks
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onSelect={onSelectTask} 
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}