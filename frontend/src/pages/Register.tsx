import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, User, Stethoscope, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Register: React.FC = () => {
  const { registerPatient, registerDoctor } = useAuth();
  const navigate = useNavigate();

  const [roleType, setRoleType] = useState<'patient' | 'doctor'>('patient');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [doctorSuccess, setDoctorSuccess] = useState(false);

  // Patient Fields
  const [patientForm, setPatientForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: 'Prefer not to say',
    phoneNumber: '',
    privacyPolicyConsent: true,
  });

  // Doctor Fields
  const [doctorForm, setDoctorForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    qualification: '',
    primarySpecialization: 'Clinical Psychology',
    experienceYears: 5,
    licenseNumber: '',
    consultationFee: 1500,
    professionalDescription: '',
    phoneNumber: '',
  });

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (patientForm.password !== patientForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await registerPatient({
        fullName: patientForm.fullName,
        email: patientForm.email,
        password: patientForm.password,
        dateOfBirth: patientForm.dateOfBirth || null,
        gender: patientForm.gender,
        phoneNumber: patientForm.phoneNumber,
        privacyPolicyConsent: patientForm.privacyPolicyConsent,
      });
      navigate('/assessment');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (doctorForm.password !== doctorForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await registerDoctor({
        fullName: doctorForm.fullName,
        email: doctorForm.email,
        password: doctorForm.password,
        qualification: doctorForm.qualification,
        primarySpecialization: doctorForm.primarySpecialization,
        experienceYears: Number(doctorForm.experienceYears),
        licenseNumber: doctorForm.licenseNumber,
        consultationFee: Number(doctorForm.consultationFee),
        professionalDescription: doctorForm.professionalDescription,
        phoneNumber: doctorForm.phoneNumber,
      });
      setDoctorSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-500/20">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create an Account</h2>
          <p className="text-xs text-slate-500">Join MindBridge as a patient or medical mental health practitioner</p>
        </div>

        {/* Tab switch between Patient and Doctor */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => { setRoleType('patient'); setError(null); }}
            className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              roleType === 'patient' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" /> Patient Account
          </button>
          <button
            type="button"
            onClick={() => { setRoleType('doctor'); setError(null); }}
            className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              roleType === 'doctor' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" /> Doctor / Specialist
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {doctorSuccess ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-teal-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Application Submitted for Review</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Thank you for registering. In accordance with healthcare standards, your clinical license credentials will be verified by an administrator before your profile is published in the directory.
            </p>
            <div className="pt-2">
              <Link to="/login" className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-xs">
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : roleType === 'patient' ? (
          <form onSubmit={handlePatientSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
              <input
                required
                value={patientForm.fullName}
                onChange={(e) => setPatientForm({ ...patientForm, fullName: e.target.value })}
                placeholder="e.g. Aarav Patel"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={patientForm.email}
                  onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                  placeholder="aarav@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                <input
                  value={patientForm.phoneNumber}
                  onChange={(e) => setPatientForm({ ...patientForm, phoneNumber: e.target.value })}
                  placeholder="+91-9876543210"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={patientForm.dateOfBirth}
                  onChange={(e) => setPatientForm({ ...patientForm, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender (Optional)</label>
                <select
                  value={patientForm.gender}
                  onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none bg-white"
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password (min 8 chars) *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={patientForm.password}
                  onChange={(e) => setPatientForm({ ...patientForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={patientForm.confirmPassword}
                  onChange={(e) => setPatientForm({ ...patientForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  required
                  checked={patientForm.privacyPolicyConsent}
                  onChange={(e) => setPatientForm({ ...patientForm, privacyPolicyConsent: e.target.checked })}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <span>I consent to MindBridge's Privacy Policy and understand that this platform provides emotional wellness screening rather than clinical diagnostic care.</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Complete Patient Registration'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleDoctorSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name & Title *</label>
              <input
                required
                value={doctorForm.fullName}
                onChange={(e) => setDoctorForm({ ...doctorForm, fullName: e.target.value })}
                placeholder="Dr. Priya Sharma, Ph.D."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Professional Email *</label>
                <input
                  type="email"
                  required
                  value={doctorForm.email}
                  onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                  placeholder="dr.sharma@hospital.org"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  value={doctorForm.phoneNumber}
                  onChange={(e) => setDoctorForm({ ...doctorForm, phoneNumber: e.target.value })}
                  placeholder="+91-9876543210"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medical/Psychology Qualification *</label>
                <input
                  required
                  value={doctorForm.qualification}
                  onChange={(e) => setDoctorForm({ ...doctorForm, qualification: e.target.value })}
                  placeholder="e.g. M.D. in Psychiatry / Ph.D."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialization *</label>
                <select
                  value={doctorForm.primarySpecialization}
                  onChange={(e) => setDoctorForm({ ...doctorForm, primarySpecialization: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none bg-white"
                >
                  <option>Clinical Psychology</option>
                  <option>Psychiatry</option>
                  <option>Counselling Psychology</option>
                  <option>Neuropsychiatry</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Years Experience *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={doctorForm.experienceYears}
                  onChange={(e) => setDoctorForm({ ...doctorForm, experienceYears: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">License / Reg. No. *</label>
                <input
                  required
                  value={doctorForm.licenseNumber}
                  onChange={(e) => setDoctorForm({ ...doctorForm, licenseNumber: e.target.value })}
                  placeholder="RCI / MCI registration"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fee (INR) *</label>
                <input
                  type="number"
                  required
                  value={doctorForm.consultationFee}
                  onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinical Practice Bio & Focus Areas</label>
              <textarea
                rows={3}
                value={doctorForm.professionalDescription}
                onChange={(e) => setDoctorForm({ ...doctorForm, professionalDescription: e.target.value })}
                placeholder="Briefly describe your clinical focus (e.g. CBT, trauma care, adult mood disorders)..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={doctorForm.password}
                  onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={doctorForm.confirmPassword}
                  onChange={(e) => setDoctorForm({ ...doctorForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting Credentials...' : 'Submit Doctor Registration'}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-500 pt-2">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700 underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
