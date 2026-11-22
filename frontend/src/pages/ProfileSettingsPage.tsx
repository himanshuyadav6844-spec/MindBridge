import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { patientApi } from '../services/api';
import { User, Phone, Calendar, ShieldCheck, HeartPulse, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [emergencyContactName, setEmergencyContactName] = useState<string>('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState<string>('');

  useEffect(() => {
    if (user?.role === 'ROLE_PATIENT') {
      patientApi.getProfile()
        .then(res => {
          if (res.data?.success && res.data?.data) {
            const p = res.data.data;
            setProfile(p);
            setDateOfBirth(p.dateOfBirth || '');
            setGender(p.gender || '');
            setEmergencyContactName(p.emergencyContactName || '');
            setEmergencyContactPhone(p.emergencyContactPhone || '');
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await patientApi.updateProfile({
        dateOfBirth: dateOfBirth || undefined,
        gender: gender || undefined,
        emergencyContactName: emergencyContactName || undefined,
        emergencyContactPhone: emergencyContactPhone || undefined
      });
      setMessage({ type: 'success', text: 'Profile and emergency contact settings updated successfully.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profile & Safety Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal details and trusted emergency contact for safety protocols.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
          message.type === 'success'
            ? 'bg-teal-50 border-teal-200 text-teal-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Account Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Full Legal Name</span>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-semibold">
              {user?.fullName}
            </div>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Email Address</span>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-semibold">
              {user?.email}
            </div>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Account Role</span>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-semibold">
              {user?.role.replace('ROLE_', '')}
            </div>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Status</span>
            <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-semibold">
              Active & Verified
            </div>
          </div>
        </div>
      </div>

      {/* Patient Specific Editable Settings */}
      {user?.role === 'ROLE_PATIENT' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-500" /> Personal & Demographic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" /> Emergency Safety Contact
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              In the event of an urgent risk score or crisis flag, our system will notify this trusted contact alongside recommending crisis helpline resources.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g., Parent, Spouse, Guardian"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g., +91 98765 43210"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-teal-600 text-white font-semibold text-sm rounded-lg hover:bg-teal-700 shadow-sm transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
