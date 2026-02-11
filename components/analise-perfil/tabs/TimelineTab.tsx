"use client";

import { useState } from "react";
import { Calendar, Quote, HelpCircle, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Result } from "@/components/analise-perfil/types";

interface TimelineTabProps {
  result: Result;
}

export default function TimelineTab({ result }: TimelineTabProps) {
  const { t } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div key="cronograma" className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      {/* Timeline */}
      <div className="bg-zinc-900/30 border border-white/5 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6">
          <Calendar className="text-[#C5A059]" size={20} />
          {t.analise_perfil.recommended_timeline}
        </h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#C5A059]/20" />
          <div className="space-y-6">
            {result.timeline.map((item, i) => (
              <div
                key={i}
                className="relative pl-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="absolute left-0 w-8 h-8 bg-[#C5A059] text-black rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <div className="bg-zinc-800/30 border border-white/5 p-4">
                  <div className="text-[#C5A059] text-xs uppercase tracking-wider mb-1">
                    {item.month}
                  </div>
                  <h4 className="text-white font-medium mb-2">{item.title}</h4>
                  <p className="text-sm text-zinc-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Quotes */}
      <div className="bg-zinc-900/30 border border-white/5 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6">
          <Quote className="text-[#C5A059]" size={20} />
          {t.analise_perfil.expert_words}
        </h3>
        <div className="space-y-4">
          {result.quotes.map((q, i) => (
            <div
              key={i}
              className="bg-zinc-800/30 border-l-2 border-[#C5A059] p-5 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <p className="text-zinc-300 italic mb-3">&ldquo;{q.quote}&rdquo;</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#C5A059]/10 rounded-full flex items-center justify-center">
                  <Quote className="text-[#C5A059]" size={14} />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{q.author}</p>
                  <p className="text-zinc-500 text-xs">{q.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* FAQ */}
      <div className="bg-zinc-900/30 border border-white/5 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6">
          <HelpCircle className="text-[#C5A059]" size={20} />
          {t.analise_perfil.faq}
        </h3>
        <div className="space-y-3">
          {result.faq.map((item, i) => (
            <div
              key={i}
              className="border border-white/5 overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors text-left"
              >
                <span className="text-white font-medium pr-4">{item.question}</span>
                <ChevronDown
                  className={`text-[#C5A059] flex-shrink-0 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`}
                  size={18}
                />
              </button>
              {expandedFaq === i && (
                <div className="animate-[fadeSlideIn_0.2s_ease-out_forwards]">
                  <div className="p-4 bg-zinc-900/50 text-zinc-400 text-sm">{item.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
