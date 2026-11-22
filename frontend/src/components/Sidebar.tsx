import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  Smile,
  BookOpenCheck,
  MessageSquareCode,
  Stethoscope,
  CalendarDays,
  Bell,
  Settings,
  ShieldCheck,
  Users,
  FileText
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role;

  const patientNav = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/assessment', label: 'Assessment', icon: ClipboardList },
    { to: '/mood-tracker', label: 'Mood Tracker', icon: Smile },
    { to: '/cbt-exercises', label: 'CBT Exercises', icon: BookOpenCheck },
    { to: '/chatbot', label: 'AI Companion', icon: MessageSquareCode },
    { to: '/doctors', label: 'Find a Specialist', icon: Stethoscope },
    { to: '/appointments', label: 'My Appointments', icon: CalendarDays },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/profile', label: 'Profile Settings', icon: Settings },
  ];

  const doctorNav = [
    { to: '/doctor/dashboard', label: 'Practice Overview', icon: LayoutDashboard },
    { to: '/doctor/appointments', label: 'Appointments Schedule', icon: CalendarDays },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ];

  const adminNav = [
    { to: '/admin/dashboard', label: 'Platform Stats', icon: LayoutDashboard },
    { to: '/admin/doctors/verify', label: 'Doctor Approvals', icon: ShieldCheck },
    { to: '/admin/patients', label: 'Patient Directory', icon: Users },
    { to: '/admin/appointments', label: 'Global Appointments', icon: FileText },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ];

  const currentNav = role === 'ROLE_DOCTOR' ? doctorNav : role === 'ROLE_ADMIN' ? adminNav : patientNav;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-4 sticky top-16 h-[calc(100vh-4rem)]">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {role === 'ROLE_DOCTOR' ? 'Practitioner Portal' : role === 'ROLE_ADMIN' ? 'Administration' : 'Wellness Center'}
        </div>
        {currentNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Supportive crisis assistance quick contact */}
      <div className="bg-gradient-to-br from-teal-50 to-sky-50 p-3.5 rounded-2xl border border-teal-100 text-xs text-slate-600 space-y-1.5">
        <div className="font-semibold text-teal-900 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
          24/7 Crisis Support
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          In acute distress? Reach Tele-MANAS directly at <span className="font-bold text-teal-700">14416</span> (Free & Confidential).
        </p>
      </div>
    </aside>
  );
};
