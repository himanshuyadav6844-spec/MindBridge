import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CbtExercise } from '../types';
import api from '../services/api';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Wind,
  Brain,
  Sparkles,
  Smile,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const CbtExercisePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState<CbtExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // General fields
  const [moodBefore, setMoodBefore] = useState(3);
  const [moodAfter, setMoodAfter] = useState(4);
  const [reflectionNotes, setReflectionNotes] = useState('');

  // Breathing Box timer state
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [breathingActive, setBreathingActive] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Form data for Thought Journal / Restructuring / Gratitude
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [field3, setField3] = useState('');
  const [distortionType, setDistortionType] = useState('All-or-Nothing Thinking');

  useEffect(() => {
    if (slug) fetchExercise(slug);
  }, [slug]);

  // Guided breathing loop
  useEffect(() => {
    let interval: any = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev > 1) return prev - 1;
          setBreathingPhase((phase) => {
            if (phase === 'Inhale') return 'Hold';
            if (phase === 'Hold') return 'Exhale';
            if (phase === 'Exhale') return 'Pause';
            setCyclesCompleted((c) => c + 1);
            return 'Inhale';
          });
          return 4;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingActive]);

  const fetchExercise = async (exerciseSlug: string) => {
    try {
      const res: any = await api.get(`/cbt/exercises/${exerciseSlug}`);
      const exerciseData = res.data?.data !== undefined ? res.data.data : res.data;
      setExercise(exerciseData);
    } catch (err: any) {
      setError(err.message || 'Failed to load exercise');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercise) return;
    setSubmitting(true);
    try {
      const responseData = JSON.stringify({
        field1,
        field2,
        field3,
        distortionType,
        breathingCycles: cyclesCompleted,
      });

      await api.post('/cbt/progress', {
        exerciseId: exercise.id,
        status: 'COMPLETED',
        userResponseData: responseData,
        reflectionNotes,
        moodBefore,
        moodAfter,
      });

      setCompleted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to save CBT progress');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!exercise) {
    return <div className="text-center p-8">Exercise not found</div>;
  }

  const isBreathing = exercise.slug === 'guided-breathing';

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      {/* Back button & Title */}
      <div className="space-y-4">
        <button
          onClick={() => navigate('/cbt-exercises')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase">
              {exercise.category}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{exercise.title}</h1>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            <Clock className="w-4 h-4 text-teal-600" /> {exercise.durationMinutes} Minutes
          </span>
        </div>
      </div>

      {/* Instructions Box */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
        <h3 className="font-bold text-slate-900 text-sm">Clinical Instructions</h3>
        <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{exercise.instructions}</p>
      </div>

      {completed ? (
        <div className="bg-white p-8 rounded-3xl border border-teal-200 shadow-md text-center space-y-4">
          <CheckCircle2 className="w-14 h-14 text-teal-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Exercise Completed!</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Great job dedicating time to your emotional well-being. Your responses and mood shift have been saved to your progress history.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => navigate('/cbt-exercises')}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-xs"
            >
              Explore More Exercises
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs"
            >
              Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveProgress} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          {/* Mood Before */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <span>Mood Before Starting Exercise</span>
              <span className="text-teal-700 font-bold">{moodBefore}/5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={moodBefore}
              onChange={(e) => setMoodBefore(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* Interactive Component based on type */}
          {isBreathing ? (
            <div className="p-8 rounded-3xl bg-gradient-to-b from-teal-50/50 to-sky-50/50 border border-teal-100 flex flex-col items-center justify-center space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs font-semibold text-teal-800 uppercase tracking-widest">Box Breathing (4-4-4-4)</span>
                <h4 className="text-2xl font-extrabold text-teal-950">{breathingPhase}</h4>
                <div className="text-4xl font-mono font-bold text-teal-600">{breathingTimer}s</div>
              </div>

              {/* Pulsing Visual Box */}
              <div className="w-36 h-36 rounded-3xl border-4 border-teal-400 bg-white/80 shadow-lg flex items-center justify-center transition-all duration-1000 transform scale-105">
                <Wind className="w-12 h-12 text-teal-600 animate-pulse" />
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Cycles completed: <strong className="text-slate-800">{cyclesCompleted}</strong>
              </div>

              <button
                type="button"
                onClick={() => setBreathingActive(!breathingActive)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  breathingActive ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
                }`}
              >
                {breathingActive ? 'Pause Breathing' : 'Start Guided Rhythm'}
              </button>
            </div>
          ) : exercise.slug === 'cognitive-restructuring' ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">1. Automatic Negative Thought</label>
                <textarea
                  rows={2}
                  required
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  placeholder="e.g., I made a minor mistake at work, so I am going to get fired and ruined everything."
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">2. Identify Cognitive Distortion Pattern</label>
                <select
                  value={distortionType}
                  onChange={(e) => setDistortionType(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none bg-white"
                >
                  <option>All-or-Nothing Thinking</option>
                  <option>Catastrophizing</option>
                  <option>Mental Filtering</option>
                  <option>Mind Reading</option>
                  <option>Emotional Reasoning</option>
                  <option>Should Statements</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">3. Evidence Supporting the Thought</label>
                  <textarea
                    rows={3}
                    value={field2}
                    onChange={(e) => setField2(e.target.value)}
                    placeholder="Facts that substantiate this worry..."
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">4. Evidence Against the Thought</label>
                  <textarea
                    rows={3}
                    value={field3}
                    onChange={(e) => setField3(e.target.value)}
                    placeholder="Realistic contradictions or past successes..."
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Triggering Situation or Experience</label>
                <textarea
                  rows={2}
                  required
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  placeholder="Describe what occurred today..."
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Reflections & Emotional Responses</label>
                <textarea
                  rows={3}
                  value={field2}
                  onChange={(e) => setField2(e.target.value)}
                  placeholder="What thoughts and feelings arose? What perspective brings ease?"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Reflection & Mood After */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Mood After Completing Exercise</span>
                <span className="text-teal-700 font-bold">{moodAfter}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={moodAfter}
                onChange={(e) => setMoodAfter(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Takeaway Reflection Notes</label>
              <textarea
                rows={2}
                value={reflectionNotes}
                onChange={(e) => setReflectionNotes(e.target.value)}
                placeholder="What did you learn from completing this exercise?"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
          >
            {submitting ? 'Recording Progress...' : 'Complete & Save Exercise'}
          </button>
        </form>
      )}
    </div>
  );
};
