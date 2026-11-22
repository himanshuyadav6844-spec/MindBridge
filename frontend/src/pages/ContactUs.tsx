import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactUs: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900">Get in Touch with MindBridge</h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Have questions about our platform, doctor registration, or institutional partnerships? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Email Support</h4>
              <p className="text-xs text-slate-500">support@mindbridge.local</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Crisis Helplines (24/7)</h4>
              <p className="text-xs text-slate-500">Tele-MANAS: 14416 | KIRAN: 1800-599-0019</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Healthcare Operations</h4>
              <p className="text-xs text-slate-500">MindBridge Health Technologies, New Delhi, India</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
              <h4 className="font-bold text-slate-900 text-base">Message Received</h4>
              <p className="text-xs text-slate-600">Thank you for reaching out. A representative will respond within 24 business hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                <input required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Email</label>
                <input type="email" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message</label>
                <textarea rows={4} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 outline-none" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
