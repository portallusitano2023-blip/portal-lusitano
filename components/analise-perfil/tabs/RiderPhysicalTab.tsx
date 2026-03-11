"use client";

import { useState, useMemo } from "react";
import {
  Activity,
  Weight,
  Ruler,
  Minus,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Info,
  Shield,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import type { Result } from "@/components/analise-perfil/types";

interface RiderPhysicalTabProps {
  result: Result;
}

type NivelFitness = "sedentario" | "moderado" | "ativo" | "atleta";
type Experiencia = "iniciante" | "intermedio" | "avancado" | "profissional";

interface Warning {
  title: string;
  description: string;
  severity: "critical" | "warning" | "ok";
}

// Lusitanos típicos: 155–165cm
const LUSITANO_HEIGHT_MIN = 155;
const LUSITANO_HEIGHT_MAX = 165;

export default function RiderPhysicalTab({ result }: RiderPhysicalTabProps) {
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);

  const [peso, setPeso] = useState(70);
  const [altura, setAltura] = useState(170);
  const [fitness, setFitness] = useState<NivelFitness>("moderado");
  const [experiencia, setExperiencia] = useState<Experiencia>("intermedio");

  const warnings = useMemo((): Warning[] => {
    const list: Warning[] = [];
    const avgHorseHeight = (LUSITANO_HEIGHT_MIN + LUSITANO_HEIGHT_MAX) / 2; // 160cm

    // 1. Peso excessivo para cavalos lusitanos de porte típico
    if (peso > 100) {
      list.push({
        title: tr(
          "Peso elevado para cavalos Lusitanos de porte típico",
          "High weight for typical Lusitano build",
          "Peso elevado para Lusitanos de porte típico"
        ),
        description: tr(
          `Com ${peso}kg, recomenda-se cavalos com pelo menos 163cm de altura. Verifique a robustez e o estado físico do cavalo antes da compra.`,
          `At ${peso}kg, horses of at least 163cm are recommended. Check the horse's build and fitness before purchasing.`,
          `Con ${peso}kg, se recomiendan caballos de al menos 163cm. Verifique la robustez y estado físico del caballo antes de la compra.`
        ),
        severity: "warning",
      });
    } else if (peso > 90) {
      list.push({
        title: tr(
          "Peso acima da média",
          "Above-average weight",
          "Peso por encima de la media"
        ),
        description: tr(
          `Com ${peso}kg, prefira cavalos de 160cm ou mais. Cavalos com boa musculatura e conformação robusta são mais adequados.`,
          `At ${peso}kg, prefer horses of 160cm or more. Horses with good musculature and robust build are more suitable.`,
          `Con ${peso}kg, prefiera caballos de 160cm o más. Caballos con buena musculatura y conformación robusta son más adecuados.`
        ),
        severity: "warning",
      });
    }

    // 2. Cavaleiro muito alto em relação ao cavalo típico
    const ratio = altura / avgHorseHeight;
    if (ratio > 1.2) {
      list.push({
        title: tr(
          "Altura do cavaleiro elevada em relação ao Lusitano médio",
          "Rider height is high relative to the average Lusitano",
          "Altura del jinete elevada respecto al Lusitano medio"
        ),
        description: tr(
          `Com ${altura}cm de altura, o rácio com um Lusitano de ${Math.round(avgHorseHeight)}cm é ${ratio.toFixed(2)}. Prefira Lusitanos na parte superior da escala (162–165cm) ou de linha Interagro/Andrade com maior estatura.`,
          `At ${altura}cm tall, the ratio with a ${Math.round(avgHorseHeight)}cm Lusitano is ${ratio.toFixed(2)}. Prefer Lusitanos in the upper range (162–165cm) or of Interagro/Andrade lines with greater stature.`,
          `Con ${altura}cm de altura, el ratio con un Lusitano de ${Math.round(avgHorseHeight)}cm es ${ratio.toFixed(2)}. Prefiera Lusitanos en el rango superior (162–165cm) o de línea Interagro/Andrade con mayor estatura.`
        ),
        severity: "warning",
      });
    }

    // 3. Experiência vs. perfil de competição
    if (
      experiencia === "iniciante" &&
      (result.profile === "competidor" || result.profile === "tradicional")
    ) {
      list.push({
        title: tr(
          "Experiência insuficiente para o perfil de competição",
          "Insufficient experience for competition profile",
          "Experiencia insuficiente para el perfil de competición"
        ),
        description: tr(
          "O perfil detectado implica cavalos exigentes e de alta formação. Cavaleiros iniciantes devem consolidar pelo menos 2–3 anos de prática regular antes de adquirir um cavalo de competição.",
          "The detected profile implies demanding, highly trained horses. Beginner riders should consolidate at least 2–3 years of regular practice before acquiring a competition horse.",
          "El perfil detectado implica caballos exigentes y de alta formación. Jinetes principiantes deben consolidar al menos 2–3 años de práctica regular antes de adquirir un caballo de competición."
        ),
        severity: "critical",
      });
    }

    if (
      experiencia === "iniciante" &&
      result.profile === "criador"
    ) {
      list.push({
        title: tr(
          "Experiência limitada para gestão de reprodução",
          "Limited experience for breeding management",
          "Experiencia limitada para gestión de reproducción"
        ),
        description: tr(
          "A criação de PSL requer conhecimento avançado de genética, gestão reprodutiva e maneio de garanhões. Considere começar como observador numa coudelaria antes de criar o seu próprio programa.",
          "PSL breeding requires advanced knowledge of genetics, reproductive management and stallion handling. Consider starting as an observer at a stud farm before setting up your own programme.",
          "La cría de PSL requiere conocimientos avanzados de genética, gestión reproductiva y manejo de sementales. Considere comenzar como observador en una ganadería antes de establecer su propio programa."
        ),
        severity: "warning",
      });
    }

    // 4. Fitness vs. perfil exigente
    if (
      fitness === "sedentario" &&
      (result.profile === "competidor" || result.profile === "tradicional")
    ) {
      list.push({
        title: tr(
          "Condição física insuficiente para o perfil detectado",
          "Physical fitness insufficient for the detected profile",
          "Condición física insuficiente para el perfil detectado"
        ),
        description: tr(
          "Competição de dressage e equitação de trabalho exigem excelente equilíbrio, core strength e resistência cardiovascular. Inicie um programa de preparação física antes de iniciar treinos de alta exigência.",
          "Dressage competition and working equitation demand excellent balance, core strength and cardiovascular endurance. Start a physical preparation programme before undertaking high-demand training.",
          "La competición de dressage y la equitación de trabajo exigen excelente equilibrio, fuerza de core y resistencia cardiovascular. Inicie un programa de preparación física antes de iniciar entrenamientos de alta exigencia."
        ),
        severity: "warning",
      });
    }

    if (fitness === "sedentario" && result.profile === "amador") {
      list.push({
        title: tr(
          "Considere melhorar a condição física",
          "Consider improving physical fitness",
          "Considere mejorar la condición física"
        ),
        description: tr(
          "Mesmo para lazer e alta escola clássica, uma base mínima de condição física (caminhadas, pilates, yoga) melhora significativamente a qualidade da equitação e reduz o risco de lesões.",
          "Even for leisure and classical haute école, a minimum base of physical fitness (walking, pilates, yoga) significantly improves riding quality and reduces injury risk.",
          "Incluso para ocio y alta escuela clásica, una base mínima de condición física (caminatas, pilates, yoga) mejora significativamente la calidad de la equitación y reduce el riesgo de lesiones."
        ),
        severity: "warning",
      });
    }

    // 5. Tudo OK
    if (list.length === 0) {
      list.push({
        title: tr(
          "Perfil físico compatível com o seu objectivo",
          "Physical profile compatible with your objective",
          "Perfil físico compatible con su objetivo"
        ),
        description: tr(
          "Os dados físicos introduzidos são compatíveis com o tipo de cavalo recomendado para o seu perfil. Prossiga com confiança na fase de selecção.",
          "The physical data entered is compatible with the horse type recommended for your profile. Proceed with confidence into the selection phase.",
          "Los datos físicos introducidos son compatibles con el tipo de caballo recomendado para su perfil. Proceda con confianza en la fase de selección."
        ),
        severity: "ok",
      });
    }

    return list;
  }, [peso, altura, fitness, experiencia, result.profile, tr]);

  const fitnessOptions: { value: NivelFitness; label: string; desc: string }[] = [
    {
      value: "sedentario",
      label: tr("Sedentário", "Sedentary", "Sedentario"),
      desc: tr("Pouco ou nenhum exercício regular", "Little or no regular exercise", "Poco o ningún ejercicio regular"),
    },
    {
      value: "moderado",
      label: tr("Moderado", "Moderate", "Moderado"),
      desc: tr("Exercício 1–3 vezes por semana", "Exercise 1–3 times per week", "Ejercicio 1–3 veces por semana"),
    },
    {
      value: "ativo",
      label: tr("Activo", "Active", "Activo"),
      desc: tr("Exercício 4–5 vezes por semana", "Exercise 4–5 times per week", "Ejercicio 4–5 veces por semana"),
    },
    {
      value: "atleta",
      label: tr("Atleta", "Athlete", "Atleta"),
      desc: tr("Treino diário intensivo", "Intensive daily training", "Entrenamiento diario intensivo"),
    },
  ];

  const experienciaOptions: { value: Experiencia; label: string; desc: string }[] = [
    {
      value: "iniciante",
      label: tr("Iniciante", "Beginner", "Principiante"),
      desc: tr("Menos de 2 anos de equitação", "Less than 2 years riding", "Menos de 2 años de equitación"),
    },
    {
      value: "intermedio",
      label: tr("Intermédio", "Intermediate", "Intermedio"),
      desc: tr("2–5 anos de prática regular", "2–5 years of regular practice", "2–5 años de práctica regular"),
    },
    {
      value: "avancado",
      label: tr("Avançado", "Advanced", "Avanzado"),
      desc: tr("5–10 anos, competição amateur", "5–10 years, amateur competition", "5–10 años, competición amateur"),
    },
    {
      value: "profissional",
      label: tr("Profissional", "Professional", "Profesional"),
      desc: tr("10+ anos, treinador ou competidor profissional", "10+ years, professional trainer or competitor", "10+ años, entrenador o competidor profesional"),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Activity className="text-emerald-400" size={22} />
        </div>
        <div>
          <h2 className="text-xl font-serif text-[var(--foreground)] mb-1">
            {tr("Perfil Físico do Cavaleiro", "Rider Physical Profile", "Perfil Físico del Jinete")}
          </h2>
          <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
            {tr(
              "Introduza os seus dados físicos para receber recomendações personalizadas sobre o tipo de Lusitano mais compatível com o seu perfil.",
              "Enter your physical data to receive personalised recommendations on the most compatible Lusitano type for your profile.",
              "Introduzca sus datos físicos para recibir recomendaciones personalizadas sobre el tipo de Lusitano más compatible con su perfil."
            )}
          </p>
        </div>
      </div>

      {/* Context banner */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-[var(--gold)]/8 border border-[var(--gold)]/20 rounded-xl">
        <Info size={15} className="text-[var(--gold)] shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
          {tr(
            `Perfil detectado: ${result.title}. As recomendações abaixo são personalizadas para este perfil.`,
            `Detected profile: ${result.title}. The recommendations below are personalised for this profile.`,
            `Perfil detectado: ${result.title}. Las recomendaciones a continuación están personalizadas para este perfil.`
          )}
        </p>
      </div>

      {/* Form */}
      <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-2xl p-5 sm:p-6 space-y-7">

        {/* Peso */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Weight className="text-emerald-400" size={15} />
            <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium">
              {tr("Peso do Cavaleiro", "Rider Weight", "Peso del Jinete")}
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPeso((p) => Math.max(40, p - 1))}
              aria-label={tr("Diminuir peso", "Decrease weight", "Disminuir peso")}
              className="w-11 h-11 rounded-lg border border-[var(--border)] bg-[var(--background-card)] flex items-center justify-center hover:border-emerald-500/50 transition-colors"
            >
              <Minus size={15} />
            </button>
            <div className="flex-1 relative">
              <input
                type="number"
                min={40}
                max={130}
                value={peso}
                onChange={(e) =>
                  setPeso(Math.max(40, Math.min(130, Number(e.target.value) || 70)))
                }
                className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-center text-lg font-medium focus:border-emerald-500 outline-none transition-colors"
                aria-label={tr("Peso em kg", "Weight in kg", "Peso en kg")}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] text-sm pointer-events-none">
                kg
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPeso((p) => Math.min(130, p + 1))}
              aria-label={tr("Aumentar peso", "Increase weight", "Aumentar peso")}
              className="w-11 h-11 rounded-lg border border-[var(--border)] bg-[var(--background-card)] flex items-center justify-center hover:border-emerald-500/50 transition-colors"
            >
              <Plus size={15} />
            </button>
          </div>
          <p className="text-xs text-[var(--foreground-muted)] mt-1.5">
            {peso > 100
              ? tr(
                  "Peso elevado — prefira Lusitanos com 163cm ou mais",
                  "High weight — prefer Lusitanos of 163cm or more",
                  "Peso elevado — prefiera Lusitanos de 163cm o más"
                )
              : peso > 90
              ? tr(
                  "Acima da média — verifique a robustez do cavalo",
                  "Above average — check the horse's build",
                  "Por encima de la media — verifique la robustez del caballo"
                )
              : tr(
                  "Dentro do intervalo ideal para Lusitanos",
                  "Within ideal range for Lusitanos",
                  "Dentro del rango ideal para Lusitanos"
                )}
          </p>
        </div>

        {/* Altura */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Ruler className="text-emerald-400" size={15} />
            <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium">
              {tr("Altura do Cavaleiro", "Rider Height", "Altura del Jinete")}
            </label>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={140}
              max={210}
              value={altura}
              onChange={(e) => setAltura(Number(e.target.value))}
              className="flex-1 accent-emerald-500"
              aria-label={tr("Altura em centímetros", "Height in centimetres", "Altura en centímetros")}
              aria-valuenow={altura}
              aria-valuemin={140}
              aria-valuemax={210}
              aria-valuetext={`${altura} cm`}
            />
            <span className="text-lg font-medium tabular-nums w-20 text-right">
              {altura} cm
            </span>
          </div>
        </div>

        {/* Nível de Fitness */}
        <div>
          <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium mb-3">
            {tr("Nível de Condição Física", "Physical Fitness Level", "Nivel de Condición Física")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {fitnessOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFitness(opt.value)}
                aria-pressed={fitness === opt.value}
                className={`flex flex-col gap-1 p-3 rounded-xl border text-left transition-all ${
                  fitness === opt.value
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-[var(--border)] bg-[var(--background-card)] hover:border-emerald-500/40"
                }`}
              >
                <span
                  className={`text-xs font-semibold ${
                    fitness === opt.value ? "text-emerald-400" : "text-[var(--foreground-secondary)]"
                  }`}
                >
                  {opt.label}
                </span>
                <span className="text-[11px] text-[var(--foreground-muted)] leading-snug">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Experiência */}
        <div>
          <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium mb-3">
            {tr("Experiência Equestre", "Equestrian Experience", "Experiencia Ecuestre")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {experienciaOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setExperiencia(opt.value)}
                aria-pressed={experiencia === opt.value}
                className={`flex flex-col gap-1 p-3 rounded-xl border text-left transition-all ${
                  experiencia === opt.value
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-[var(--border)] bg-[var(--background-card)] hover:border-emerald-500/40"
                }`}
              >
                <span
                  className={`text-xs font-semibold ${
                    experiencia === opt.value
                      ? "text-emerald-400"
                      : "text-[var(--foreground-secondary)]"
                  }`}
                >
                  {opt.label}
                </span>
                <span className="text-[11px] text-[var(--foreground-muted)] leading-snug">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Warnings / Análise */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.25em] text-[var(--foreground-muted)] flex items-center gap-2">
          <Shield size={13} className="text-[var(--gold)]" />
          {tr("Análise de Compatibilidade", "Compatibility Analysis", "Análisis de Compatibilidad")}
        </h3>
        {warnings.map((w, i) => {
          const isOk = w.severity === "ok";
          const isCritical = w.severity === "critical";
          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                isOk
                  ? "bg-emerald-500/8 border-emerald-500/25"
                  : isCritical
                  ? "bg-red-500/8 border-red-500/25"
                  : "bg-amber-500/8 border-amber-500/25"
              }`}
            >
              {isOk ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              ) : isCritical ? (
                <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className={`text-sm font-medium mb-0.5 ${
                    isOk
                      ? "text-emerald-300"
                      : isCritical
                      ? "text-red-300"
                      : "text-amber-300"
                  }`}
                >
                  {w.title}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  {w.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nota de rodapé */}
      <p className="text-xs text-[var(--foreground-muted)]/60 leading-relaxed">
        {tr(
          "Esta análise é indicativa. Para uma avaliação completa, consulte sempre um instrutor equestre certificado.",
          "This analysis is indicative. For a complete assessment, always consult a certified equestrian instructor.",
          "Este análisis es indicativo. Para una evaluación completa, consulte siempre a un instructor ecuestre certificado."
        )}
      </p>
    </div>
  );
}
