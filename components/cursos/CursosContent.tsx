"use client";

import Link from "next/link";
import { BookOpen, Award, Clock, Star, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  modules: number;
  level: string;
  price: string;
  badge?: string;
}

export default function CursosContent() {
  const { language } = useLanguage();
  const tr = createTranslator(language);

  const courses: Course[] = [
    {
      id: "equitacao-classica",
      title: tr(
        "Equitacao Classica Portuguesa",
        "Classical Portuguese Riding",
        "Equitacion Clasica Portuguesa"
      ),
      description: tr(
        "Domine os fundamentos da equitacao classica com exercicios progressivos, desde o trabalho de mao ate a alta escola.",
        "Master classical riding fundamentals with progressive exercises, from groundwork to haute ecole.",
        "Domine los fundamentos de la equitacion clasica con ejercicios progresivos, desde el trabajo de mano hasta la alta escuela."
      ),
      duration: "12h",
      modules: 8,
      level: tr("Intermedio", "Intermediate", "Intermedio"),
      price: "149",
      badge: tr("Mais Popular", "Most Popular", "Mas Popular"),
    },
    {
      id: "gestao-coudelaria",
      title: tr("Gestao de Coudelarias", "Stud Farm Management", "Gestion de Ganaderias"),
      description: tr(
        "Aprenda a gerir uma coudelaria de forma rentavel: reproducao, nutricao, planeamento financeiro e marketing equestre.",
        "Learn to manage a stud farm profitably: reproduction, nutrition, financial planning and equestrian marketing.",
        "Aprenda a gestionar una ganaderia de forma rentable: reproduccion, nutricion, planificacion financiera y marketing ecuestre."
      ),
      duration: "16h",
      modules: 10,
      level: tr("Avancado", "Advanced", "Avanzado"),
      price: "199",
    },
    {
      id: "veterinaria-equina",
      title: tr(
        "Cuidados Veterinarios Essenciais",
        "Essential Veterinary Care",
        "Cuidados Veterinarios Esenciales"
      ),
      description: tr(
        "Reconheca sinais de doenca, primeiros socorros, desparasitacao, vacinacao e quando chamar o veterinario.",
        "Recognise illness signs, first aid, deworming, vaccination and when to call the vet.",
        "Reconozca signos de enfermedad, primeros auxilios, desparasitacion, vacunacion y cuando llamar al veterinario."
      ),
      duration: "8h",
      modules: 6,
      level: tr("Iniciante", "Beginner", "Principiante"),
      price: "99",
    },
    {
      id: "biomecanique-lusitano",
      title: tr(
        "Biomecanica do Cavalo Lusitano",
        "Lusitano Horse Biomechanics",
        "Biomecanica del Caballo Lusitano"
      ),
      description: tr(
        "Compreenda a biomecanica unica do Lusitano e como otimizar treino, ferracao e selaria para melhor performance.",
        "Understand the Lusitano's unique biomechanics and how to optimise training, shoeing and saddlery for better performance.",
        "Comprenda la biomecanica unica del Lusitano y como optimizar entrenamiento, herraje y talabarteria para mejor rendimiento."
      ),
      duration: "10h",
      modules: 7,
      level: tr("Avancado", "Advanced", "Avanzado"),
      price: "179",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 sm:pt-32 md:pt-48 px-4 sm:px-6 md:px-12 lg:px-20 pb-24 sm:pb-32">
      {/* Header */}
      <header className="mb-12 sm:mb-16 md:mb-24 text-center max-w-3xl mx-auto">
        <span className="text-[var(--gold)] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[9px] sm:text-[10px] font-bold block mb-2 sm:mb-4">
          {tr("Academia", "Academy", "Academia")}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-[var(--foreground)] mb-4 sm:mb-6">
          {tr("Cursos Premium", "Premium Courses", "Cursos Premium")}
        </h1>
        <div className="w-16 sm:w-24 h-[1px] bg-[var(--gold)] mx-auto opacity-40 mb-6" />
        <p className="text-[var(--foreground-muted)] text-sm sm:text-base max-w-xl mx-auto">
          {tr(
            "Formacao de excelencia com profissionais reconhecidos do mundo equestre lusitano. Certificado incluido.",
            "Excellence training with recognised professionals from the Lusitano equestrian world. Certificate included.",
            "Formacion de excelencia con profesionales reconocidos del mundo ecuestre lusitano. Certificado incluido."
          )}
        </p>
      </header>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-16 sm:mb-24">
        {courses.map((course) => (
          <article
            key={course.id}
            className="relative bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 sm:p-8 hover:border-[var(--gold)]/50 transition-colors group"
          >
            {course.badge && (
              <span className="absolute top-4 right-4 bg-[var(--gold)] text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                {course.badge}
              </span>
            )}

            <h2 className="text-xl sm:text-2xl font-serif mb-3 pr-20">{course.title}</h2>
            <p className="text-sm text-[var(--foreground-muted)] mb-5 leading-relaxed">
              {course.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 mb-6 text-xs text-[var(--foreground-muted)]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {course.modules} {tr("modulos", "modules", "modulos")}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />
                {course.level}
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                {tr("Certificado", "Certificate", "Certificado")}
              </span>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-serif text-[var(--gold)]">
                  {course.price} &euro;
                </span>
              </div>
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[var(--gold)]/20 text-[var(--gold)] rounded-lg text-sm font-medium cursor-not-allowed"
              >
                {tr("Em Breve", "Coming Soon", "Proximamente")}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Notify CTA */}
      <section className="max-w-2xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl font-serif mb-3">
          {tr("Seja o primeiro a saber", "Be the first to know", "Sea el primero en saber")}
        </h2>
        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          {tr(
            "Inscreva-se na newsletter para ser notificado quando os cursos estiverem disponiveis.",
            "Subscribe to our newsletter to be notified when courses are available.",
            "Suscribase a nuestro boletin para ser notificado cuando los cursos esten disponibles."
          )}
        </p>
        <Link
          href="/#newsletter"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--gold)] text-black font-semibold rounded-lg hover:bg-[var(--gold-hover)] transition-colors"
        >
          {tr("Receber Novidades", "Get Updates", "Recibir Novedades")}
        </Link>
      </section>
    </main>
  );
}
