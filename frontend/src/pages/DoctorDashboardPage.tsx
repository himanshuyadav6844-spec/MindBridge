import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorApi, appointmentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Appointment, DoctorProfile } from '../types';
import { Calendar, Users, Star, Clock, CheckCircle2, AlertCircle, ArrowUpRight, Video, Phone } from 'lucide-react';

export const DoctorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDoctorData();
  }, []);

  const loadDoctorData = async () => {
    setLoading(true);
    try {
      const [appRes] = await Promise.all([
        appointmentApi.getMyDoctorAppointments().catch(() => ({ data: { data: [] } }))
      ]);

      if (appRes.data?.data) {
        setAppointments(appRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load doctor dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(
    a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED'
  );
  const completedAppointments = appointments.filter(a => a.status === 'COMPLETED');

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-teal-200 text-xs font-semibold uppercase tracking-wider">Clinician Portal</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-sm text-teal-100 mt-1 max-w-xl">
            Review patient appointments, conduct tele-consultations, and record clinical impression notes.
          </p>
        </div>
        <Link
          to="/doctor/appointments"
          className="px-4 py-2.5 bg-white text-teal-900 font-bold text-xs rounded-lg hover:bg-teal-50 shadow transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          View All Consultations <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Pending / Scheduled</span>
            <div className="text-2xl font-bold text-slate-900">{upcomingAppointments.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Completed Sessions</span>
            <div className="text-2xl font-bold text-slate-900">{completedAppointments.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Consultations</span>
            <div className="text-2xl font-bold text-slate-900">{appointments.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Quality Rating</span>
            <div className="text-2xl font-bold text-slate-900">4.9 / 5.0</div>
          </div>
        </div>
      </div>

      {/* Upcoming Consultations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Upcoming Patient Sessions</h2>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
            {upcomingAppointments.length} Active
          </span>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No upcoming appointments scheduled today.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {upcomingAppointments.slice(0, 5).map((app) => (
              <div key={app.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{app.patientName || 'Verified Patient'}</span>
                    <span className="text-[11px] font-semibold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                      {app.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {app.appointmentDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {app.appointmentTime.slice(0, 5)}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      {app.consultationType === 'VIDEO' ? <Video className="w-3.5 h-3.5 text-teal-600" /> : <Phone className="w-3.5 h-3.5 text-indigo-600" />}
                      {app.consultationType}
                    </span>
                  </div>
                  {app.reasonForVisit && (
                    <p className="text-xs text-slate-600 italic">"{app.reasonForVisit}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/doctor/consultations/${app.id}`}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                  >
                    Open Workspace
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
