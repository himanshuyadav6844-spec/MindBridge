import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Shield, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">Mind<span className="text-teal-400">Bridge</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering emotional well-being through safe AI preliminary screening, evidence-informed CBT exercises, and seamless access to certified mental health professionals.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-teal-400 transition-colors">About the Project</Link></li>
              <li><Link to="/how-it-works" className="hover:text-teal-400 transition-colors">How Screening Works</Link></li>
              <li><Link to="/doctors" className="hover:text-teal-400 transition-colors">Verified Doctors</Link></li>
              <li><Link to="/assessment" className="hover:text-teal-400 transition-colors">Start Assessment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Support & Crisis Resources</h4>
            <ul className="space-y-2 text-xs">
              <li>Tele-MANAS: <span className="text-teal-300 font-mono">14416</span> (24/7)</li>
              <li>KIRAN Helpline: <span className="text-teal-300 font-mono">1800-599-0019</span></li>
              <li>Emergency Services: <span className="text-teal-300 font-mono">112</span></li>
              <li><Link to="/contact" className="hover:text-teal-400 transition-colors">Support Desk</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Clinical & Safety Notice</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              MindBridge provides supportive preliminary screening and wellness exercises. It does not provide medical diagnoses or replace licensed clinical judgment.
            </p>
            <div className="mt-3">
              <Link to="/privacy" className="text-xs text-teal-400 hover:underline">Privacy Policy & Patient Consent</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <div>© {new Date().getFullYear()} MindBridge Health. All rights reserved.</div>
          <div className="mt-2 md:mt-0 flex gap-4">
            <Link to="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-400">Terms of Use</Link>
            <Link to="/contact" className="hover:text-slate-400">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
