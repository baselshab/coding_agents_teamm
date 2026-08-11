import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CommentSection } from './components/comments/CommentSection';

const DemoTaskView = () => {
  const { user, logout } = useAuth();
  // For demonstration of TASK-008 UI component integration
  const sampleTaskId = 'task-demo-123';

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <header className="max-w-3xl mx-auto bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">CollabTask SaaS</h1>
          <p className="text-sm text-slate-500">Signed in as {user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="px-3 py-1.5 text-sm bg-slate-200 hover:bg-slate-300 rounded font-medium text-slate-700 transition"
        >
          Logout
        </button>
      </header>

      <main className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Task Details: Implement Real-time Dashboard
        </h2>
        <p className="text-slate-600 mb-6">
          Build the primary metrics overview and project summary cards for team managers.
        </p>

        {/* Task Comment Section UI integration */}
        <CommentSection taskId={sampleTaskId} />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DemoTaskView />
    </AuthProvider>
  );
}