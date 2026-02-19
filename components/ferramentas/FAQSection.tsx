"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { useLanguage } from "@/context/LanguageContext";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onClick: () => void;
}

function FAQAccordion({ item, index, isOpen, onClick }: FAQAccordionProps) {
  const answerId = `faq-answer-${index}`;
  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
        aria-controls={answerId}
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
        id={answerId}
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

interface FAQSectionProps {
  items: FAQItem[];
}

export default function FAQSection({ items }: FAQSectionProps) {
  const { t } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <section className="px-6 pb-32" id="faq">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <AnimateOnScroll className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] block mb-4">
            {t.ferramentas.faq_badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-4">
            {t.ferramentas.faq_title}
          </h2>
          <p className="text-[var(--foreground-secondary)] max-w-lg mx-auto">
            {t.ferramentas.faq_subtitle}
          </p>
        </AnimateOnScroll>

        {/* FAQ items */}
        <div>
          {items.map((item, index) => (
            <FAQAccordion
              key={index}
              item={item}
              index={index}
              isOpen={openFAQ === index}
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl">
          <p className="text-[var(--foreground-secondary)] mb-4 text-sm">
            {t.ferramentas.faq_not_found}
          </p>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-[var(--gold)] text-sm font-medium hover:underline"
          >
            {t.ferramentas.faq_see_all}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
