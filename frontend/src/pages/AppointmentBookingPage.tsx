import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doctorApi, appointmentApi } from '../services/api';
import { DoctorProfile } from '../types';
import { Calendar, Clock, AlertCircle, CheckCircle2, ChevronRight, ShieldCheck, Video, Phone, MapPin } from 'lucide-react';

const TIME_SLOTS = [
  '09:00:00',
  '10:00:00',
  '11:00:00',
  '12:00:00',
  '14:00:00',
  '15:00:00',
  '16:00:00',
  '17:00:00'
];

export const AppointmentBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const doctorIdParam = searchParams.get('doctorId');

  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctorIdParam || '');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);

  // Tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [appointmentDate, setAppointmentDate] = useState<string>(minDateStr);
  const [appointmentTime, setAppointmentTime] = useState<string>('10:00:00');
  const [consultationType, setConsultationType] = useState<string>('VIDEO');
  const [reason, setReason] = useState<string>('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingSlots, setFetchingSlots] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Load verified doctors list
  useEffect(() => {
    doctorApi.getDoctors().then(res => {
      if (res.data?.success && res.data?.data) {
        setDoctors(res.data.data);
        if (!selectedDoctorId && res.data.data.length > 0) {
          setSelectedDoctorId(res.data.data[0].id);
        }
      }
    }).catch(console.error);
  }, []);

  // Update selected doctor object
  useEffect(() => {
    if (selectedDoctorId) {
      const doc = doctors.find(d => d.id === selectedDoctorId);
      if (doc) setSelectedDoctor(doc);
      else {
        doctorApi.getDoctorById(selectedDoctorId).then(res => {
          if (res.data?.success && res.data?.data) setSelectedDoctor(res.data.data);
        }).catch(console.error);
      }
    }
  }, [selectedDoctorId, doctors]);

  // Fetch booked slots whenever doctor or date changes
  useEffect(() => {
    if (selectedDoctorId && appointmentDate) {
      setFetchingSlots(true);
      appointmentApi.getBookedSlots(selectedDoctorId, appointmentDate)
        .then(res => {
          if (res.data?.success && res.data?.data) {
            setBookedSlots(res.data.data);
          } else {
            setBookedSlots([]);
          }
        })
        .catch(() => setBookedSlots([]))
        .finally(() => setFetchingSlots(false));
    }
  }, [selectedDoctorId, appointmentDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      setError('Please select a healthcare professional.');
      return;
    }
    if (!appointmentDate || !appointmentTime) {
      setError('Please select both appointment date and time slot.');
      return;
    }
    if (bookedSlots.includes(appointmentTime)) {
      setError('This time slot has already been reserved. Please pick another slot.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await appointmentApi.bookAppointment({
        doctorId: selectedDoctorId,
        appointmentDate,
        appointmentTime,
        consultationType,
        reasonForVisit: reason
      });

      if (res.data?.success && res.data?.data) {
        setSuccess(true);
        setConfirmedBookingId(res.data.data.id);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to book appointment. Please check availability and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Appointment Confirmed!</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your appointment with <span className="font-semibold text-slate-800">{selectedDoctor?.fullName}</span> has been scheduled successfully.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 max-w-sm mx-auto text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Date:</span>
            <span className="font-semibold text-slate-800">{appointmentDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Time:</span>
            <span className="font-semibold text-slate-800">{appointmentTime.slice(0, 5)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Mode:</span>
            <span className="font-semibold text-slate-800">{consultationType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status:</span>
            <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">CONFIRMED</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={() => navigate('/appointments')}
            className="px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 shadow transition-colors"
          >
            View My Appointments
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Schedule a Consultation</h1>
        <p className="text-sm text-slate-500 mt-1">
          Select a verified mental health practitioner, choose a convenient time slot, and reserve your session.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Form Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Doctor Selection */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <label className="block text-sm font-bold text-slate-900">1. Select Specialist</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            >
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.fullName} — {doc.specialization} (₹{doc.consultationFee})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Selection */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <label className="block text-sm font-bold text-slate-900">2. Select Date & Slot</label>
            
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1.5">Date</span>
              <input
                type="date"
                min={minDateStr}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Available Time Slots (45 mins)</span>
                {fetchingSlots && <span className="text-xs text-teal-600 animate-pulse">Checking availability...</span>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TIME_SLOTS.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = appointmentTime === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      disabled={isBooked}
                      onClick={() => setAppointmentTime(slot)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                        isBooked
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-teal-500 hover:text-teal-600'
                      }`}
                    >
                      {slot.slice(0, 5)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode of Consultation */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-700 block mb-2">Consultation Mode</span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'VIDEO', label: 'Video Call', icon: Video },
                  { id: 'AUDIO', label: 'Audio Call', icon: Phone },
                  { id: 'IN_PERSON', label: 'In Clinic', icon: MapPin }
                ].map(mode => {
                  const Icon = mode.icon;
                  return (
                    <button
                      type="button"
                      key={mode.id}
                      onClick={() => setConsultationType(mode.id)}
                      className={`p-3 rounded-lg border text-center flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                        consultationType === mode.id
                          ? 'border-teal-600 bg-teal-50/50 text-teal-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reason for visit */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-700 block mb-1.5">Primary Reason / Notes (Optional)</span>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe what you'd like to discuss (e.g., persistent stress, sleep disruption, anxiety)..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Summary Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Booking Summary</h3>

            {selectedDoctor && (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400">Doctor</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedDoctor.fullName}</p>
                  <p className="text-teal-700">{selectedDoctor.specialization}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between">
                  <span className="text-slate-500">Date</span>
                  <span className="font-semibold text-slate-800">{appointmentDate}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Time</span>
                  <span className="font-semibold text-slate-800">{appointmentTime.slice(0, 5)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Mode</span>
                  <span className="font-semibold text-slate-800">{consultationType}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-slate-600 font-semibold">Total Fee</span>
                  <span className="text-lg font-black text-slate-900">₹{selectedDoctor.consultationFee.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 text-white font-semibold text-sm rounded-lg hover:bg-teal-700 shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Confirming...' : 'Confirm & Reserve Slot'}
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-normal">
              You can cancel or reschedule up to 2 hours before the start time without penalty.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-900 space-y-1">
            <span className="font-bold">Confidentiality Guarantee</span>
            <p className="text-blue-700">
              Your appointment details and communication with the practitioner are strictly protected under medical privacy protocols.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
