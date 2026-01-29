"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { articlesListPT, articlesListEN } from "@/data/articlesList";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function JornalPage() {
  const { t, language } = useLanguage();

  const articles = language === "pt" ? articlesListPT : articlesListEN;

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">

      {/* 1. CABECALHO */}
      <motion.div
        className="text-center mb-16 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.span
          className="text-xs uppercase tracking-[0.3em] text-[#C5A059] block mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t.journal.archive}
        </motion.span>
        <motion.h1
          className="text-5xl md:text-7xl font-serif text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {t.journal.title}
        </motion.h1>
        <motion.p
          className="text-zinc-400 font-serif italic text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          "{t.journal.subtitle}"
        </motion.p>
      </motion.div>

      {/* 2. DESTAQUE */}
      <motion.div
        className="max-w-7xl mx-auto mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Link href={`/jornal/${articles[0].id}`}>
          <div className="group relative w-full h-[600px] overflow-hidden border border-white/10 rounded-sm cursor-pointer">
            <Image
              src={articles[0].image}
              alt={articles[0].title}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            <motion.div
              className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-2/3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <span className="inline-block bg-[#C5A059] text-black px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                {articles[0].category}
              </span>
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-4 leading-tight">
                {articles[0].title}
              </h2>
              <p className="text-zinc-300 text-lg mb-6 font-serif italic">
                {articles[0].subtitle}
              </p>
              <div className="flex items-center gap-6 text-xs text-zinc-400 uppercase tracking-wider">
                <div className="flex items-center gap-2"><BookOpen size={14} /> {t.journal.technical_read}</div>
                <div className="flex items-center gap-2"><Clock size={14} /> {articles[0].readTime}</div>
              </div>
            </motion.div>
          </div>
        </Link>
      </motion.div>

      {/* 3. GRELHA COMPLETA */}
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {articles.slice(1).map((article) => (
          <motion.div key={article.id} variants={itemVariants}>
            <Link href={`/jornal/${article.id}`}>
              <article className="group cursor-pointer h-full flex flex-col border border-white/5 hover:border-[#C5A059]/30 transition-colors bg-white/[0.02]">
                <div className="w-full h-64 overflow-hidden relative">
                  <motion.img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.7 }}
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 text-[10px] uppercase text-white tracking-widest border border-white/10">
                    {article.category}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="mb-4 text-[#C5A059] text-[10px] uppercase tracking-widest flex justify-between">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-[#C5A059] transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-grow font-serif">
                    {article.subtitle}
                  </p>
                  <div className="border-t border-white/10 pt-4 mt-auto">
                    <span className="flex items-center gap-2 text-white text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                      {t.journal.read_study} <ArrowRight size={14} className="text-[#C5A059]" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </motion.div>

    </main>
  );
}
