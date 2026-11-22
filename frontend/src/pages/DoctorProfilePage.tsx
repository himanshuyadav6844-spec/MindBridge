import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doctorApi } from '../services/api';
import { DoctorProfile, DoctorReview } from '../types';
import { Star, ShieldCheck, Award, GraduationCap, Clock, Calendar, CheckCircle2, Video, Phone, MapPin, ArrowLeft } from 'lucide-react';

export const DoctorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [reviews, setReviews] = useState<DoctorReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      loadProfile(id);
    }
  }, [id]);

  const loadProfile = async (doctorId: string) => {
    setLoading(true);
    try {
      const [docRes, reviewRes] = await Promise.all([
        doctorApi.getDoctorById(doctorId),
        doctorApi.getDoctorReviews(doctorId).catch(() => ({ data: { data: [] } }))
      ]);

      if (docRes.data?.success && docRes.data?.data) {
        setDoctor(docRes.data.data);
      }
      if (reviewRes.data?.data) {
        setReviews(reviewRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load doctor profile', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8">
        <h3 className="text-lg font-semibold text-slate-700">Practitioner Not Found</h3>
        <p className="text-sm text-slate-500 mt-1">The requested doctor profile could not be retrieved.</p>
        <button
          onClick={() => navigate('/doctors')}
          className="mt-4 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to specialists
      </button>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-24 h-24 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-3xl border-2 border-teal-200 shadow-inner">
            {doctor.fullName.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{doctor.fullName}</h1>
              {doctor.verified && (
                <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-teal-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
            <p className="text-base font-semibold text-teal-700">{doctor.specialization}</p>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-slate-400" /> {doctor.qualification}
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-slate-400" /> {doctor.yearsOfExperience} Years Clinical Practice
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                Reg: {doctor.registrationNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
          <div>
            <span className="text-xs text-slate-500">Consultation Fee</span>
            <div className="text-2xl font-black text-slate-900">₹{doctor.consultationFee.toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-slate-400">per 45-min session</span>
          </div>
          <Link
            to={`/appointments/book?doctorId=${doctor.id}`}
            className="w-full px-5 py-2.5 bg-teal-600 text-white font-semibold text-sm rounded-lg hover:bg-teal-700 shadow transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Book Appointment
          </Link>
        </div>
      </div>

      {/* Bio and Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-lg font-bold text-slate-900">About Practitioner</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {doctor.bio || 'Compassionate healthcare provider dedicated to comprehensive mental well-being and clinical care.'}
            </p>
          </div>

          {/* Reviews & Testimonials */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Patient Reviews & Feedback</h2>
              <div className="flex items-center gap-1 text-sm font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{doctor.rating?.toFixed(1) || '5.0'}</span>
                <span className="text-slate-400 text-xs">({reviews.length} reviews)</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No public reviews submitted yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev.id} className="py-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">{rev.patientName || 'Anonymous Patient'}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    {rev.comment && <p className="text-xs text-slate-600 leading-normal">{rev.comment}</p>}
                    <span className="text-[11px] text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Practice Highlights & Availability */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Modes of Consultation</h3>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <Video className="w-4 h-4 text-teal-600" />
                <div>
                  <p className="font-semibold text-slate-800">Secure HD Video Call</p>
                  <p className="text-slate-500">100% encrypted tele-consultation</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <Phone className="w-4 h-4 text-indigo-600" />
                <div>
                  <p className="font-semibold text-slate-800">Direct Audio Session</p>
                  <p className="text-slate-500">Confidential voice consultation</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <MapPin className="w-4 h-4 text-rose-500" />
                <div>
                  <p className="font-semibold text-slate-800">In-Clinic Consultation</p>
                  <p className="text-slate-500">Subject to clinic schedule</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-teal-50 rounded-xl border border-teal-100 p-5 space-y-2 text-xs text-teal-900">
            <div className="flex items-center gap-1.5 font-bold text-teal-800 text-sm">
              <CheckCircle2 className="w-4 h-4 text-teal-600" /> Mind-Bridge Assurance
            </div>
            <p className="leading-relaxed">
              Every consultation is strictly confidential and protected under patient-doctor privilege and data encryption standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
