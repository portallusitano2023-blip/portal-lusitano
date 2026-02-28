import Image from "next/image";
import { Scale, BarChart3, Euro, ChevronRight, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { PROFILE_LABELS, SUBPROFILE_LABELS } from "./data";

interface IntroSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: Record<string, any>;
  hasDraft: boolean;
  draftDate: string;
  profileContext: { profile: string; subProfile: string | null; priceRange: string } | null;
  onStart: () => void;
  onRestoreDraft: () => void;
  onDiscardDraft: () => void;
  onDismissProfile: () => void;
}

export default function IntroSection({
  t,
  hasDraft,
  draftDate,
  profileContext,
  onStart,
  onRestoreDraft,
  onDiscardDraft,
  onDismissProfile,
}: IntroSectionProps) {
  const comp = t.comparador as Record<string, string>;
  const { language } = useLanguage();
  const tr = createTranslator(language);

  return (
    <div className="animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?q=80&w=1920"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
            style={{ objectPosition: "center 40%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-black/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span
            className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium uppercase tracking-[0.2em] rounded-full mb-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.2s" }}
          >
            {comp.badge}
          </span>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-[var(--foreground)] mb-6 leading-tight opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.3s" }}
          >
            {comp.title_prefix}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-2">
              {comp.title_accent}
            </span>
          </h1>

          <p
            className="text-lg text-[var(--foreground-secondary)] max-w-2xl mx-auto mb-4 font-serif italic opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.2s" }}
          >
            &ldquo;{comp.intro_quote}&rdquo;
          </p>

          <p
            className="text-sm text-[var(--foreground-muted)] max-w-xl mx-auto mb-10 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: "0.25s" }}
          >
            {comp.intro_desc}
          </p>

          <button
            onClick={onStart}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-400 hover:to-blue-500 transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: "0.3s" }}
          >
            <Scale size={20} />
            {comp.start_btn}
            <ChevronRight size={18} />
          </button>

          {/* Banner draft guardado */}
          {hasDraft && (
            <div
              className="mt-6 flex flex-col sm:flex-row items-center gap-3 px-5 py-4 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-xl max-w-sm mx-auto opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
              style={{ animationDelay: "0.35s" }}
            >
              <p className="text-xs text-[var(--gold)] flex-1 text-center sm:text-left">
                {tr(
                  `Tem uma comparação guardada de ${draftDate}`,
                  `You have a saved comparison from ${draftDate}`,
                  `Tiene una comparación guardada del ${draftDate}`
                )}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onRestoreDraft}
                  className="px-3 py-1.5 bg-[var(--gold)] text-black text-xs font-bold rounded-lg hover:bg-[#D4B068] transition-colors"
                >
                  {tr("Continuar", "Continue", "Continuar")}
                </button>
                <button
                  onClick={onDiscardDraft}
                  className="px-3 py-1.5 bg-transparent border border-[var(--gold)]/40 text-[var(--gold)] text-xs rounded-lg hover:bg-[var(--gold)]/10 transition-colors"
                >
                  {tr("Descartar", "Discard", "Descartar")}
                </button>
              </div>
            </div>
          )}

          {/* Banner de boas-vindas — vindo da Análise de Perfil */}
          {profileContext && (
            <div
              className="mt-4 flex items-start gap-3 px-5 py-4 bg-gradient-to-r from-[var(--gold)]/15 to-[var(--gold)]/5 border border-[var(--gold)]/40 rounded-xl max-w-sm mx-auto opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
              style={{ animationDelay: "0.4s" }}
            >
              <Sparkles size={16} className="text-[var(--gold)] shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--gold)] flex-1 leading-relaxed text-left">
                <strong>
                  {tr("Bem-vindo", "Welcome", "Bienvenido")},{" "}
                  {PROFILE_LABELS[profileContext.profile] ?? profileContext.profile}
                  {profileContext.subProfile
                    ? ` — ${SUBPROFILE_LABELS[profileContext.subProfile] ?? profileContext.subProfile}`
                    : ""}
                </strong>
                <span className="text-[var(--gold)]/70">
                  {" "}
                  · {tr("Orçamento sugerido", "Suggested budget", "Presupuesto sugerido")}:{" "}
                  <strong>{profileContext.priceRange}</strong>
                </span>
              </p>
              <button
                onClick={onDismissProfile}
                className="text-[var(--gold)]/50 hover:text-[var(--gold)] transition-colors shrink-0"
                aria-label="Fechar"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className="grid md:grid-cols-3 gap-6 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: "0.35s" }}
          >
            <div className="p-6 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-blue-400" size={24} />
              </div>
              <h3 className="text-lg font-serif text-[var(--foreground)] mb-2">
                {comp.feat_radar}
              </h3>
              <p className="text-sm text-[var(--foreground-secondary)]">{comp.feat_radar_desc}</p>
            </div>

            <div className="p-6 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <Scale className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-lg font-serif text-[var(--foreground)] mb-2">
                {comp.feat_table}
              </h3>
              <p className="text-sm text-[var(--foreground-secondary)]">{comp.feat_table_desc}</p>
            </div>

            <div className="p-6 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                <Euro className="text-amber-400" size={24} />
              </div>
              <h3 className="text-lg font-serif text-[var(--foreground)] mb-2">
                {comp.feat_value}
              </h3>
              <p className="text-sm text-[var(--foreground-secondary)]">{comp.feat_value_desc}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
