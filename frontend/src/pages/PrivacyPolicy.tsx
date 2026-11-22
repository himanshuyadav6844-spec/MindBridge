import React from 'react';
import { Shield, Lock, FileText, CheckCircle } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy & Patient Consent</h1>
        <p className="text-xs text-slate-500">Effective Date: November 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs text-slate-700 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Commitment to Mental Health Confidentiality</h2>
          <p>
            MindBridge treats all mental health inquiries, assessment responses, mood logs, and CBT exercises as highly confidential personal health data. We adhere to the principles outlined under the Indian Digital Personal Data Protection Act (DPDPA) and international best practices for healthcare information security.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Information We Collect</h2>
          <p>
            When you register, we collect your name, email, optional date of birth, phone number, and gender. When you complete assessments or track your mood, we store questionnaire scores, optional qualitative reflections, and AI-inferred emotional metrics.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">3. Access Controls & Role Restrictions</h2>
          <p>
            Patients can only access their own private records. Treating doctors can only review assessment summaries for patients who have explicitly scheduled an appointment with them. System administrators have access to platform metrics and doctor credential reviews, but cannot view individual private mental health reflections.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">4. Right to Deletion</h2>
          <p>
            Patients can delete their chatbot conversations and mood logs at any time from within their personal account settings.
          </p>
        </section>
      </div>
    </div>
  );
};
