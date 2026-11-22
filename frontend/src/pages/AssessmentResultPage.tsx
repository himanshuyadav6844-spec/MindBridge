import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { AssessmentResult } from '../types';
import api from '../services/api';
import {
  Activity,
  HeartHandshake,
  AlertTriangle,
  Stethoscope,
  Smile,
  BookOpenCheck,
  MessageSquareCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  PhoneCall,
  ArrowRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

export const AssessmentResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const [result, setResult] = useState<AssessmentResult | null>(location.state?.result || null);
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!result && id) {
      fetchResult(id);
    }
  }, [id, result]);

  const fetchResult = async (assessmentId: string) => {
    try {
      const res: any = await api.get(`/assessments/${assessmentId}/result`);
      const resultData = res.data?.data !== undefined ? res.data.data : res.data;
      setResult(resultData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch assessment report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-rose-600">{error || 'Result not found'}</p>
        <Link to="/assessment" className="px-4 py-2 bg-teal-600 text-white text-xs rounded-xl font-semibold">Take New Assessment</Link>
      </div>
    );
  }

  // Parse JSON fields safely
  const emotionScores: Record<string, number> = JSON.parse(result.emotionScoresJson || '{}');
  const riskFactors: string[] = JSON.parse(result.riskFactorsJson || '[]');
  const probableConditions: any[] = JSON.parse(result.probableConditionsJson || '[]');
  const recommendations: string[] = JSON.parse(result.recommendationsJson || '[]');

  const emotionChartData = Object.entries(emotionScores).map(([emo, score]) => ({
    name: emo,
    score: Math.round(score * 100),
  }));

  const isImmediateCrisis = result.riskLevel === 'IMMEDIATE_SAFETY_CONCERN' || result.recommendedWorkflow === 'URGENT_SAFETY';
  const isWorkflowB = result.riskLevel === 'SIGNIFICANT_CONCERN' || result.recommendedWorkflow === 'WORKFLOW_B';

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Top Banner / Assessment Completion */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">Evaluation Completed</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Your Emotional Wellness Report</h1>
          <p className="text-xs text-slate-500">Evaluated on {new Date(result.completedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>

      {/* Immediate Crisis Alert Box (Shown when high self-harm indicators or crisis triggers detected) */}
      {isImmediateCrisis && (
        <div className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-300 shadow-md space-y-4 text-rose-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-rose-900">Immediate Support Pathway Activated</h3>
              <p className="text-xs text-rose-700 leading-relaxed">
                Your responses indicate severe distress or safety concerns. MindBridge is an automated platform and cannot provide emergency medical intervention. Please connect right away with trained crisis professionals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white border border-rose-200 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">National Helpline</span>
              <div className="text-sm font-extrabold text-rose-700 font-mono">14416 (Tele-MANAS)</div>
              <p className="text-[10px] text-slate-500">24/7 Free & Confidential</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-rose-200 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">KIRAN Mental Health</span>
              <div className="text-sm font-extrabold text-rose-700 font-mono">1800-599-0019</div>
              <p className="text-[10px] text-slate-500">Government Support Care</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-rose-200 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Emergency Services</span>
              <div className="text-sm font-extrabold text-rose-700 font-mono">112</div>
              <p className="text-[10px] text-slate-500">Immediate Response</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Key Insights Grid (5 Core Modules) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sentiment Analysis */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1. Sentiment Tone</span>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold ${
              result.sentimentLabel === 'POSITIVE' ? 'text-emerald-600' :
              result.sentimentLabel === 'NEGATIVE' ? 'text-rose-600' : 'text-slate-700'
            }`}>
              {result.sentimentLabel}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
              {Math.round(Number(result.sentimentConfidence) * 100)}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">NLP emotional polarity</p>
        </div>

        {/* Emotion Detection */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">2. Dominant Emotion</span>
          <div className="text-lg font-bold text-teal-700">
            {result.dominantEmotion}
          </div>
          <p className="text-[11px] text-slate-500">Primary detected state</p>
        </div>

        {/* Mood Analysis */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">3. Mood Evaluation</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">{result.aiInferredMood}/5</span>
            <span className="text-xs text-slate-500">(Self: {result.selfReportedMood}/5)</span>
          </div>
          <p className="text-[11px] text-slate-500">AI-inferred emotional balance</p>
        </div>

        {/* Risk / Distress Classification */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">4. Distress Level</span>
          <div className={`text-base font-bold ${
            result.riskLevel === 'IMMEDIATE_SAFETY_CONCERN' ? 'text-rose-600' :
            result.riskLevel === 'SIGNIFICANT_CONCERN' ? 'text-amber-600' :
            result.riskLevel === 'MODERATE_CONCERN' ? 'text-sky-600' : 'text-teal-600'
          }`}>
            {result.riskLevel.replace(/_/g, ' ')}
          </div>
          <p className="text-[11px] text-slate-500">Deterministic clinical safety</p>
        </div>
      </div>

      {/* Emotion Spectrum Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Emotion Spectrum Distribution</h3>
        <p className="text-xs text-slate-500">Confidence scores across the 9 validated affective emotional dimensions</p>
        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={emotionChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={10} tickLine={false} />
              <Tooltip
                formatter={(val) => [`${val}%`, 'Intensity']}
                contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {emotionChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === result.dominantEmotion ? '#0D9488' : '#94A3B8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Probable Condition Screening (5th Module) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-sm">5. Probable Mental Health Condition Screening</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {probableConditions.map((cond: any, idx: number) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-xs">{cond.condition_name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  cond.severity_indicator === 'Severe' ? 'bg-rose-100 text-rose-800' :
                  cond.severity_indicator === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                  cond.severity_indicator === 'Mild' ? 'bg-sky-100 text-sky-800' : 'bg-teal-100 text-teal-800'
                }`}>
                  {cond.severity_indicator} Indicator
                </span>
              </div>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                {(cond.symptom_indicators || []).map((s: string, sIdx: number) => (
                  <li key={sIdx}>{s}</li>
                ))}
              </ul>
              <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200/60 leading-tight">
                {cond.clinical_disclaimer}
              </p>
            </div>
          ))}
        </div>

        {/* Clinical Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important Clinical Disclaimer:</strong> {result.clinicalDisclaimer}
          </p>
        </div>
      </div>

      {/* Recommended Next Steps & Action Pathways */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <h3 className="font-bold text-slate-900 text-base">Personalized Care Recommendations</h3>

        <div className="space-y-2.5">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
              <span>{rec}</span>
            </div>
          ))}
        </div>

        {/* Workflow Routing Actions */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-4 items-center">
          {isWorkflowB || isImmediateCrisis ? (
            <Link
              to="/doctors"
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Browse Specialists & Book Appointment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/cbt-exercises"
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <BookOpenCheck className="w-4 h-4" />
                <span>Start Recommended CBT Exercises</span>
              </Link>
              <Link
                to="/mood-tracker"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <Smile className="w-4 h-4 text-teal-600" />
                <span>Log Daily Mood</span>
              </Link>
              <Link
                to="/chatbot"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <MessageSquareCode className="w-4 h-4 text-teal-600" />
                <span>Talk with AI Companion</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
