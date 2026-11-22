import React, { useEffect, useState, useRef } from 'react';
import { ChatMessage, ChatbotConversation } from '../types';
import api from '../services/api';
import {
  MessageSquareHeart,
  Send,
  Sparkles,
  PhoneCall,
  Trash2,
  AlertTriangle,
  BookOpen,
  ShieldCheck,
  User,
  Bot
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ChatbotPage: React.FC = () => {
  const [conversations, setConversations] = useState<ChatbotConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
    }
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res: any = await api.get('/chatbot/conversations');
      const convList: ChatbotConversation[] = (res.data?.data !== undefined ? res.data.data : res.data) || [];
      setConversations(convList);
      if (convList.length > 0 && !activeConvId) {
        setActiveConvId(convList[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const res: any = await api.get(`/chatbot/conversations/${convId}/messages`);
      const msgList = (res.data?.data !== undefined ? res.data.data : res.data) || [];
      setMessages(msgList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const userText = inputText.trim();
    setInputText('');
    setSending(true);

    // Optimistic user message render
    const optimisticMsg: ChatMessage = {
      id: 'opt-' + Date.now(),
      senderType: 'USER',
      messageText: userText,
      containsCrisisAlert: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res: any = await api.post('/chatbot/messages', {
        conversationId: activeConvId,
        message: userText,
      });

      const botReply = res.data?.data !== undefined ? res.data.data : res.data;
      if (botReply.crisisAlert) {
        setShowCrisisModal(true);
      }

      // If this was a new conversation, update active id
      if (!activeConvId && botReply.conversationId) {
        setActiveConvId(botReply.conversationId);
        fetchConversations();
      }

      setMessages((prev) => [
        ...prev,
        {
          id: botReply.messageId,
          senderType: 'BOT',
          messageText: botReply.messageText,
          containsCrisisAlert: botReply.crisisAlert,
          suggestedCbtSlug: botReply.suggestedCbtSlug,
          createdAt: botReply.createdAt,
        },
      ]);
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (!activeConvId) return;
    if (!window.confirm('Are you sure you want to delete this chat session?')) return;
    try {
      await api.delete(`/chatbot/conversations/${activeConvId}`);
      setActiveConvId(null);
      setMessages([]);
      fetchConversations();
    } catch (err: any) {
      alert(err.message || 'Failed to delete chat');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-base">MindBridge AI Companion</h1>
            <p className="text-[11px] text-slate-500">Safe, empathetic reflection companion with crisis guardrails</p>
          </div>
        </div>

        {activeConvId && (
          <button
            onClick={handleDeleteConversation}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      {/* Safety & Non-Diagnostic Disclosure Banner */}
      <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-[11px] text-teal-900 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          MindBridge AI is an empathetic wellness companion, not a human doctor. We do not prescribe medication or diagnose medical conditions.
        </span>
        <button
          onClick={() => setShowCrisisModal(true)}
          className="text-teal-700 underline font-semibold shrink-0 ml-2"
        >
          Crisis Helplines
        </button>
      </div>

      {/* Chat Thread Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages scroll box */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
              <Bot className="w-12 h-12 text-teal-500/40" />
              <div className="max-w-sm">
                <h4 className="font-bold text-slate-800 text-sm">Hello! How are you feeling today?</h4>
                <p className="text-xs text-slate-500 mt-1">
                  You can tell me about recent challenges, share thoughts you'd like to reframe, or ask for a calming breathing prompt.
                </p>
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const isUser = m.senderType === 'USER';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                      AI
                    </div>
                  )}

                  <div className={`max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-teal-600 text-white rounded-br-xs'
                      : m.containsCrisisAlert
                      ? 'bg-rose-50 text-rose-950 border border-rose-300 rounded-bl-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                  }`}>
                    <p className="whitespace-pre-line">{m.messageText}</p>

                    {m.suggestedCbtSlug && (
                      <div className="pt-2">
                        <Link
                          to={`/cbt-exercises/${m.suggestedCbtSlug}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-teal-200 text-teal-800 font-semibold text-xs shadow-xs hover:bg-teal-50 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                          <span>Try Exercise: {m.suggestedCbtSlug.replace('-', ' ')}</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input box */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message or how you're feeling right now..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="p-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-40 transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Emergency Crisis Modal */}
      {showCrisisModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-rose-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <PhoneCall className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900">24/7 National Crisis Resources</h3>
                <p className="text-[11px] text-slate-500">Confidential, free emotional support services available immediately</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">Tele-MANAS (Govt of India)</div>
                  <div className="text-[10px] text-slate-500">24/7 Free in 20+ languages</div>
                </div>
                <a href="tel:14416" className="font-mono font-bold text-teal-700 text-sm bg-teal-50 px-2.5 py-1 rounded-lg">14416</a>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">KIRAN Mental Health</div>
                  <div className="text-[10px] text-slate-500">Disaster & psychological first aid</div>
                </div>
                <a href="tel:18005990019" className="font-mono font-bold text-teal-700 text-sm bg-teal-50 px-2.5 py-1 rounded-lg">1800-599-0019</a>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">National Emergency Number</div>
                  <div className="text-[10px] text-slate-500">Police, ambulance, urgent distress</div>
                </div>
                <a href="tel:112" className="font-mono font-bold text-rose-700 text-sm bg-rose-50 px-2.5 py-1 rounded-lg">112</a>
              </div>
            </div>

            <button
              onClick={() => setShowCrisisModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs"
            >
              Close Alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
