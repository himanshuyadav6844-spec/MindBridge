import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartHandshake, 
  User, 
  LogOut, 
  Calendar, 
  Smile, 
  BookOpen, 
  MessageSquareHeart, 
  Stethoscope, 
  Bell, 
  ShieldCheck, 
  Menu, 
  X,
  PhoneCall
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isPublicPage = ['/', '/about', '/how-it-works', '/privacy', '/contact', '/login', '/register'].includes(location.pathname);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Brand */}
          <Link to={isAuthenticated ? (user?.role === 'ROLE_DOCTOR' ? '/doctor/dashboard' : user?.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/dashboard') : '/'} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">Mind<span className="text-teal-600">Bridge</span></span>
              <span className="block text-[10px] uppercase font-semibold text-teal-600 tracking-wider">AI Wellness Companion</span>
            </div>
          </Link>

          {/* Navigation Links for Public View */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link to="/about" className="hover:text-teal-600 transition-colors">About Us</Link>
              <Link to="/how-it-works" className="hover:text-teal-600 transition-colors">How It Works</Link>
              <Link to="/doctors" className="hover:text-teal-600 transition-colors">Specialist Directory</Link>
              <Link to="/contact" className="hover:text-teal-600 transition-colors">Contact</Link>
            </div>
          )}

          {/* User actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/notifications" className="p-2 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-lg relative transition-colors" title="Notifications">
                  <Bell className="w-5 h-5" />
                </Link>

                <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.fullName.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{user?.fullName.split(' ')[0]}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 uppercase">
                    {user?.role.replace('ROLE_', '')}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-teal-600 px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-xl shadow-sm shadow-teal-600/30 transition-all hover:shadow"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {!isAuthenticated ? (
            <>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600 font-medium">About Us</Link>
              <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600 font-medium">How It Works</Link>
              <Link to="/doctors" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600 font-medium">Specialist Directory</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600 font-medium">Contact Us</Link>
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-1/2 text-center py-2 text-sm font-semibold border border-slate-300 rounded-lg">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-1/2 text-center py-2 text-sm font-semibold bg-teal-600 text-white rounded-lg">Register</Link>
              </div>
            </>
          ) : (
            <>
              <div className="py-2 text-sm font-semibold text-slate-800">
                Signed in as <span className="text-teal-600">{user?.fullName}</span> ({user?.role.replace('ROLE_', '')})
              </div>
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left py-2 text-sm font-medium text-rose-600 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
