import React from 'react';
import { Brain, FileQuestion, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">Methodology</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">How MindBridge Evaluates Well-Being</h1>
        <p className="text-slate-600 text-base max-w-2xl mx-auto">
          A blend of validated screening questionnaires and natural language processing.
        </p>
      </div>

      <div className="space-y-8">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">1</div>
            <h3 className="font-bold text-slate-900 text-base">Standardized Psychological Screening Indicators</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed pl-11">
            MindBridge incorporates validated screening dimensions from widely used clinical instruments (such as PHQ-9 for mood and affect, and GAD-7 for anxiety indicators). Questions evaluate frequency of symptoms over the preceding two weeks on a 4-point Likert scale.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">2</div>
            <h3 className="font-bold text-slate-900 text-base">Five Core AI Assessment Engines</h3>
          </div>
          <div className="text-xs text-slate-600 leading-relaxed pl-11 space-y-2">
            <p>Our dedicated Python microservice runs five specialized modules:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Sentiment Analysis:</strong> Evaluates overall emotional tone as Positive, Negative, or Neutral with confidence metrics.</li>
              <li><strong>Emotion Detection:</strong> Identifies 9 distinct affective states: Happiness, Sadness, Anger, Fear, Anxiety, Frustration, Loneliness, Hope, and Neutral.</li>
              <li><strong>Mood Analysis:</strong> Synthesizes self-reported and AI-inferred mood states on a 1–5 scale.</li>
              <li><strong>Distress & Risk Assessment:</strong> Evaluates symptom clusters and safety indicators deterministically.</li>
              <li><strong>Probable Condition Screening:</strong> Identifies symptom patterns associated with depression, anxiety, stress, or sleep difficulty without diagnosing.</li>
            </ul>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">3</div>
            <h3 className="font-bold text-slate-900 text-base">Care Routing & Safety Triage</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed pl-11">
            Depending on your risk level, the platform directs you to either <strong>Workflow A</strong> (supportive self-help CBT and daily tracking) or <strong>Workflow B</strong> (recommendation to select a verified doctor and schedule a consultation). Immediate safety alerts bypass automated routines to connect users directly with human crisis helplines.
          </p>
        </div>
      </div>
    </div>
  );
};
