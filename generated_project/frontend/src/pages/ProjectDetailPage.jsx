import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ProjectInviteModal } from '../components/ProjectInviteModal';
import { apiClient } from '../api/apiClient';
import { ArrowLeft, UserPlus, Loader2, Calendar, CheckSquare } from 'lucide-react';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const fetchProjectDetail = async () => {
    try {
      setLoading(true);
      const data = await apiClient(`/api/v1/projects/${id}`);
      setProject(data.project || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  const handleInviteMember = async (email) => {
    await apiClient(`/api/v1/projects/${id}/invitations`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {project && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                      Project Overview
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
                  <p className="text-sm text-slate-500 mt-1">{project.description}</p>
                </div>
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Invite Member</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Tasks & Collaboration Board</h3>
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <CheckSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Task boards and comments feature ready for team collaboration.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <ProjectInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteMember}
      />
    </div>
  );
};