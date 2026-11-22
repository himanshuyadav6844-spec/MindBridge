import React from 'react';
import { HeartHandshake, ShieldCheck, Award, Users } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">About MindBridge</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Democratizing Safe, Empathetic Mental Health Support</h1>
        <p className="text-slate-600 text-base max-w-2xl mx-auto">
          Built on clinical rigor, transparent machine learning, and compassionate patient advocacy.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-6">
        <p>
          MindBridge was conceived to address a critical healthcare gap: millions experience emotional distress, anxiety, and depression symptoms, yet hesitate to seek help due to stigma, lack of self-awareness, or difficulties finding qualified professionals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <HeartHandshake className="w-6 h-6 text-teal-600 mb-2" />
            <h3 className="font-bold text-slate-900 text-sm mb-1">Supportive, Not Diagnostic</h3>
            <p className="text-xs text-slate-500">MindBridge provides supportive preliminary screening. We never replace the essential medical judgment of a human clinician.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-teal-600 mb-2" />
            <h3 className="font-bold text-slate-900 text-sm mb-1">Safety-First Guardrails</h3>
            <p className="text-xs text-slate-500">Immediate safety concerns deterministically trigger crisis resources and emergency guidance, never leaving users stranded with a chatbot.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <Award className="w-6 h-6 text-teal-600 mb-2" />
            <h3 className="font-bold text-slate-900 text-sm mb-1">Evidence-Informed CBT</h3>
            <p className="text-xs text-slate-500">Our exercises are anchored in validated Cognitive Behavioral Therapy methods developed to help challenge cognitive distortions.</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 pt-4">Data Privacy and Ethical Principles</h2>
        <p>
          MindBridge adheres to Indian Digital Personal Data Protection principles and global healthcare privacy standards. Sensitive patient assessments and clinical notes are private to the patient and their authorized treating professional. Administrative oversight does not expose personal psychiatric reflections.
        </p>
      </div>
    </div>
  );
};
