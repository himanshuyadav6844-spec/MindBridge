import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { consultationApi, appointmentApi } from '../services/api';
import { Appointment, ConsultationRecord } from '../types';
import { Video, Phone, CheckCircle2, Clock, Calendar, User, FileText, ArrowLeft, AlertCircle } from 'lucide-react';

export const ConsultationWorkspacePage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [existingRecord, setExistingRecord] = useState<ConsultationRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [prescriptions, setPrescriptions] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string>('');
  const [followUpDate, setFollowUpDate] = useState<string>('');

  useEffect(() => {
    if (appointmentId) {
      loadWorkspace(appointmentId);
    }
  }, [appointmentId]);

  const loadWorkspace = async (appId: string) => {
    setLoading(true);
    try {
      const [appRes, recRes] = await Promise.all([
        appointmentApi.getMyDoctorAppointments().catch(() => ({ data: { data: [] } })),
        consultationApi.getRecordByAppointment(appId).catch(() => ({ data: { data: null } }))
      ]);

      if (appRes.data?.data) {
        const found = appRes.data.data.find((a: Appointment) => a.id === appId);
        if (found) setAppointment(found);
      }

      if (recRes.data?.data) {
        const rec = recRes.data.data;
        setExistingRecord(rec);
        setClinicalNotes(rec.clinicalNotes || '');
        setDiagnosis(rec.diagnosis || '');
        setPrescriptions(rec.prescriptions || '');
        setRecommendations(rec.recommendations || '');
        setFollowUpDate(rec.followUpDate || '');
      }
    } catch (err) {
      console.error('Failed to load consultation workspace', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentId) return;

    if (!clinicalNotes.trim()) {
      setErrorMsg('Please document clinical impression notes before completing the consultation.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await consultationApi.createOrUpdateRecord({
        appointmentId,
        clinicalNotes,
        diagnosis,
        prescriptions,
        recommendations,
        followUpDate: followUpDate || undefined
      });

      // Acknowledge consultation to complete Workflow B and dispatch notifications
      await consultationApi.acknowledgeConsultation(appointmentId);

      setSuccessMsg('Consultation completed successfully. Patient has been sent clinical summary and acknowledgement.');
      setTimeout(() => {
        navigate('/doctor/appointments');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to complete consultation.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/doctor/appointments')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to appointments
      </button>

      {/* Header Info Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Clinical Workspace</span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Session with {appointment?.patientName || 'Verified Patient'}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {appointment?.appointmentDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {appointment?.appointmentTime.slice(0, 5)}
            </span>
            <span className="flex items-center gap-1 font-semibold text-teal-700">
              {appointment?.consultationType === 'VIDEO' ? <Video className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
              {appointment?.consultationType}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
            {appointment?.status}
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-teal-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Patient Reason Note */}
      {appointment?.reasonForVisit && (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 text-xs">
          <span className="font-bold text-amber-900 block mb-0.5">Patient Visit Reason:</span>
          <p className="text-amber-800">{appointment.reasonForVisit}</p>
        </div>
      )}

      {/* Clinical Notes Form */}
      <form onSubmit={handleCompleteConsultation} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-600" /> Clinical Notes & Assessment Documentation
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Preliminary Clinical Impression / Focus Area
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g., Moderate Generalized Anxiety Symptoms, Work-related Adjustment Stress..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Clinical Session Notes & Observations <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={5}
              required
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Document patient presentation, cognitive distortions, coping strategies discussed, and clinical feedback..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Targeted Interventions & Recommendations
            </label>
            <textarea
              rows={3}
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="Prescribed CBT thought records, behavioral activation exercises, sleep hygiene routines..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pharmacotherapy / Medication Notes (Optional)
              </label>
              <input
                type="text"
                value={prescriptions}
                onChange={(e) => setPrescriptions(e.target.value)}
                placeholder="Prescription or lifestyle regimen (if applicable)..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Recommended Follow-Up Date
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Acknowledge will notify the patient and record consultation completion in their medical history.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? 'Submitting...' : 'Complete & Acknowledge Consultation'}
          </button>
        </div>
      </form>
    </div>
  );
};
