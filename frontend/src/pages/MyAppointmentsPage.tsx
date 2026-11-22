import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentApi, consultationApi } from '../services/api';
import { Appointment, ConsultationRecord } from '../types';
import { Calendar, Clock, Video, Phone, MapPin, XCircle, FileText, Star, AlertCircle, CheckCircle2 } from 'lucide-react';

export const MyAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');

  // Review modal state
  const [reviewModalAppointment, setReviewModalAppointment] = useState<Appointment | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  // View consultation modal state
  const [viewRecord, setViewRecord] = useState<ConsultationRecord | null>(null);
  const [recordLoading, setRecordLoading] = useState<boolean>(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentApi.getMyAppointments();
      if (res.data?.success && res.data?.data) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelModalId) return;
    setActionLoading(true);
    try {
      await appointmentApi.cancelAppointment(cancelModalId, cancelReason || 'Patient requested cancellation');
      setCancelModalId(null);
      setCancelReason('');
      await loadAppointments();
    } catch (err) {
      console.error('Failed to cancel appointment', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewConsultation = async (appointmentId: string) => {
    setRecordLoading(true);
    try {
      const res = await consultationApi.getRecordByAppointment(appointmentId);
      if (res.data?.success && res.data?.data) {
        setViewRecord(res.data.data);
      } else {
        alert('Consultation record is not available yet.');
      }
    } catch (err) {
      alert('Consultation record is not available yet.');
    } finally {
      setRecordLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewModalAppointment) return;
    setActionLoading(true);
    try {
      await consultationApi.submitFeedback({
        appointmentId: reviewModalAppointment.id,
        doctorId: reviewModalAppointment.doctorId,
        rating,
        comment: reviewComment
      });
      setReviewSuccess(true);
      setTimeout(() => {
        setReviewModalAppointment(null);
        setReviewSuccess(false);
        setReviewComment('');
      }, 1500);
    } catch (err) {
      console.error('Failed to submit feedback', err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(app => {
    if (activeTab === 'UPCOMING') return app.status === 'SCHEDULED' || app.status === 'CONFIRMED' || app.status === 'IN_PROGRESS';
    if (activeTab === 'COMPLETED') return app.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return app.status === 'CANCELLED' || app.status === 'NO_SHOW';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage scheduled tele-consultations and clinical appointments.</p>
        </div>
        <Link
          to="/appointments/book"
          className="px-4 py-2.5 bg-teal-600 text-white font-semibold text-sm rounded-lg hover:bg-teal-700 shadow-sm transition-colors text-center"
        >
          Book New Consultation
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {[
          { key: 'UPCOMING', label: 'Upcoming / Active' },
          { key: 'COMPLETED', label: 'Completed' },
          { key: 'CANCELLED', label: 'Cancelled' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 p-8">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">No {activeTab.toLowerCase()} appointments</h3>
          <p className="text-sm text-slate-500 mt-1">You have no scheduled appointments in this category.</p>
          {activeTab === 'UPCOMING' && (
            <Link
              to="/doctors"
              className="mt-4 inline-block px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700"
            >
              Browse Specialists
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg border border-teal-100 flex-shrink-0">
                  {app.doctorName?.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2) || 'MD'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{app.doctorName || 'Assigned Specialist'}</h3>
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
                  <p className="text-xs text-teal-700 font-medium">{app.doctorSpecialization || 'Clinical Specialist'}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {app.appointmentDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {app.appointmentTime.slice(0, 5)}
                    </span>
                    <span className="flex items-center gap-1">
                      {app.consultationType === 'VIDEO' ? <Video className="w-3.5 h-3.5 text-teal-600" /> : <Phone className="w-3.5 h-3.5 text-indigo-600" />}
                      {app.consultationType}
                    </span>
                    <span className="font-semibold text-slate-800">
                      Fee: ₹{app.fee?.toLocaleString('en-IN') || '1,200'}
                    </span>
                  </div>

                  {app.reasonForVisit && (
                    <p className="text-xs text-slate-600 mt-2 italic bg-slate-50 px-2.5 py-1 rounded inline-block">
                      Note: "{app.reasonForVisit}"
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                {(app.status === 'SCHEDULED' || app.status === 'CONFIRMED') && (
                  <button
                    onClick={() => setCancelModalId(app.id)}
                    className="px-3.5 py-2 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    Cancel Session
                  </button>
                )}

                {app.status === 'COMPLETED' && (
                  <>
                    <button
                      onClick={() => handleViewConsultation(app.id)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> Clinical Notes
                    </button>
                    <button
                      onClick={() => setReviewModalAppointment(app)}
                      className="px-3.5 py-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Review
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Cancel Appointment</h3>
            <p className="text-sm text-slate-500">
              Are you sure you want to cancel this appointment? Please state a reason for the practitioner:
            </p>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g., Schedule conflict, feeling better..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalId(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Practitioner Feedback</h3>
            {reviewSuccess ? (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-center font-medium text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                Thank you for your valuable feedback!
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-500">
                  Rate your consultation experience with {reviewModalAppointment.doctorName}:
                </p>
                <div className="flex justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details of your consultation (optional)..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalAppointment(null)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleSubmitReview}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* View Clinical Record Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Clinical Consultation Record</h3>
              <button onClick={() => setViewRecord(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-700">Diagnosis / Clinical Impression:</span>
                <p className="mt-1 text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {viewRecord.diagnosis || 'General psychological assessment.'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Clinical Notes:</span>
                <p className="mt-1 text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 whitespace-pre-line">
                  {viewRecord.clinicalNotes || 'Session completed successfully.'}
                </p>
              </div>
              {viewRecord.recommendations && (
                <div>
                  <span className="font-semibold text-slate-700">Recommendations & Exercises:</span>
                  <p className="mt-1 text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {viewRecord.recommendations}
                  </p>
                </div>
              )}
              {viewRecord.followUpDate && (
                <div className="bg-teal-50 border border-teal-200 p-3 rounded-lg text-teal-800">
                  <span className="font-bold">Recommended Follow-up: </span> {viewRecord.followUpDate}
                </div>
              )}
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setViewRecord(null)}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
