"use client";

interface GenealogyTreeProps {
  horse: {
    nome_cavalo: string;
    pai?: string;
    mae?: string;
  };
}

export default function GenealogyTree({ horse }: GenealogyTreeProps) {
  return (
    <div className="w-full bg-[var(--background)]/50 p-12 border border-[var(--background-secondary)] overflow-x-auto">
      <h3 className="text-[var(--gold)] text-[10px] uppercase tracking-[0.5em] font-bold mb-16 text-center">
        Criptogenética: Linhagem de Sangue
      </h3>

      <div className="flex justify-center items-center gap-8 min-w-[800px]">
        {/* EXEMPLAR ATUAL */}
        <div className="w-64 text-center">
          <div className="border border-[var(--gold)] p-6 bg-[var(--background)]/40">
            <p className="text-[var(--gold)] text-[8px] uppercase font-bold mb-2">Exemplar</p>
            <p className="font-serif text-xl italic text-[var(--foreground)]">
              {horse.nome_cavalo}
            </p>
          </div>
        </div>

        <div className="h-px w-12 bg-[var(--border)]"></div>

        {/* PAIS */}
        <div className="flex flex-col gap-12">
          <div className="w-56 border border-[var(--border)] p-4 hover:border-[var(--gold)] transition-all">
            <p className="text-[var(--foreground-secondary)] text-[8px] uppercase font-bold mb-1">
              Pai (Sire)
            </p>
            <p className="font-serif text-sm italic text-[var(--foreground)]">
              {horse.pai || "Ancestral de Elite"}
            </p>
          </div>
          <div className="w-56 border border-[var(--border)] p-4 hover:border-[var(--gold)] transition-all">
            <p className="text-[var(--foreground-secondary)] text-[8px] uppercase font-bold mb-1">
              Mãe (Dam)
            </p>
            <p className="font-serif text-sm italic text-[var(--foreground)]">
              {horse.mae || "Ventre de Ouro"}
            </p>
          </div>
        </div>

        <div className="h-px w-12 bg-[var(--border)]"></div>

        {/* AVÓS (RESUMO) */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-48 border border-[var(--background-secondary)] p-3 opacity-60 hover:opacity-100 transition-all"
            >
              <p className="text-[var(--foreground-muted)] text-[7px] uppercase font-bold">
                G2 Ancestor
              </p>
              <p className="font-serif text-[10px] italic text-[var(--foreground-secondary)]">
                Linhagem Consagrada
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
