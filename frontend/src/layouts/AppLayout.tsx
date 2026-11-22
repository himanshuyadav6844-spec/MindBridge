import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isPublicPage = ['/', '/about', '/how-it-works', '/privacy', '/contact', '/login', '/register'].includes(location.pathname);
  const showSidebar = isAuthenticated && !isPublicPage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 flex">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? 'p-4 md:p-8 max-w-7xl mx-auto w-full' : ''}`}>
          <Outlet />
        </main>
      </div>
      {(!isAuthenticated || isPublicPage) && <Footer />}
    </div>
  );
};
