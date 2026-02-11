import Link from "next/link";
import { ArrowLeft, Thermometer } from "lucide-react";

export function SeccaoHeader() {
  return (
    <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
      <div className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] mb-6 touch-manipulation transition-colors duration-150"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Voltar</span>
        </Link>
      </div>

      <div className="text-center">
        <span
          className="text-[#C5A059] uppercase tracking-[0.3em] text-[9px] sm:text-[10px] font-bold block mb-2 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.08s" }}
        >
          Saúde Equina
        </span>
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic mb-4 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.14s" }}
        >
          Piroplasmose Equina
        </h1>
        <p
          className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.2s" }}
        >
          A doença transmitida por carraças que é a principal barreira à exportação e ao comércio
          internacional do cavalo Lusitano.
        </p>
      </div>

      {/* Alerta Principal */}
      {/* FONTE: Cabete et al. 2024 - seroprevalência nacional 32.7% T. equi */}
      <div
        className="mt-8 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 rounded-xl p-6 max-w-3xl mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <Thermometer size={24} className="text-red-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold mb-1">Porque é que isto importa?</h2>
            <p className="text-sm text-zinc-400">
              Estudos científicos demonstram que cerca de{" "}
              <strong className="text-white">um em cada três cavalos</strong> em Portugal testa
              positivo para <em>Theileria equi</em>, mesmo sendo portadores assintomáticos
              saudáveis. Isto impede a sua exportação para os EUA, Canadá, Austrália e outros
              mercados-chave, representando o maior desafio comercial da raça a nível mundial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
