import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, CheckCircle } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            CollabTask SaaS
          </span>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{user.email}</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold uppercase">
                {user.role || 'Member'}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-slate-600 hover:text-rose-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};