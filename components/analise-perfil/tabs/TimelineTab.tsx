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
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-6">
          <Calendar className="text-[var(--gold)]" size={20} />
          {t.analise_perfil.recommended_timeline}
        </h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--gold)]/20" />
          <div className="space-y-6">
            {result.timeline.map((item, i) => (
              <div
                key={i}
                className="relative pl-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="absolute left-0 w-8 h-8 bg-[var(--gold)] text-black rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <div className="bg-[var(--background-card)]/30 border border-[var(--border)] p-4">
                  <div className="text-[var(--gold)] text-xs uppercase tracking-wider mb-1">
                    {item.month}
                  </div>
                  <h4 className="text-[var(--foreground)] font-medium mb-2">{item.title}</h4>
                  <p className="text-sm text-[var(--foreground-secondary)]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Quotes */}
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-6">
          <Quote className="text-[var(--gold)]" size={20} />
          {t.analise_perfil.expert_words}
        </h3>
        <div className="space-y-4">
          {result.quotes.map((q, i) => (
            <div
              key={i}
              className="bg-[var(--background-card)]/30 border-l-2 border-[var(--gold)] p-5 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <p className="text-[var(--foreground-secondary)] italic mb-3">
                &ldquo;{q.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[var(--gold)]/10 rounded-full flex items-center justify-center">
                  <Quote className="text-[var(--gold)]" size={14} />
                </div>
                <div>
                  <p className="text-[var(--foreground)] text-sm font-medium">{q.author}</p>
                  <p className="text-[var(--foreground-muted)] text-xs">{q.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* FAQ */}
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-6">
          <HelpCircle className="text-[var(--gold)]" size={20} />
          {t.analise_perfil.faq}
        </h3>
        <div className="space-y-3">
          {result.faq.map((item, i) => (
            <div
              key={i}
              className="border border-[var(--border)] overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 bg-[var(--background-card)]/30 hover:bg-[var(--background-card)]/50 transition-colors text-left"
              >
                <span className="text-[var(--foreground)] font-medium pr-4">{item.question}</span>
                <ChevronDown
                  className={`text-[var(--gold)] flex-shrink-0 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`}
                  size={18}
                />
              </button>
              {expandedFaq === i && (
                <div className="animate-[fadeSlideIn_0.2s_ease-out_forwards]">
                  <div className="p-4 bg-[var(--background-secondary)]/50 text-[var(--foreground-secondary)] text-sm">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
