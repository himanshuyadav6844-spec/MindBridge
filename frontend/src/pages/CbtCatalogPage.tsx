import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CbtExercise, PatientCbtProgress } from '../types';
import api from '../services/api';
import {
  BookOpenCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';

export const CbtCatalogPage: React.FC = () => {
  const [exercises, setExercises] = useState<CbtExercise[]>([]);
  const [progress, setProgress] = useState<PatientCbtProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCbtData();
  }, []);

  const fetchCbtData = async () => {
    try {
      const [exRes, progRes]: [any, any] = await Promise.all([
        api.get('/cbt/exercises'),
        api.get('/cbt/progress'),
      ]);
      const exList = exRes.data?.data !== undefined ? exRes.data.data : exRes.data;
      const progList = progRes.data?.data !== undefined ? progRes.data.data : progRes.data;
      setExercises(exList || []);
      setProgress(progList || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completedSlugs = new Set(
    progress.filter((p) => p.status === 'COMPLETED').map((p) => p.exercise?.slug)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Evidence-Informed Psychology
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cognitive Behavioral Therapy (CBT) Modules</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Practical, supportive cognitive restructuring, mindfulness, and somatic exercises designed to help you identify cognitive distortions and build psychological flexibility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exercises.map((ex) => {
          const isDone = completedSlugs.has(ex.slug);
          return (
            <div
              key={ex.id}
              className={`p-6 rounded-3xl border bg-white flex flex-col justify-between transition-all hover:shadow-md ${
                isDone ? 'border-teal-200' : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                    {ex.category}
                  </span>
                  {isDone ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-teal-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> {ex.durationMinutes} mins
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base">{ex.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ex.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  to={`/cbt-exercises/${ex.slug}`}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isDone
                      ? 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                      : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
                  }`}
                >
                  <span>{isDone ? 'Practice Again' : 'Start Exercise'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
