import { CheckCircle2, XCircle, Clock, Thermometer, Droplets, HeartPulse } from "lucide-react";

export function SeccaoOlimpiadas() {
  return (
    <div className="space-y-6 text-sm text-[var(--foreground-secondary)] leading-relaxed">
      {/* Timeline visual dos eventos */}
      <div className="space-y-4">
        {/* FONTE: Olympics.com - Beijing 2008 equestrian events moved to Hong Kong */}
        {/* NOTA: A transferência foi por preocupações gerais de doenças equinas, NÃO especificamente piroplasmose */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--gold)]/30">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--gold)] border-2 border-[var(--background)]" />
          <div className="bg-[var(--background-card)]/40 border border-[var(--border)]/30 rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[var(--gold)] text-xl sm:text-2xl font-bold font-serif">
                2008
              </span>
              <div>
                <span className="text-[var(--foreground)] font-semibold text-sm block">
                  Jogos Olímpicos de Pequim
                </span>
                <span className="text-[10px] text-[var(--foreground-muted)]">
                  Transferência para Hong Kong
                </span>
              </div>
            </div>
            <p className="text-[13px] text-[var(--foreground-secondary)] leading-relaxed">
              As provas equestres foram transferidas de Pequim para{" "}
              <strong className="text-[var(--foreground)]">Hong Kong</strong>, devido a preocupações
              gerais com doenças equinas na China continental, incluindo a piroplasmose. Hong Kong
              foi seleccionada pela sua infraestrutura de corridas, herdada da era colonial
              britânica, que proporcionava instalações de quarentena e protocolos de biossegurança
              rigorosos.
            </p>
          </div>
        </div>

        {/* FONTE: Horse Sport */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--gold)]/30">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--gold)] border-2 border-[var(--background)]" />
          <div className="bg-[var(--background-card)]/40 border border-[var(--border)]/30 rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[var(--gold)] text-xl sm:text-2xl font-bold font-serif">
                2010
              </span>
              <div>
                <span className="text-[var(--foreground)] font-semibold text-sm block">
                  WEG Kentucky
                </span>
                <span className="text-[10px] text-[var(--foreground-muted)]">
                  Jogos Equestres Mundiais
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-[var(--gold)]/10 rounded-lg p-3 text-center">
                <span className="text-xl font-bold text-[var(--gold)]">~100</span>
                <p className="text-[10px] text-[var(--foreground-muted)] mt-1">
                  cavalos piro-positivos competiram
                </p>
              </div>
              <div className="bg-[var(--border)]/30 rounded-lg p-3 text-center">
                <span className="text-xl font-bold text-[var(--foreground)]">~500</span>
                <p className="text-[10px] text-[var(--foreground-muted)] mt-1">
                  cavalos em quarentena (Cincinnati)
                </p>
              </div>
            </div>
            <p className="text-xs text-[var(--foreground-secondary)]">
              Protocolos especiais aprovados pela USDA. Cavalos positivos tiveram estábulos e áreas
              de pastagem separadas.
            </p>
          </div>
        </div>

        {/* FONTE: EquiManagement */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--gold)]/30">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--gold)] border-2 border-[var(--background)]" />
          <div className="bg-[var(--background-card)]/40 border border-[var(--border)]/30 rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[var(--gold)] text-xl sm:text-2xl font-bold font-serif">
                2018
              </span>
              <div>
                <span className="text-[var(--foreground)] font-semibold text-sm block">
                  WEG Tryon
                </span>
                <span className="text-[10px] text-[var(--foreground-muted)]">
                  Jogos Equestres Mundiais
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                "Isolamento separado",
                "Monitorização 24/7",
                "Inspecção diária carraças",
                "Tratamento acaricida",
                "Zero contacto com cavalos americanos",
              ].map((p, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-green-500/10 text-green-300 border border-green-500/20 px-2.5 py-1 rounded-full"
                >
                  <CheckCircle2 size={9} className="inline mr-1" />
                  {p}
                </span>
              ))}
            </div>
            <p className="text-xs text-[var(--foreground-secondary)]">
              Um estudo de 2017 determinou que o risco de propagação era{" "}
              <strong className="text-[var(--foreground)]">
                negligenciável a extremamente baixo
              </strong>
              .
            </p>
          </div>
        </div>

        {/* FONTE: PMC - Tokyo 2020 case (Aida et al. 2023, PMC10534063) */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-red-500/30">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-500 border-2 border-[var(--background)]" />
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-red-400 text-xl sm:text-2xl font-bold font-serif">2020</span>
              <div>
                <span className="text-[var(--foreground)] font-semibold text-sm block">
                  Jogos Olímpicos de Tóquio
                </span>
                <span className="text-[10px] text-red-400">
                  Caso clínico documentado (estudo peer-reviewed)
                </span>
              </div>
            </div>

            <div className="bg-[var(--background-secondary)]/60 rounded-lg p-4 mb-4">
              <p className="text-xs text-[var(--foreground-muted)] mb-1 font-medium">
                Warmblood alemão, 15 anos
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-xs text-[var(--foreground-secondary)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-green-400" />
                  <span>
                    Teste IFAT <strong className="text-green-400">negativo</strong> antes da partida
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-orange-400" />
                  <span>
                    <strong className="text-orange-400">3 dias</strong> após chegada
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={12} className="text-red-400" />
                  <span>
                    Desenvolveu doença <strong className="text-red-400">aguda</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-[var(--background-secondary)]/60 rounded-lg p-3 text-center">
                <Thermometer size={14} className="text-red-400 mx-auto mb-1" />
                <span className="text-lg font-bold text-red-400">40.4°C</span>
                <p className="text-[9px] text-[var(--foreground-muted)] mt-1">Febre</p>
              </div>
              <div className="bg-[var(--background-secondary)]/60 rounded-lg p-3 text-center">
                <Droplets size={14} className="text-red-400 mx-auto mb-1" />
                <span className="text-lg font-bold text-red-400">12.3%</span>
                <p className="text-[9px] text-[var(--foreground-muted)] mt-1">Hematócrito</p>
              </div>
              <div className="bg-[var(--background-secondary)]/60 rounded-lg p-3 text-center">
                <HeartPulse size={14} className="text-green-400 mx-auto mb-1" />
                <span className="text-lg font-bold text-green-400">7L</span>
                <p className="text-[9px] text-[var(--foreground-muted)] mt-1">Transfusão</p>
              </div>
            </div>

            <p className="text-xs text-[var(--foreground-secondary)]">
              Testou positivo para <em className="text-[var(--gold)]">Theileria equi</em> por PCR.
              Tratado com imidocarb. <strong className="text-green-400">Recuperou</strong> e
              regressou sem transmitir a doença.
            </p>
            <p className="text-[11px] text-[var(--foreground-muted)] mt-3 italic border-t border-[var(--border)]/30 pt-3">
              Este caso demonstra como portadores assintomáticos podem testar negativo mas
              desenvolver doença aguda quando stressados pelo transporte.
            </p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-[var(--foreground-muted)]">
        Fontes: Olympics.com, PMC (pmc.ncbi.nlm.nih.gov), Horse Sport (horsesport.com),
        EquiManagement (equimanagement.com)
      </p>
    </div>
  );
}
