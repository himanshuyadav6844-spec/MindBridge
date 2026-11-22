import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { doctorApi } from '../services/api';
import { DoctorProfile } from '../types';
import { Search, Filter, Star, Clock, Video, Phone, MapPin, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export const DoctorDirectoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSpecialization = searchParams.get('specialization') || '';
  
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [specialization, setSpecialization] = useState<string>(initialSpecialization);
  const [modeFilter, setModeFilter] = useState<string>('ALL');

  useEffect(() => {
    loadDoctors();
  }, [specialization]);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const res = await doctorApi.getDoctors(specialization || undefined);
      if (res.data?.success && res.data?.data) {
        setDoctors(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load doctors', err);
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    'All Specializations',
    'Clinical Psychologist',
    'Psychiatrist',
    'CBT Specialist',
    'Counseling Psychologist',
    'Neuropsychiatrist',
    'Trauma & PTSD Specialist'
  ];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.qualification.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-indigo-800 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">Verified Mental Health Specialists</h1>
        <p className="mt-2 text-teal-100 max-w-2xl text-sm leading-relaxed">
          Connect with licensed psychiatrists, clinical psychologists, and certified counselors. 
          All practitioners are vetted and approved by our medical board.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by doctor name or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value === 'All Specializations' ? '' : e.target.value)}
              className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec === 'All Specializations' ? '' : spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 p-8">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">No specialists found</h3>
          <p className="text-sm text-slate-500 mt-1">Try clearing filters or searching with different keywords.</p>
          <button
            onClick={() => { setSearchTerm(''); setSpecialization(''); }}
            className="mt-4 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xl border-2 border-teal-200">
                    {doc.fullName.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold text-amber-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{doc.rating?.toFixed(1) || '5.0'}</span>
                    <span className="text-slate-400">({doc.totalReviews || 12})</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-slate-900">{doc.fullName}</h3>
                    {doc.verified && (
                      <CheckCircle2 className="w-4 h-4 text-teal-600 fill-teal-100" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-teal-700">{doc.specialization}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{doc.qualification} • {doc.yearsOfExperience} yrs exp</p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {doc.bio || 'Compassionate and evidence-based mental health practitioner dedicated to patient recovery and well-being.'}
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-slate-700">
                    <Video className="w-3 h-3 text-teal-600" /> Video
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-slate-700">
                    <Phone className="w-3 h-3 text-indigo-600" /> Audio
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-slate-700">
                    <MapPin className="w-3 h-3 text-rose-500" /> In-person
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Consultation Fee</span>
                  <p className="text-base font-bold text-slate-900">₹{doc.consultationFee.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/doctors/${doc.id}`}
                    className="px-3 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to={`/appointments/book?doctorId=${doc.id}`}
                    className="px-3.5 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 shadow-sm transition-colors flex items-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
