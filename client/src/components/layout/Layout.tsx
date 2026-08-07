import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

export const Layout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className={`min-h-screen flex flex-col bg-[#f9fafb] relative ${isDashboard ? 'h-screen overflow-hidden' : ''}`}>
      {!isAuthPage && !isDashboard && user && (
        <button 
          onClick={logout}
          className="absolute top-6 right-8 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-200 shadow-sm text-sm font-bold text-slate-600 hover:text-red-600 hover:border-red-200 transition-all hover:shadow-md"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      )}
      <main className="flex-1 flex flex-col h-full">
        <Outlet />
      </main>
      {!isAuthPage && !isDashboard && <Footer />}
    </div>
  );
};
