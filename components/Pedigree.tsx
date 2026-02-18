interface AncestorCardProps {
  type: string;
  name?: string;
  reg?: string;
  isFemale?: boolean;
}

const AncestorCard = ({ type, name, reg, isFemale = false }: AncestorCardProps) => (
  <div
    className={`
    relative p-4 border transition-all duration-500 group min-w-[180px]
    ${isFemale ? "border-[var(--background-secondary)] bg-[var(--background)]/30" : "border-[var(--border)] bg-[var(--background)]/60"}
    hover:border-[var(--gold)] hover:bg-[var(--background-secondary)]
  `}
  >
    <span className="text-[8px] uppercase tracking-widest text-[var(--foreground-muted)] block mb-1 group-hover:text-[var(--gold)] transition-colors">
      {type}
    </span>
    <p className="font-serif italic text-[var(--foreground)] text-sm whitespace-nowrap overflow-hidden text-ellipsis">
      {name || "Não registado"}
    </p>
    {/* Número de Registo Fictício para visual (podes adicionar na DB depois) */}
    <p className="text-[7px] text-[var(--foreground-muted)] font-mono mt-1">{reg || "N/A"}</p>

    {/* Ponto de Conexão Visual */}
    <div className="absolute -right-3 top-1/2 w-3 h-px bg-[var(--border)] group-hover:bg-[var(--gold)] transition-colors"></div>
  </div>
);

interface PedigreeProps {
  cavalo: {
    nome_cavalo: string;
    pai?: string;
    mae?: string;
  };
}

export default function Pedigree({ cavalo }: PedigreeProps) {
  return (
    <div className="w-full overflow-x-auto py-12 border border-[var(--background-secondary)] bg-[var(--background)]">
      <div className="flex items-center justify-center min-w-[580px] gap-4 sm:gap-8 px-4 sm:px-8">
        {/* COLUNA 1: O Cavalo (HERÓI) */}
        <div className="flex flex-col justify-center">
          <div className="border border-[var(--gold)] bg-[var(--gold)]/10 p-6 min-w-[200px] relative">
            <span className="text-[var(--gold)] text-[9px] uppercase tracking-[0.4em] font-bold block mb-2">
              O Exemplar
            </span>
            <h3 className="text-xl font-serif italic text-[var(--foreground)]">
              {cavalo.nome_cavalo}
            </h3>
            <div className="absolute -left-3 top-1/2 w-3 h-px bg-[var(--gold)]"></div>
          </div>
        </div>

        {/* Conector Central */}
        <div className="h-px w-10 bg-[var(--border)]"></div>

        {/* COLUNA 2: Pais (Sire & Dam) */}
        <div className="flex flex-col gap-16 relative">
          {/* Linhas de conexão verticais */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-[var(--border)] -ml-5 border-l border-[var(--border)]"></div>
          <div className="absolute left-0 top-1/4 w-5 h-px bg-[var(--border)] -ml-5"></div>
          <div className="absolute left-0 bottom-1/4 w-5 h-px bg-[var(--border)] -ml-5"></div>

          {/* PAI */}
          <div className="relative">
            <AncestorCard type="Pai (Sire)" name={cavalo.pai} reg="LUS-2938" />
            {/* Conector para Avós */}
            <div className="absolute -right-8 top-1/2 w-8 h-px bg-[var(--border)]"></div>
          </div>

          {/* MÃE */}
          <div className="relative">
            <AncestorCard type="Mãe (Dam)" name={cavalo.mae} reg="LUS-1102" isFemale={true} />
            {/* Conector para Avós */}
            <div className="absolute -right-8 top-1/2 w-8 h-px bg-[var(--border)]"></div>
          </div>
        </div>

        {/* COLUNA 3: Avós (Grandparents) - Simulados visualmente */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 mb-8 relative">
            {/* Conectores */}
            <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-[var(--border)] -ml-4"></div>
            <div className="absolute left-0 top-1/4 w-4 h-px bg-[var(--border)] -ml-4"></div>
            <div className="absolute left-0 bottom-1/4 w-4 h-px bg-[var(--border)] -ml-4"></div>

            <AncestorCard type="Avô Paterno" name="Zimbro" reg="VEIGA" />
            <AncestorCard type="Avó Paterna" name="Xarola" reg="VEIGA" isFemale={true} />
          </div>

          <div className="flex flex-col gap-2 relative">
            {/* Conectores */}
            <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-[var(--border)] -ml-4"></div>
            <div className="absolute left-0 top-1/4 w-4 h-px bg-[var(--border)] -ml-4"></div>
            <div className="absolute left-0 bottom-1/4 w-4 h-px bg-[var(--border)] -ml-4"></div>

            <AncestorCard type="Avô Materno" name="Uivador" reg="ANDRADE" />
            <AncestorCard type="Avó Materna" name="Toleirona" reg="ANDRADE" isFemale={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
