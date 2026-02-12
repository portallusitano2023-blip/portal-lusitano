import {
  Globe,
  AlertTriangle,
  Skull,
  XCircle,
  Microscope,
  CircleDot,
  Droplets,
  HeartPulse,
} from "lucide-react";
import { DadoDestaque } from "./DadoDestaque";

export function SeccaoOQue() {
  return (
    <div className="space-y-6 text-sm text-[var(--foreground-secondary)] leading-relaxed">
      <p className="text-[15px] leading-relaxed">
        A <strong className="text-[var(--foreground)]">piroplasmose equina</strong> (EP) é uma
        doença parasitária transmitida por carraças que afecta cavalos, mulas, burros e zebras. É
        causada por dois protozoários que infectam os glóbulos vermelhos:{" "}
        <em className="text-[var(--gold)]">Theileria equi</em> e{" "}
        <em className="text-[var(--gold)]">Babesia caballi</em>.
      </p>

      {/* FONTE: PMC11349644, Frontiers Vet Sci 2024 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <DadoDestaque
          icone={Globe}
          valor="~90%"
          label="da população equina vive em zonas endémicas"
        />
        <DadoDestaque
          icone={Skull}
          valor="5-10%"
          label="mortalidade em zonas endémicas"
          cor="text-red-400"
        />
        <DadoDestaque
          icone={AlertTriangle}
          valor=">50%"
          label="mortalidade em animais sem exposição prévia"
          cor="text-red-500"
        />
        <DadoDestaque
          icone={XCircle}
          valor="0"
          label="vacinas disponíveis"
          cor="text-[var(--foreground-secondary)]"
        />
      </div>

      {/* FONTE: PMC11349644 - T. equi "persistent infections"; B. caballi "can be naturally cleared" */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Microscope size={16} className="text-red-400" />
            <span className="text-sm font-semibold text-red-300">Theileria equi</span>
          </div>
          <ul className="space-y-2 text-xs text-[var(--foreground-secondary)]">
            <li className="flex items-start gap-2">
              <CircleDot size={10} className="text-red-400 mt-1 flex-shrink-0" />
              <span>Parasita mais agressivo e difícil de tratar</span>
            </li>
            <li className="flex items-start gap-2">
              <CircleDot size={10} className="text-red-400 mt-1 flex-shrink-0" />
              <span>
                Cavalos infectados tornam-se{" "}
                <strong className="text-[var(--foreground)]">
                  portadores crónicos persistentes
                </strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CircleDot size={10} className="text-red-400 mt-1 flex-shrink-0" />
              <span>Principal causa de rejeição nos testes de exportação</span>
            </li>
          </ul>
        </div>
        <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Microscope size={16} className="text-orange-400" />
            <span className="text-sm font-semibold text-orange-300">Babesia caballi</span>
          </div>
          <ul className="space-y-2 text-xs text-[var(--foreground-secondary)]">
            <li className="flex items-start gap-2">
              <CircleDot size={10} className="text-orange-400 mt-1 flex-shrink-0" />
              <span>Parasita menos agressivo</span>
            </li>
            <li className="flex items-start gap-2">
              <CircleDot size={10} className="text-orange-400 mt-1 flex-shrink-0" />
              <span>
                Infecções podem ser{" "}
                <strong className="text-[var(--foreground)]">eliminadas naturalmente</strong> pelo
                organismo
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CircleDot size={10} className="text-orange-400 mt-1 flex-shrink-0" />
              <span>Responde melhor ao tratamento com imidocarb</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Transmissão */}
      <div>
        <h3 className="text-[var(--foreground)] font-semibold text-base mb-4 flex items-center gap-2">
          <Droplets size={16} className="text-[var(--gold)]" />
          Vias de Transmissão
        </h3>
        {/* FONTE: USDA APHIS, WOAH */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Carraças Ixodídeas",
              detalhe: "~14 espécies dos géneros Dermacentor, Rhipicephalus e Hyalomma",
              principal: true,
            },
            {
              label: "Sangue contaminado",
              detalhe: "Produtos sanguíneos, transfusões",
              principal: false,
            },
            {
              label: "Agulhas e seringas",
              detalhe: "Reutilização de material",
              principal: false,
            },
            {
              label: "Equipamento IV",
              detalhe: "Material intravenoso partilhado",
              principal: false,
            },
            { label: "Transplacentária", detalhe: "Égua para poldro", principal: false },
          ].map((via, i) => (
            <div
              key={i}
              className={`rounded-xl p-3 sm:p-4 border ${via.principal ? "bg-[var(--gold)]/10 border-[var(--gold)]/20 col-span-2 sm:col-span-1" : "bg-[var(--background-card)]/40 border-[var(--border)]/30"}`}
            >
              <p
                className={`text-xs font-semibold mb-1 ${via.principal ? "text-[var(--gold)]" : "text-[var(--foreground)]"}`}
              >
                {via.label}
              </p>
              <p className="text-[10px] text-[var(--foreground-muted)] leading-relaxed">
                {via.detalhe}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Formas Clínicas */}
      <div>
        <h3 className="text-[var(--foreground)] font-semibold text-base mb-4 flex items-center gap-2">
          <HeartPulse size={16} className="text-[var(--gold)]" />
          Formas Clínicas
        </h3>
        {/* FONTE: PMC/PubMed - New insights in diagnosis and treatment */}
        <div className="space-y-3">
          {[
            {
              nome: "Aguda",
              freq: "mais comum",
              cor: "border-red-500/30 bg-red-500/5",
              corTexto: "text-red-400",
              sintomas: ["Febre > 40°C", "Anemia", "Perda de apetite", "Taquicardia"],
            },
            {
              nome: "Subaguda",
              freq: "intermédia",
              cor: "border-orange-500/30 bg-orange-500/5",
              corTexto: "text-orange-400",
              sintomas: ["Perda de peso", "Febre intermitente", "Icterícia"],
            },
            {
              nome: "Crónica",
              freq: "comum em endémicos",
              cor: "border-yellow-500/30 bg-yellow-500/5",
              corTexto: "text-yellow-400",
              sintomas: ["Inapetência ligeira", "Baixo rendimento", "Perda de peso gradual"],
            },
            {
              nome: "Peraguda",
              freq: "rara",
              cor: "border-red-700/30 bg-red-700/5",
              corTexto: "text-red-600",
              sintomas: ["Falência multiorgânica", "Morte súbita"],
            },
          ].map((forma, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 border ${forma.cor} flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6`}
            >
              <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
                <span className={`text-sm font-bold ${forma.corTexto}`}>{forma.nome}</span>
                <span className="text-[9px] bg-[var(--background-card)] text-[var(--foreground-muted)] px-2 py-0.5 rounded-full">
                  {forma.freq}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {forma.sintomas.map((s, j) => (
                  <span
                    key={j}
                    className="text-[11px] text-[var(--foreground-secondary)] bg-[var(--background-card)]/60 px-2.5 py-1 rounded-lg"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-[var(--foreground-muted)] pt-2">
        Fontes: WOAH (woah.org), USDA APHIS (aphis.usda.gov), PMC/PubMed (pmc.ncbi.nlm.nih.gov)
      </p>
    </div>
  );
}
