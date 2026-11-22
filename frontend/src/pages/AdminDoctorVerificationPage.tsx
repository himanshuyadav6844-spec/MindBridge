import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { DoctorProfile } from '../types';
import { ShieldCheck, CheckCircle2, Clock, Award, GraduationCap, AlertCircle, FileText } from 'lucide-react';

export const AdminDoctorVerificationPage: React.FC = () => {
  const [pendingDoctors, setPendingDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadPendingDoctors();
  }, []);

  const loadPendingDoctors = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPendingDoctors();
      if (res.data?.success && res.data?.data) {
        setPendingDoctors(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load pending doctors', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (doctorId: string) => {
    setVerifyingId(doctorId);
    try {
      await adminApi.verifyDoctor(doctorId);
      setSuccessMessage('Doctor credentials successfully verified and activated on the platform.');
      await loadPendingDoctors();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to verify doctor', err);
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Doctor Verification Portal</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review medical credentials, license numbers, and qualifications of healthcare professionals requesting to join Mind-Bridge.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-teal-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        </div>
      ) : pendingDoctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 p-8">
          <ShieldCheck className="w-12 h-12 text-teal-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">No Pending Approvals</h3>
          <p className="text-sm text-slate-500 mt-1">All registered doctors have been reviewed and verified.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{doc.fullName}</h3>
                  <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Awaiting Review
                  </span>
                </div>
                <p className="text-xs font-semibold text-teal-700">{doc.specialization}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4 text-slate-400" /> {doc.qualification}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-slate-400" /> {doc.yearsOfExperience} Years Experience
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded font-mono text-slate-700">
                    Reg No: {doc.registrationNumber}
                  </span>
                </div>

                {doc.bio && (
                  <p className="text-xs text-slate-600 max-w-xl italic mt-1 leading-relaxed">
                    "{doc.bio}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  disabled={verifyingId === doc.id}
                  onClick={() => handleVerify(doc.id)}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {verifyingId === doc.id ? 'Approving...' : 'Approve & Verify'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
