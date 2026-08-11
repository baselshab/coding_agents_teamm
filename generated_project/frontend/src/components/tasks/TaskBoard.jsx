import React, { useState, useEffect } from 'react';
import TaskColumn from './TaskColumn';
import TaskCreateModal from './TaskCreateModal';
import TaskDetailsModal from './TaskDetailsModal';
import { apiRequest } from '../../api/apiClient';

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchData = async () => {
    try {
      const [taskRes, projRes] = await Promise.all([
        apiRequest(`/projects/${projectId}/tasks`),
        apiRequest(`/v1/projects/${projectId}`).catch(() => ({ members: [] }))
      ]);
      setTasks(taskRes.tasks || taskRes || []);
      setMembers(projRes.members || projRes.projectMembers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await apiRequest(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error(err);
      fetchData(); // revert on error
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading task board...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Project Task Board</h2>
          <p className="text-xs text-gray-500">Manage and track deliverables across stages</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          + New Task
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto flex-1 pb-4">
        <TaskColumn 
          title="To-Do"
          status="TODO"
          tasks={tasks}
          onSelectTask={setSelectedTask}
          onStatusChange={handleStatusChange}
        />
        <TaskColumn 
          title="In Progress"
          status="IN_PROGRESS"
          tasks={tasks}
          onSelectTask={setSelectedTask}
          onStatusChange={handleStatusChange}
        />
        <TaskColumn 
          title="Done"
          status="DONE"
          tasks={tasks}
          onSelectTask={setSelectedTask}
          onStatusChange={handleStatusChange}
        />
      </div>

      {isCreateOpen && (
        <TaskCreateModal 
          projectId={projectId}
          members={members}
          onClose={() => setIsCreateOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal 
          task={selectedTask}
          members={members}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
    </div>
  );
}