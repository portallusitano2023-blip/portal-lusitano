import {
  Globe,
  Shield,
  ShieldAlert,
  FileText,
  Clock,
  Bug,
  Flag,
  FlaskConical,
  Syringe,
  CheckCircle2,
} from "lucide-react";

export function SeccaoRegulamentacao() {
  return (
    <div className="space-y-6 text-sm text-[var(--foreground-secondary)] leading-relaxed">
      <div className="grid gap-4">
        {/* FONTE: WOAH */}
        <div className="bg-[var(--background-card)]/40 border border-[var(--border)]/30 rounded-xl overflow-hidden">
          <div className="bg-[var(--gold)]/10 px-5 py-3 flex items-center gap-3 border-b border-[var(--border)]/30">
            <Globe size={16} className="text-[var(--gold)]" />
            <span className="text-sm font-semibold text-[var(--foreground)]">
              WOAH (Organização Mundial de Saúde Animal)
            </span>
          </div>
          <div className="p-5 space-y-3">
            {[
              {
                icone: ShieldAlert,
                texto: "Doença de notificação obrigatória",
                destaque: true,
              },
              {
                icone: FileText,
                texto: "Regulada pelo Capítulo 12.7 do Código Sanitário para Animais Terrestres",
              },
              // FONTE: WOAH Artigo 12.7.5 - "blood sample taken within the 14 days prior to shipment"
              {
                icone: Clock,
                texto: "Testes negativos obrigatórios nos 14 dias antes do envio",
                destaque: true,
              },
              // FONTE: WOAH - 30 dias livres de carraças antes da colheita de sangue, e desde a colheita até ao envio
              {
                icone: Bug,
                texto:
                  "Animais livres de carraças 30 dias antes da colheita de sangue e desde a colheita até ao envio",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icone
                  size={14}
                  className={`mt-0.5 flex-shrink-0 ${item.destaque ? "text-[var(--gold)]" : "text-[var(--foreground-muted)]"}`}
                />
                <span
                  className={`text-[13px] ${item.destaque ? "text-[var(--foreground)] font-medium" : "text-[var(--foreground-secondary)]"}`}
                >
                  {item.texto}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FONTE: USDA APHIS */}
        <div className="bg-[var(--background-card)]/40 border border-[var(--border)]/30 rounded-xl overflow-hidden">
          <div className="bg-blue-500/10 px-5 py-3 flex items-center gap-3 border-b border-[var(--border)]/30">
            <Flag size={16} className="text-blue-400" />
            <span className="text-sm font-semibold text-[var(--foreground)]">
              USDA (Estados Unidos)
            </span>
          </div>
          <div className="p-5 space-y-3">
            {[
              {
                icone: ShieldAlert,
                texto: "Classificada como doença animal estrangeira de notificação obrigatória",
                destaque: true,
              },
              {
                icone: FlaskConical,
                texto: "Todos os cavalos importados devem testar negativo (CFT e cELISA)",
              },
              {
                icone: Clock,
                texto: "Se não-negativos: quarentena até 28 dias com reteste a cada 14 dias",
              },
              {
                icone: Syringe,
                texto: "Programa de tratamento USDA-APHIS disponível para cavalos positivos",
                destaque: true,
              },
              {
                icone: CheckCircle2,
                texto: "Admissão temporária sob protocolos especiais para eventos internacionais",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icone
                  size={14}
                  className={`mt-0.5 flex-shrink-0 ${item.destaque ? "text-blue-400" : "text-[var(--foreground-muted)]"}`}
                />
                <span
                  className={`text-[13px] ${item.destaque ? "text-[var(--foreground)] font-medium" : "text-[var(--foreground-secondary)]"}`}
                >
                  {item.texto}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* EU */}
        <div className="bg-[var(--background-card)]/40 border border-[var(--border)]/30 rounded-xl overflow-hidden">
          <div className="bg-blue-600/10 px-5 py-3 flex items-center gap-3 border-b border-[var(--border)]/30">
            <Shield size={16} className="text-blue-300" />
            <span className="text-sm font-semibold text-[var(--foreground)]">União Europeia</span>
          </div>
          <div className="p-5">
            <p className="text-[13px] text-[var(--foreground-secondary)] leading-relaxed">
              Dentro da UE, a movimentação de cavalos entre estados membros{" "}
              <strong className="text-[var(--foreground)]">não requer teste de piroplasmose</strong>
              . No entanto, cavalos de países endémicos da UE (como Portugal e Espanha) para países
              não-endémicos ou para nações fora da UE devem cumprir os requisitos específicos do
              país importador.
            </p>
          </div>
        </div>
      </div>

      {/* Países não-endémicos */}
      <div>
        <h3 className="text-[var(--foreground)] font-semibold text-base mb-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-400" />
          Países Considerados Não-Endémicos
        </h3>
        {/* FONTE: PMC11349644 (USA, Canada, Japan, New Zealand), Lusitano Horse Finder (+ Australia, UK, Ireland, Iceland) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            "EUA",
            "Canadá",
            "Austrália",
            "Nova Zelândia",
            "Japão",
            "Reino Unido",
            "Irlanda",
            "Islândia",
          ].map((pais) => (
            <div
              key={pais}
              className="bg-green-500/5 border border-green-500/15 rounded-lg px-3 py-2.5 flex items-center gap-2"
            >
              <Shield size={12} className="text-green-400 flex-shrink-0" />
              <span className="text-xs text-green-300 font-medium">{pais}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-[var(--foreground-muted)]">
        Fontes: WOAH (woah.org), USDA APHIS (aphis.usda.gov), FEI (fei.org)
      </p>
    </div>
  );
}
