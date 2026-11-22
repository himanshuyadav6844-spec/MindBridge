import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PatientDashboardData } from '../types';
import api from '../services/api';
import {
  Smile,
  Activity,
  Calendar,
  BookOpenCheck,
  MessageSquareHeart,
  Stethoscope,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<PatientDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res: any = await api.get('/patients/me/dashboard');
      const dashData = res.data?.data !== undefined ? res.data.data : res.data;
      setData(dashData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (score: number) => {
    switch (score) {
      case 5: return '😄 Very Good';
      case 4: return '🙂 Good';
      case 3: return '😐 Neutral';
      case 2: return '🙁 Low';
      case 1: return '😢 Very Low';
      default: return '😐 Neutral';
    }
  };

  const chartData = (data?.recentMoodTrends || []).map((m) => ({
    date: m.entryDate.slice(5),
    mood: m.moodScore,
    stress: m.stressLevel,
    sleep: m.sleepQuality,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/30 text-teal-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            {data?.currentDate || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {data?.fullName || user?.fullName}!
          </h1>
          <p className="text-teal-100 text-sm leading-relaxed">
            Your mindful emotional space. Track your mood, practice evidence-informed CBT exercises, or consult with certified specialists whenever you need.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/assessment"
              className="px-4 py-2 bg-white text-teal-900 font-bold text-xs rounded-xl hover:bg-teal-50 transition-all flex items-center gap-1.5"
            >
              Start Clinical Assessment <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/mood-tracker"
              className="px-4 py-2 bg-teal-600/80 text-white font-semibold text-xs rounded-xl hover:bg-teal-600 transition-all"
            >
              Log Today's Mood
            </Link>
          </div>
        </div>
      </div>

      {/* Wellness Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Current Mood */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Latest Mood</span>
            <Smile className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {data?.latestMood ? getMoodEmoji(data.latestMood.moodScore) : 'Not Logged Today'}
          </div>
          <div className="text-[11px] text-slate-500">
            {data?.latestMood ? `Emotion: ${data.latestMood.emotionLabel}` : 'Check in to track emotional changes'}
          </div>
        </div>

        {/* Latest Assessment */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Assessment Result</span>
            <Activity className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {data?.latestAssessment ? data.latestAssessment.riskLevel.replace('_', ' ') : 'No Records Yet'}
          </div>
          <div className="text-[11px] text-slate-500">
            {data?.latestAssessment ? `Dominant Emotion: ${data.latestAssessment.dominantEmotion}` : '10-minute validated check'}
          </div>
        </div>

        {/* CBT Exercises Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>CBT Progress</span>
            <BookOpenCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {data?.completedCbtExercisesCount || 0} Exercises
          </div>
          <div className="text-[11px] text-slate-500">Completed activities</div>
        </div>

        {/* Total Assessments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Screenings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {data?.totalAssessmentsCount || 0} Evaluated
          </div>
          <div className="text-[11px] text-slate-500">Self-reported progress</div>
        </div>
      </div>

      {/* Main Grid: Upcoming Appointment & Mood Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Mood Trends Graph */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Weekly Mood & Stress Trend</h3>
              <p className="text-xs text-slate-500">Tracked emotional intensity over recent days</p>
            </div>
            <Link to="/mood-tracker" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
              View All History →
            </Link>
          </div>

          <div className="h-64 w-full pt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis domain={[1, 5]} stroke="#94A3B8" fontSize={11} tickLine={false} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="mood" name="Mood Score (1-5)" stroke="#0D9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMood)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                <Smile className="w-10 h-10 text-slate-300" />
                <p className="text-xs">No recent mood entries recorded yet.</p>
                <Link to="/mood-tracker" className="text-xs font-bold text-teal-600">Log First Entry</Link>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointment Widget */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">Next Consultation</h3>
              <CalendarCheck className="w-4 h-4 text-teal-600" />
            </div>

            {data?.upcomingAppointment ? (
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                    {data.upcomingAppointment.doctorName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{data.upcomingAppointment.doctorName}</h4>
                    <p className="text-[11px] text-teal-700">{data.upcomingAppointment.doctorSpecialization}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-teal-200/60 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Date</span>
                    <span className="font-semibold text-slate-800">{data.upcomingAppointment.appointmentDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Time Slot</span>
                    <span className="font-semibold text-slate-800">{data.upcomingAppointment.appointmentTime}</span>
                  </div>
                </div>

                <div className="inline-block px-2.5 py-1 rounded-md bg-teal-100 text-teal-800 text-[10px] font-bold">
                  Mode: {data.upcomingAppointment.consultationMode}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-2 text-slate-400">
                <Calendar className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs text-slate-500">No upcoming consultations booked.</p>
                <Link to="/doctors" className="inline-block text-xs font-bold text-teal-600 pt-1">
                  Book a Specialist →
                </Link>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/appointments"
              className="w-full py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Manage Appointments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Quick Wellness Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link to="/assessment" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-xs transition-all text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800 block">Assessment</span>
          </Link>

          <Link to="/mood-tracker" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-xs transition-all text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <Smile className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800 block">Track Mood</span>
          </Link>

          <Link to="/cbt-exercises" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-xs transition-all text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
              <BookOpenCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800 block">Explore CBT</span>
          </Link>

          <Link to="/chatbot" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-xs transition-all text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800 block">AI Chatbot</span>
          </Link>

          <Link to="/doctors" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-xs transition-all text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800 block">Find Doctor</span>
          </Link>

          <Link to="/appointments" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-xs transition-all text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800 block">Appointments</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
