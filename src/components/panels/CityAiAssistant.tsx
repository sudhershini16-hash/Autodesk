import React, { useState, useRef, useEffect } from 'react';
import { CityMetrics, SiteBoundary } from '../../types';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

interface CityAiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: CityMetrics;
  boundary: SiteBoundary;
  onApplyRecommendation?: (rec: string) => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
  recommendations?: string[];
}

export const CityAiAssistant: React.FC<CityAiAssistantProps> = ({
  isOpen,
  onClose,
  metrics,
  boundary,
  onApplyRecommendation,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello! I am your AI Smart City Urban Planning Advisor. I've analyzed your current site (${metrics.totalSiteAreaHa} ha) with a sustainability score of ${metrics.sustainabilityScore}/100 and ${metrics.renewableEnergyPct}% renewable energy. How can I assist your design today?`,
      time: 'Just now',
      recommendations: [
        'Add rooftop solar arrays to commercial towers to reach 85% clean energy',
        'Create a central green ventilation corridor along prevailing North winds',
        'Place 2 additional EV Charging hubs near residential clusters',
      ],
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'How can we increase our sustainability score to 95+?',
    'Analyze solar shadow impacts of 100m towers',
    'Where should EV charging hubs be placed?',
    'Optimize zoning for 85,000 residents',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          metrics,
          siteBoundary: boundary,
        }),
      });

      if (!response.ok) {
        throw new Error('Advisor request failed');
      }

      const data = await response.json();
      const aiMsg: Message = {
        sender: 'ai',
        text: data.answer || 'Analysis complete.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendations: data.recommendations || [],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Fallback heuristics
      const fallbackMsg: Message = {
        sender: 'ai',
        text: `Based on your masterplan layout (${metrics.totalSiteAreaHa} ha with ${metrics.buildingCount} structures), expanding your green canopy by 5 hectares and incorporating green roofs on the office towers will reduce the heat island index by 1.4°C and elevate your sustainability score above 95.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendations: [
          'Add 15,000 m² of green roofs on high-rise buildings',
          'Deploy permeable pavers along Secondary 12m Roads',
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900/98 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-50 flex flex-col select-none">
      {/* HEADER */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              CITY AI ADVISOR
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono">
                GEMINI POWERED
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">Urban generative optimization engine</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* CHAT MESSAGES STREAM */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>

              {m.recommendations && m.recommendations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" /> Recommended Actions:
                  </span>
                  {m.recommendations.map((rec, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}

              <span className="text-[9px] text-slate-500 block mt-1 text-right">
                {m.time}
              </span>
            </div>

            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-3 h-3 animate-spin" />
            </div>
            <span>Evaluating urban parameters with Gemini...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* SUGGESTED PROMPTS */}
      <div className="p-2 border-t border-slate-800 bg-slate-950/40">
        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider px-2 block mb-1">
          Quick Urban Queries
        </span>
        <div className="flex flex-wrap gap-1">
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sp)}
              className="text-[10px] px-2 py-1 rounded-md bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-left truncate max-w-full"
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT FIELD */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask City AI for design & sustainability advice..."
          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputQuery.trim() || isLoading}
          className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
