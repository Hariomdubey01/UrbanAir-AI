'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, Send, MapPin, RefreshCw, HelpCircle, BookOpen, ShieldCheck } from 'lucide-react';
import { ChatMessage, NormalizedAirQuality, AIResponseData } from '@/lib/types';
import AIResponseCard from '@/components/AIResponseCard';
import ExplainabilityModal from '@/components/ExplainabilityModal';
import SearchModal from '@/components/SearchModal';
import { POPULAR_CITIES } from '@/lib/air-quality/open-meteo';
import { formatTimeString } from '@/lib/formatTime';

function AIAdvisorContent() {
  const searchParams = useSearchParams();
  const initialCityName = searchParams.get('city') || 'Delhi';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCity, setSelectedCity] = useState(
    POPULAR_CITIES.find(c => c.name.toLowerCase() === initialCityName.toLowerCase()) || POPULAR_CITIES[0]
  );
  const [conversationCityName, setConversationCityName] = useState<string>(selectedCity.name);
  const [airQuality, setAirQuality] = useState<NormalizedAirQuality | null>(null);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeExplain, setActiveExplain] = useState<AIResponseData | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am UrbanAir AI, your contextual environmental intelligence assistant. 

I am currently connected to live air telemetry for **${selectedCity.name}, ${selectedCity.country}**. Ask me anything about current AQI conditions, PM2.5 levels, pollutant health thresholds, or how clean air supports Sustainable Cities and Communities (SDG 11).`,
      timestamp: '07:40 PM',
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = useCallback(async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query || query.trim().length === 0 || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const nowFormatted = formatTimeString(new Date());
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: query.trim(),
      timestamp: nowFormatted,
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query.trim(),
          airQuality: airQuality,
          locationName: selectedCity.name,
          conversationLocationName: conversationCityName,
        }),
      });

      const data: any = await res.json();

      if (!res.ok || !data || !data.success || typeof data.answer !== 'string') {
        const errorText = data?.error || 'Unable to reach the environmental intelligence engine right now. Please try again.';
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: errorText,
          timestamp: formatTimeString(new Date()),
        };
        setMessages(prev => [...prev, errorMsg]);
        return;
      }

      // If location context changed, maintain follow-up city memory
      if (data.explainability?.locationUsed) {
        const matchedCity = POPULAR_CITIES.find(c =>
          data.explainability.locationUsed.toLowerCase().includes(c.name.toLowerCase())
        );
        if (matchedCity) {
          setConversationCityName(matchedCity.name);
        }
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        timestamp: formatTimeString(new Date()),
        aiResponse: data,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Unable to reach the environmental intelligence engine right now. Please try again.',
        timestamp: formatTimeString(new Date()),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [inputQuery, loading, airQuality, selectedCity.name, conversationCityName]);


  useEffect(() => {
    async function loadCityAQ() {
      try {
        const res = await fetch(`/api/air-quality/current?lat=${selectedCity.lat}&lng=${selectedCity.lng}&name=${encodeURIComponent(selectedCity.name)}&country=${encodeURIComponent(selectedCity.country)}`);
        const json = await res.json();
        if (json.success) {
          setAirQuality(json.data);
          setConversationCityName(selectedCity.name);
        }
      } catch (e) {}
    }
    loadCityAQ();
  }, [selectedCity]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim() !== '') {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, handleSendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const suggestedQuestions = [

    { cat: 'Current Conditions', q: `What is the current AQI of ${selectedCity.name}?` },
    { cat: 'Pollutants', q: `Explain PM2.5 in ${selectedCity.name} simply.` },
    { cat: 'Comparison', q: `Compare ${selectedCity.name} and Tokyo` },
    { cat: 'Sustainability', q: 'How does air quality contribute to SDG 11 Sustainable Cities?' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-entrance">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Interactive AI Advisor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">Ask UrbanAir AI</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Grounded environmental explanations, WHO guideline citations, and SDG 11 awareness.</p>
        </div>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold border border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-white/20 transition-all shadow-sm"
        >
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Active Context: <strong>{conversationCityName || selectedCity.name}</strong></span>
        </button>
      </div>

      {/* Suggested Inquiries */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Suggested Inquiries:</div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {suggestedQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sq.q)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/40 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
              <span>{sq.q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="min-h-[440px] rounded-2xl glass-card p-5 sm:p-7 space-y-6 flex flex-col justify-between shadow-card">
        <div className="space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mb-1 px-1 font-mono">
                <span>{msg.role === 'user' ? 'You' : 'UrbanAir AI'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {msg.role === 'user' ? (
                <div className="max-w-xl p-3.5 px-4 rounded-xl bg-emerald-500 text-[#090d16] font-bold text-xs sm:text-sm shadow-sm">
                  {msg.content}
                </div>
              ) : msg.aiResponse ? (
                <div className="w-full max-w-3xl">
                  <AIResponseCard
                    data={msg.aiResponse}
                    onOpenExplainability={() => setActiveExplain(msg.aiResponse || null)}
                  />
                </div>
              ) : (
                <div className="max-w-2xl p-5 sm:p-6 rounded-2xl glass-card border border-slate-200 dark:border-white/10 dark:border-t-white/15 border-l-4 border-l-emerald-500 dark:border-l-emerald-400 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed font-normal space-y-2 shadow-sm">
                  {msg.content.split('\n\n').map((paragraph, pIdx) => {
                    const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={pIdx}>
                        {parts.map((part, idx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={idx} className="font-semibold text-slate-900 dark:text-white">
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-semibold animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500 dark:text-indigo-400" />
              <span>Resolving location context, fetching verified telemetry, and formulating insight...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              placeholder={`Ask about AQI, PM2.5 in ${conversationCityName}, WHO guidelines, or compare cities...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />

            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-5 py-3 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-[#090d16] font-bold text-xs sm:text-sm transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)] active:scale-95"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectCity={(c) => {
          setSelectedCity(c);
          setConversationCityName(c.name);
        }}
      />

      {activeExplain && (
        <ExplainabilityModal
          isOpen={!!activeExplain}
          onClose={() => setActiveExplain(null)}
          explainability={activeExplain.explainability}
          limitations={activeExplain.limitations}
          dataUsed={activeExplain.dataUsed}
          sources={activeExplain.sources}
          aiTask={activeExplain.aiTask}
          isFallback={activeExplain.isFallback}
          dataSource={activeExplain.dataTrust?.source || activeExplain.explainability?.dataSource}
          aqiStandard={activeExplain.dataTrust?.aqiStandard || activeExplain.explainability?.aqiStandard}
          aiMode={activeExplain.explainability?.aiMode}
        />
      )}
    </div>
  );
}

export default function AIAdvisorPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-muted text-xs">Loading AI Advisor workspace...</div>}>
      <AIAdvisorContent />
    </Suspense>
  );
}

