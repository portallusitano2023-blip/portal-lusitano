"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { faqData, type FAQItem } from "@/data/faqData";
import { CONTACT_EMAIL } from "@/lib/constants";

function FAQAccordion({
  item,
  isOpen,
  onClick,
}: {
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors pr-8">
          {item.question}
        </span>
        <div
          className="flex-shrink-0 transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown
            className={`${isOpen ? "text-[var(--gold)]" : "text-[var(--foreground-muted)]"} transition-colors`}
            size={20}
          />
        </div>
      </button>

      <div
        className="grid transition-all duration-200"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pb-6 text-[var(--foreground-secondary)] leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { language } = useLanguage();
  const faqs = faqData[language];

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="text-[var(--gold)]" size={32} />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] block mb-4">
            {language === "pt" ? "Suporte" : "Support"}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">
            {language === "pt" ? "Perguntas Frequentes" : "Frequently Asked Questions"}
          </h1>
          <p className="text-[var(--foreground-secondary)] font-serif italic">
            {language === "pt"
              ? "Encontre respostas as duvidas mais comuns"
              : "Find answers to the most common questions"}
          </p>
        </div>

        {/* FAQ List */}
        <div
          className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.1s" }}
        >
          {faqs.map((faq, index) => (
            <FAQAccordion
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <div
          className="mt-16 text-center p-8 bg-[var(--surface-hover)] border border-[var(--border)] opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.2s" }}
        >
          <p className="text-[var(--foreground-secondary)] mb-4">
            {language === "pt"
              ? "Nao encontrou o que procurava?"
              : "Didn't find what you were looking for?"}
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-block text-[var(--gold)] hover:text-[var(--foreground)] transition-colors text-sm uppercase tracking-widest"
          >
            {language === "pt" ? "Contacte-nos" : "Contact us"} →
          </a>
        </div>
      </div>
    </main>
  );
}
