import React from 'react';
import { useParams, Link } from 'react-router-dom';
import TaskBoard from '../components/tasks/TaskBoard';

export default function ProjectTaskBoardPage() {
  const { projectId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm text-indigo-600 font-medium hover:underline">
            &larr; Back to Projects
          </Link>
          <h1 className="font-bold text-gray-900">CollabTask SaaS</h1>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        <TaskBoard projectId={projectId} />
      </main>
    </div>
  );
}