import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentApi } from '../services/api';
import { Appointment } from '../types';
import { Calendar, Clock, Video, Phone, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

export const DoctorAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentApi.getMyDoctorAppointments();
      if (res.data?.success && res.data?.data) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setActionId(id);
    try {
      await appointmentApi.updateAppointmentStatus(id, status);
      await loadAppointments();
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setActionId(null);
    }
  };

  const filteredAppointments = appointments.filter(app => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">Review scheduled sessions, confirm requests, or launch clinical consultations.</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 p-8">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">No appointments found</h3>
          <p className="text-sm text-slate-500 mt-1">No patient bookings currently match this filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map((app) => (
              <div key={app.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{app.patientName || 'Verified Patient'}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      app.status === 'CONFIRMED' || app.status === 'SCHEDULED'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : app.status === 'COMPLETED'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
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
                    <span className="font-semibold text-slate-800">
                      Fee: ₹{app.fee?.toLocaleString('en-IN') || '1,200'}
                    </span>
                  </div>
                  {app.reasonForVisit && (
                    <p className="text-xs text-slate-600 italic bg-slate-50 px-2 py-1 rounded inline-block mt-1">
                      "{app.reasonForVisit}"
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-end">
                  {app.status === 'SCHEDULED' && (
                    <button
                      disabled={actionId === app.id}
                      onClick={() => handleStatusUpdate(app.id, 'CONFIRMED')}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                      Confirm
                    </button>
                  )}

                  {(app.status === 'SCHEDULED' || app.status === 'CONFIRMED') && (
                    <>
                      <Link
                        to={`/doctor/consultations/${app.id}`}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                      >
                        Start Session
                      </Link>
                      <button
                        disabled={actionId === app.id}
                        onClick={() => handleStatusUpdate(app.id, 'CANCELLED')}
                        className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {app.status === 'COMPLETED' && (
                    <Link
                      to={`/doctor/consultations/${app.id}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      View Record
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
