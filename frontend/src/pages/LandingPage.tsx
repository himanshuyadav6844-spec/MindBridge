import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  Brain,
  ShieldCheck,
  Stethoscope,
  Smile,
  Activity,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  Compass,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-slate-50 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Empathetic AI Preliminary Assessment & Clinical Care Pathway
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              A safe bridge between <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-sky-600">how you feel</span> and the care you deserve.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              MindBridge analyzes your mental wellness using emotion and sentiment AI, provides personalized CBT exercises for mild to moderate distress, and connects you seamlessly with verified psychologists and psychiatrists when deeper support is needed.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/assessment"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-teal-600 text-white font-semibold text-base shadow-lg shadow-teal-600/30 hover:bg-teal-700 hover:shadow-teal-600/40 transition-all group"
              >
                <span>Take Free Assessment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/doctors"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-base hover:bg-slate-50 hover:border-slate-400 transition-all"
              >
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <span>Find a Doctor</span>
              </Link>
            </div>

            <div className="pt-6 flex items-center justify-center gap-8 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-teal-600" /> Private & Confidential</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Validated Clinical Indicators</span>
              <span className="flex items-center gap-1.5"><HeartHandshake className="w-4 h-4 text-teal-600" /> RCI & Medical Board Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Main Workflows Section */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-teal-600 mb-2">Dual Care Pathways</h2>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Personalized Care Adapted to Your Needs</h3>
            <p className="mt-3 text-slate-600 text-sm">MindBridge triages your assessment into two clinical workflows with deterministic safety checks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Workflow A */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-teal-200 transition-all hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg mb-6">
                  A
                </div>
                <div className="inline-block px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-semibold mb-3 border border-teal-200">
                  Low to Moderate Concern
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Self-Guided Cognitive & Emotional Wellness</h4>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  When everyday stress, mild anxiety, or temporary low moods arise, MindBridge empowers you with self-regulation tools designed by clinical psychologists.
                </p>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                    <span><strong>9 Interactive CBT Exercises:</strong> Thought journals, cognitive restructuring, gratitude, and guided breathing.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                    <span><strong>Daily Mood & Somatic Tracker:</strong> Log emotional state, sleep quality, and stress levels with visual trend charts.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                    <span><strong>AI Wellness Companion:</strong> Supportive chat with real-time emotion recognition and positive psychology prompts.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200">
                <Link to="/cbt-exercises" className="text-teal-600 font-semibold text-sm flex items-center gap-1.5 hover:text-teal-700">
                  Explore CBT Exercises <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Workflow B */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-sky-200 transition-all hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg mb-6">
                  B
                </div>
                <div className="inline-block px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 text-xs font-semibold mb-3 border border-sky-200">
                  Significant Concern
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Clinical Consultation & Healthcare Pathway</h4>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  When symptoms indicate persistent distress, depression indicators, or significant daily impairment, MindBridge facilitates direct human medical care.
                </p>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                    <span><strong>Verified Practitioner Directory:</strong> Review qualifications, experience, and verified license details.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                    <span><strong>Direct Appointment Booking:</strong> Select available time slots with double-booking prevention.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                    <span><strong>Consultation Summaries:</strong> Receive clinical notes, doctor acknowledgement, and follow-up guidance.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200">
                <Link to="/doctors" className="text-sky-600 font-semibold text-sm flex items-center gap-1.5 hover:text-sky-700">
                  Browse Verified Specialists <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Urgent Human-Support Safety Pathway Banner */}
          <div className="mt-10 p-6 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">Immediate Safety & Crisis Helpline Support</h5>
                <p className="text-xs text-slate-600">If you are in acute distress or experiencing self-harm thoughts, please call Tele-MANAS at <span className="font-bold text-slate-900">14416</span> (Free, 24/7 across India) or Emergency Services at <span className="font-bold text-slate-900">112</span>.</p>
              </div>
            </div>
            <a
              href="tel:14416"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0 shadow-sm transition-all"
            >
              Call 14416 Now
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-teal-600 mb-2">Step-by-Step Experience</h2>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">How MindBridge Works</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-3xl font-extrabold text-teal-500/20 absolute top-4 right-4">01</span>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1.5 text-base">Complete Assessment</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Answer structured screening questions covering mood, sleep, anxiety, and daily functioning.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-3xl font-extrabold text-teal-500/20 absolute top-4 right-4">02</span>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1.5 text-base">AI Engine Analysis</h4>
              <p className="text-xs text-slate-600 leading-relaxed">FastAPI microservice evaluates sentiment, dominant emotion, mood trends, and risk level.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-3xl font-extrabold text-teal-500/20 absolute top-4 right-4">03</span>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1.5 text-base">Personalized Report</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Review emotional breakdowns and receive transparent recommendations tailored to your situation.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-3xl font-extrabold text-teal-500/20 absolute top-4 right-4">04</span>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1.5 text-base">Ongoing Care & Healing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Engage in daily CBT exercises, mood tracking, or consult directly with certified specialists.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-700 to-teal-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your emotional well-being is worth taking care of today.</h2>
          <p className="text-teal-100 text-base max-w-xl mx-auto leading-relaxed">
            Begin with a confidential assessment or consult with a verified mental health doctor.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-white text-teal-900 font-bold shadow-lg hover:bg-teal-50 transition-all"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
