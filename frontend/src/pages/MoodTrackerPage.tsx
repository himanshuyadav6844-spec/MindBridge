import React, { useEffect, useState } from 'react';
import { MoodEntry } from '../types';
import api from '../services/api';
import {
  Smile,
  Calendar,
  Trash2,
  Edit2,
  Plus,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const MoodTrackerPage: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [moodScore, setMoodScore] = useState(4);
  const [emotionLabel, setEmotionLabel] = useState('Hope');
  const [stressLevel, setStressLevel] = useState(2);
  const [sleepQuality, setSleepQuality] = useState(4);
  const [journalEntry, setJournalEntry] = useState('');

  const EMOTIONS = ['Happiness', 'Sadness', 'Anger', 'Fear', 'Anxiety', 'Frustration', 'Loneliness', 'Hope', 'Neutral'];

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      const res: any = await api.get('/moods');
      const moodList = (res.data?.data !== undefined ? res.data.data : res.data) || [];
      setEntries(moodList);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch mood records');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        moodScore,
        emotionLabel,
        stressLevel,
        sleepQuality,
        journalEntry,
      };
      await api.post('/moods', payload);
      setJournalEntry('');
      await fetchMoodHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to record mood entry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this mood record?')) return;
    try {
      await api.delete(`/moods/${id}`);
      setEntries(entries.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete mood record');
    }
  };

  const chartData = [...entries].reverse().map((e) => ({
    date: e.entryDate.slice(5),
    mood: e.moodScore,
    stress: e.stressLevel,
    sleep: e.sleepQuality,
  }));

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daily Mood & Wellness Tracker</h1>
        <p className="text-xs text-slate-500">Track your daily emotional fluctuations, sleep quality, and stress markers</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Mood Entry Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md shadow-slate-200/50 space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Smile className="w-4 h-4 text-teal-600" />
          <span>Log Your Current State</span>
        </h2>

        <form onSubmit={handleCreateEntry} className="space-y-6">
          {/* Mood 1-5 slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <span>Overall Mood (1 to 5)</span>
              <span className="text-teal-700 font-bold text-sm">
                {moodScore === 1 ? '1 - Very Low 😢' :
                 moodScore === 2 ? '2 - Low 🙁' :
                 moodScore === 3 ? '3 - Neutral 😐' :
                 moodScore === 4 ? '4 - Good 🙂' : '5 - Very Good 😄'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={moodScore}
              onChange={(e) => setMoodScore(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* Primary Emotion Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Dominant Emotion</label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((emo) => (
                <button
                  key={emo}
                  type="button"
                  onClick={() => setEmotionLabel(emo)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    emotionLabel === emo
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {emo}
                </button>
              ))}
            </div>
          </div>

          {/* Stress & Sleep sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Perceived Stress Level</span>
                <span className="text-amber-700 font-bold">{stressLevel}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 - Peaceful</span>
                <span>5 - Overwhelmed</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Sleep Quality</span>
                <span className="text-sky-700 font-bold">{sleepQuality}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={sleepQuality}
                onChange={(e) => setSleepQuality(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 - Restless</span>
                <span>5 - Deep & Restorative</span>
              </div>
            </div>
          </div>

          {/* Journal Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Journal & Reflections (Optional)</label>
            <textarea
              rows={3}
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="What factors contributed to your mood today? Any specific wins or stressors?"
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Record Daily Entry'}
          </button>
        </form>
      </div>

      {/* Mood History Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Longitudinal Mood & Stress History</h3>
        <div className="h-64 w-full pt-2">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[1, 5]} stroke="#94A3B8" fontSize={11} tickLine={false} ticks={[1, 2, 3, 4, 5]} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="mood" name="Mood (1-5)" stroke="#0D9488" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="stress" name="Stress (1-5)" stroke="#D97706" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="sleep" name="Sleep (1-5)" stroke="#0284C7" strokeWidth={2} strokeDasharray="2 2" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No entries logged yet.
            </div>
          )}
        </div>
      </div>

      {/* Historical List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Past Entries</h3>
        <div className="divide-y divide-slate-100">
          {entries.map((entry) => (
            <div key={entry.id} className="py-3.5 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">
                    Mood: {entry.moodScore}/5 ({entry.emotionLabel})
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {entry.entryDate} at {entry.entryTime}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Stress: <strong className="text-slate-700">{entry.stressLevel}/5</strong> • Sleep: <strong className="text-slate-700">{entry.sleepQuality}/5</strong>
                </div>
                {entry.journalEntry && (
                  <p className="text-xs text-slate-700 italic pt-1">"{entry.journalEntry}"</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                title="Delete Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
