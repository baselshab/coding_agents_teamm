import React from 'react';
import { Folder, Users, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-lg">
            <Folder className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
            Active
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{project.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">{project.description || 'No description provided.'}</p>
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-slate-500">
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </span>
        </div>
        <button
          onClick={() => navigate(`/projects/${project.id}`)}
          className="inline-flex items-center space-x-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          <span>View Board</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};