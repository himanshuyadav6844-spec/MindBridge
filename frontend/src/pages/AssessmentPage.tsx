import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssessmentQuestion } from '../types';
import api from '../services/api';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { score: number; selectedOption: string; text?: string }>>({});
  const [selfReportedMood, setSelfReportedMood] = useState(3);
  const [qualitativeText, setQualitativeText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res: any = await api.get('/assessments/questions');
      const qList = res.data?.data !== undefined ? res.data.data : res.data;
      setQuestions(qList || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch questionnaire');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, label: string, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { score, selectedOption: label },
    }));
  };

  const currentQ = questions[currentStep];
  const progressPercent = questions.length > 0 ? Math.round(((currentStep + 1) / (questions.length + 1)) * 100) : 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
        questionId: qId,
        score: val.score,
        selectedOption: val.selectedOption,
        responseText: val.text || null,
      }));

      const payload = {
        selfReportedMood,
        additionalNotes: qualitativeText,
        answers: formattedAnswers,
      };

      const res: any = await api.post('/assessments', payload);
      const assessmentResult = res.data?.data !== undefined ? res.data.data : res.data;
      navigate(`/assessment/result/${assessmentResult.assessmentId}`, { state: { result: assessmentResult } });
    } catch (err: any) {
      setError(err.message || 'Failed to submit assessment');
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

  // Final summary step before submission
  const isFinalStep = currentStep === questions.length;

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      {/* Progress Bar Header */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5 text-teal-700">
            <Compass className="w-4 h-4" />
            {isFinalStep ? 'Final Review & Reflection' : `Question ${currentStep + 1} of ${questions.length}`}
          </span>
          <span>{progressPercent}% Completed</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-teal-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Questionnaire Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md shadow-slate-200/50 space-y-6">
        {!isFinalStep && currentQ ? (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">{currentQ.category}</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentQ.questionText}
              </h2>
            </div>

            {/* If Likert question, render options */}
            {currentQ.questionType === 'TEXT' ? (
              <div>
                <textarea
                  rows={4}
                  value={qualitativeText}
                  onChange={(e) => setQualitativeText(e.target.value)}
                  placeholder="Share anything on your mind (optional)..."
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
            ) : (
              <div className="space-y-2.5">
                {JSON.parse(currentQ.optionsJson || '[]').map((opt: any) => {
                  const isSelected = answers[currentQ.id]?.selectedOption === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, opt.label, opt.score)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/70 text-teal-900 font-semibold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Final step: Self-reported Mood Rating & Final Thoughts */
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Overall Mood Check-In</h2>
              <p className="text-xs text-slate-500">How would you summarize your emotional state overall right now?</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Self-Reported Mood Scale</span>
                <span className="text-teal-700 font-bold text-sm">
                  {selfReportedMood === 1 ? '1/5 (Very Low)' :
                   selfReportedMood === 2 ? '2/5 (Low)' :
                   selfReportedMood === 3 ? '3/5 (Neutral)' :
                   selfReportedMood === 4 ? '4/5 (Good)' : '5/5 (Very Good)'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={selfReportedMood}
                onChange={(e) => setSelfReportedMood(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>1 - Very Low</span>
                <span>3 - Neutral</span>
                <span>5 - Very Good</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Additional reflections or context (Optional)</label>
              <textarea
                rows={3}
                value={qualitativeText}
                onChange={(e) => setQualitativeText(e.target.value)}
                placeholder="Feel free to describe what triggered recent emotions or what you are looking forward to..."
                className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-[11px] text-teal-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
              <span>
                Your responses are analyzed by our secure NLP engine to recommend supportive CBT exercises or verified practitioners. All findings are non-diagnostic and confidential.
              </span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 0 || submitting}
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {!isFinalStep ? (
            <button
              type="button"
              disabled={currentQ && currentQ.questionType !== 'TEXT' && !answers[currentQ.id]}
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Analyzing Responses...' : 'Submit Assessment & View Report'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
