"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Star,
  Trophy,
  Target,
  Zap,
  Gift,
  ChevronRight,
  Play,
  Download,
  Users,
  MessageCircle,
  Calendar,
  Bell,
  Settings,
  Lock,
  CheckCircle,
  Circle,
  Flame,
} from "lucide-react";
import Link from "next/link";

// Dados do utilizador (simulado)
const userData = {
  name: "João Silva",
  plan: "Criador",
  memberSince: "Janeiro 2024",
  avatar: "JS",
  streak: 7,
  xp: 2450,
  level: 12,
  nextLevelXp: 3000,
  rank: "Cavaleiro",
  nextRank: "Mestre",
};

const achievements = [
  {
    id: 1,
    title: "Primeiro Passo",
    description: "Completou o primeiro ebook",
    icon: BookOpen,
    unlocked: true,
    date: "15 Jan 2024",
    xp: 100,
  },
  {
    id: 2,
    title: "Conhecedor",
    description: "Leu 5 ebooks completos",
    icon: Star,
    unlocked: true,
    date: "28 Jan 2024",
    xp: 250,
  },
  {
    id: 3,
    title: "Streak Master",
    description: "7 dias consecutivos de leitura",
    icon: Flame,
    unlocked: true,
    date: "Hoje",
    xp: 150,
  },
  {
    id: 4,
    title: "Especialista",
    description: "Completou a certificação básica",
    icon: Award,
    unlocked: false,
    progress: 75,
    xp: 500,
  },
  {
    id: 5,
    title: "Membro da Elite",
    description: "Atingiu o nível 20",
    icon: Crown,
    unlocked: false,
    progress: 60,
    xp: 1000,
  },
  {
    id: 6,
    title: "Mentor",
    description: "Ajudou 10 membros na comunidade",
    icon: Users,
    unlocked: false,
    progress: 30,
    xp: 300,
  },
];

const currentlyReading = [
  {
    id: "manual-criador",
    title: "Manual do Criador Profissional",
    progress: 65,
    cover: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=200",
    lastRead: "Há 2 horas",
  },
  {
    id: "linhagens-elite",
    title: "Linhagens de Elite",
    progress: 30,
    cover: "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=200",
    lastRead: "Ontem",
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Webinar: Reprodução Equina",
    date: "15 Fev 2024",
    time: "19:00",
    host: "Dr. António Marques",
  },
  {
    id: 2,
    title: "Q&A com Criadores",
    date: "22 Fev 2024",
    time: "20:00",
    host: "Coudelaria Veiga",
  },
];

const recommendedContent = [
  {
    id: "treino-dressage",
    title: "Treino de Dressage",
    type: "Ebook",
    cover: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=200",
  },
  {
    id: "saude-equina",
    title: "Saúde Equina Essencial",
    type: "Ebook",
    cover: "https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=200",
  },
];

export default function DashboardPage() {
  const progressPercent = (userData.xp / userData.nextLevelXp) * 100;

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[#C5A059] to-[#8B6914] rounded-full flex items-center justify-center text-2xl font-bold text-black">
                {userData.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#C5A059] rounded-full px-2 py-0.5 text-[10px] font-bold text-black">
                LVL {userData.level}
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-serif text-white mb-1">
                Olá, {userData.name.split(" ")[0]}!
              </h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-[#C5A059]">
                  <Crown size={14} />
                  Plano {userData.plan}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-500">Membro desde {userData.memberSince}</span>
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg px-6 py-3 flex items-center gap-3">
              <Flame className="text-orange-500" size={24} />
              <div>
                <div className="text-2xl font-bold text-white">{userData.streak}</div>
                <div className="text-xs text-zinc-500">dias seguidos</div>
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Trophy className="text-[#C5A059]" size={24} />
              <div>
                <h3 className="text-white font-medium">{userData.rank}</h3>
                <p className="text-zinc-500 text-sm">Próximo: {userData.nextRank}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{userData.xp} XP</div>
              <div className="text-zinc-500 text-sm">{userData.nextLevelXp - userData.xp} para próximo nível</div>
            </div>
          </div>
          <div className="relative h-4 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C5A059] to-[#E8D5A3]"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Currently Reading */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-white flex items-center gap-2">
                  <BookOpen className="text-[#C5A059]" size={20} />
                  A Ler Agora
                </h2>
                <Link href="/pro/biblioteca" className="text-[#C5A059] text-sm hover:underline">
                  Ver biblioteca
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {currentlyReading.map((book) => (
                  <Link
                    key={book.id}
                    href={`/pro/biblioteca/${book.id}`}
                    className="group bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex gap-4 hover:border-[#C5A059]/30 transition-colors"
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-white font-medium group-hover:text-[#C5A059] transition-colors line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-zinc-500 text-sm mt-1">{book.lastRead}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-zinc-500">Progresso</span>
                          <span className="text-[#C5A059]">{book.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C5A059]"
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>

            {/* Achievements */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-white flex items-center gap-2">
                  <Award className="text-[#C5A059]" size={20} />
                  Conquistas
                </h2>
                <span className="text-zinc-500 text-sm">
                  {achievements.filter((a) => a.unlocked).length}/{achievements.length} desbloqueadas
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`relative bg-zinc-900/50 border rounded-xl p-4 flex items-start gap-4 ${
                      achievement.unlocked
                        ? "border-[#C5A059]/30"
                        : "border-white/5 opacity-60"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        achievement.unlocked
                          ? "bg-[#C5A059]/20"
                          : "bg-zinc-800"
                      }`}
                    >
                      <achievement.icon
                        size={24}
                        className={achievement.unlocked ? "text-[#C5A059]" : "text-zinc-600"}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{achievement.title}</h3>
                        {achievement.unlocked && (
                          <CheckCircle size={14} className="text-green-500" />
                        )}
                      </div>
                      <p className="text-zinc-500 text-sm">{achievement.description}</p>
                      {achievement.unlocked ? (
                        <p className="text-[#C5A059] text-xs mt-2">
                          +{achievement.xp} XP • {achievement.date}
                        </p>
                      ) : (
                        <div className="mt-2">
                          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-zinc-600"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                          <p className="text-zinc-600 text-xs mt-1">{achievement.progress}% completo</p>
                        </div>
                      )}
                    </div>
                    {!achievement.unlocked && (
                      <Lock size={16} className="text-zinc-600" />
                    )}
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Recommended */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-white flex items-center gap-2">
                  <Zap className="text-[#C5A059]" size={20} />
                  Recomendado para Ti
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {recommendedContent.map((content) => (
                  <Link
                    key={content.id}
                    href={`/pro/biblioteca/${content.id}`}
                    className="group bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden flex hover:border-[#C5A059]/30 transition-colors"
                  >
                    <img
                      src={content.cover}
                      alt={content.title}
                      className="w-24 h-32 object-cover"
                    />
                    <div className="p-4 flex flex-col justify-center">
                      <span className="text-[#C5A059] text-xs uppercase tracking-widest mb-1">
                        {content.type}
                      </span>
                      <h3 className="text-white font-medium group-hover:text-[#C5A059] transition-colors">
                        {content.title}
                      </h3>
                      <span className="text-zinc-500 text-sm mt-2 flex items-center gap-1">
                        Começar a ler <ChevronRight size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/50 border border-white/5 rounded-xl p-6"
            >
              <h3 className="text-lg font-serif text-white mb-4">Estatísticas</h3>
              <div className="space-y-4">
                {[
                  { icon: BookOpen, label: "Ebooks lidos", value: "8" },
                  { icon: Clock, label: "Horas de leitura", value: "24" },
                  { icon: Award, label: "Certificações", value: "2" },
                  { icon: Target, label: "Objetivos cumpridos", value: "12" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-zinc-400">
                      <stat.icon size={16} />
                      {stat.label}
                    </span>
                    <span className="text-white font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900/50 border border-white/5 rounded-xl p-6"
            >
              <h3 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
                <Calendar className="text-[#C5A059]" size={18} />
                Próximos Eventos
              </h3>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <h4 className="text-white font-medium">{event.title}</h4>
                    <p className="text-zinc-500 text-sm">{event.host}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-[#C5A059]">
                      <Calendar size={12} />
                      <span>{event.date} às {event.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-[#C5A059] hover:underline">
                Ver todos os eventos
              </button>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              {[
                { icon: Download, label: "Downloads", href: "/pro/downloads" },
                { icon: MessageCircle, label: "Comunidade", href: "/pro/comunidade" },
                { icon: Award, label: "Certificações", href: "/pro/certificacoes" },
                { icon: Settings, label: "Definições", href: "/pro/definicoes" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between bg-zinc-900/50 border border-white/5 rounded-lg p-4 hover:border-[#C5A059]/30 transition-colors group"
                >
                  <span className="flex items-center gap-3 text-zinc-400 group-hover:text-white transition-colors">
                    <action.icon size={18} />
                    {action.label}
                  </span>
                  <ChevronRight size={18} className="text-zinc-600 group-hover:text-[#C5A059] transition-colors" />
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
