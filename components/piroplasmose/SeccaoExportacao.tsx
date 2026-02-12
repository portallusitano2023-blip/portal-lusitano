import {
  Ban,
  FlaskConical,
  Microscope,
  TrendingUp,
  Clock,
  Scale,
  Flag,
  XCircle,
  ShieldAlert,
  Plane,
  AlertTriangle,
} from "lucide-react";

export function SeccaoExportacao() {
  return (
    <div className="space-y-6 text-sm text-[var(--foreground-secondary)] leading-relaxed">
      {/* FONTE: USDA APHIS, Lusitano World */}
      <p className="text-[15px] leading-relaxed">
        A piroplasmose é descrita como a{" "}
        <strong className="text-[var(--foreground)]">
          principal restrição à importação/exportação de cavalos
        </strong>{" "}
        a nível mundial. Vários países exigem testes negativos para{" "}
        <em className="text-[var(--gold)]">T. equi</em> e{" "}
        <em className="text-[var(--gold)]">B. caballi</em> antes de permitirem a entrada.
      </p>

      {/* FONTE: PMC11349644 lista USA, Canada, Japan, New Zealand como piro-free */}
      {/* FONTE: Lusitano Horse Finder lista também Australia, UK, Ireland, Iceland */}
      <div>
        <h3 className="text-[var(--foreground)] font-semibold text-base mb-4 flex items-center gap-2">
          <Ban size={16} className="text-red-400" />
          Países Não-Endémicos (Exigem Teste Negativo)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { pais: "Estados Unidos", bandeira: "US" },
            { pais: "Canadá", bandeira: "CA" },
            { pais: "Austrália", bandeira: "AU" },
            { pais: "Nova Zelândia", bandeira: "NZ" },
            { pais: "Japão", bandeira: "JP" },
            { pais: "Reino Unido", bandeira: "UK" },
            { pais: "Irlanda", bandeira: "IE" },
            { pais: "Islândia", bandeira: "IS" },
          ].map(({ pais }) => (
            <div
              key={pais}
              className="bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2.5 flex items-center gap-2"
            >
              <Ban size={12} className="text-red-400 flex-shrink-0" />
              <span className="text-xs text-red-300 font-medium">{pais}</span>
            </div>
          ))}
        </div>
        {/* FONTE: Lusitano World lista China, Thailand, Mexico como tendo políticas de importação restritivas (mas NÃO são piro-free) */}
        <p className="text-[10px] text-[var(--foreground-muted)] mt-2 ml-1">
          <strong className="text-[var(--foreground-secondary)]">Nota:</strong> China, Tailândia e
          México também exigem testes negativos para importação, apesar de terem populações de
          carraças endémicas.
        </p>
      </div>

      {/* Testes de Exportação */}
      <div>
        <h3 className="text-[var(--foreground)] font-semibold text-base mb-4 flex items-center gap-2">
          <FlaskConical size={16} className="text-[var(--gold)]" />
          Testes de Exportação
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            {
              icone: Microscope,
              titulo: "Testes utilizados",
              valor: "IFAT, cELISA e CFT",
              detalhe: "Imunofluorescência, ELISA competitivo, fixação do complemento",
            },
            {
              icone: TrendingUp,
              titulo: "Limiar de negatividade",
              valor: "< 30%",
              detalhe: "Cavalos devem pontuar abaixo de 30% em todos os testes",
            },
            {
              icone: Clock,
              titulo: "Tempo de resultado",
              valor: "2 a 5 dias",
              detalhe: "Após colheita da amostra sanguínea",
            },
            {
              icone: Scale,
              titulo: "Custo",
              valor: "~60€ a 300€",
              detalhe: "~60€ em Portugal; 200-300€ em laboratórios como Bose (Alemanha)",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[var(--background-card)]/40 border border-[var(--border)]/30 rounded-xl p-4 sm:p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <item.icone size={16} className="text-[var(--gold)]" />
                <span className="text-xs text-[var(--foreground-muted)]">{item.titulo}</span>
              </div>
              <p className="text-[var(--foreground)] font-bold text-lg">{item.valor}</p>
              <p className="text-[11px] text-[var(--foreground-muted)] mt-1">{item.detalhe}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Consequências nos EUA */}
      {/* FONTE: USDA APHIS */}
      <div>
        <h3 className="text-[var(--foreground)] font-semibold text-base mb-4 flex items-center gap-2">
          <Flag size={16} className="text-red-400" />
          Consequências nos EUA
        </h3>
        <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-5 sm:p-6">
          <p className="text-[13px] text-[var(--foreground-secondary)] mb-4">
            Os EUA são um mercado crítico para o Lusitano, especialmente para dressage. Se um cavalo
            testar positivo após a importação:
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icone: XCircle, texto: "Eutanásia", cor: "text-red-500" },
              { icone: ShieldAlert, texto: "Quarentena vitalícia", cor: "text-orange-400" },
              { icone: Plane, texto: "Devolução ao país de origem", cor: "text-yellow-400" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[var(--background-secondary)]/60 rounded-lg p-3 sm:p-4 flex items-center gap-3"
              >
                <item.icone size={18} className={item.cor} />
                <span className="text-sm text-[var(--foreground-secondary)] font-medium">
                  {item.texto}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FONTE: USDA APHIS, DVM360 */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-[var(--background-card)]/40 border border-[var(--border)]/30 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-orange-400" />
            <span className="text-xs font-semibold text-orange-300">Risco do Transporte</span>
          </div>
          <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">
            O stress do transporte pode causar a{" "}
            <strong className="text-[var(--foreground)]">subida dos títulos sanguíneos</strong>{" "}
            acima do limiar de 30%, fazendo com que um cavalo que testou negativo antes da partida
            possa testar positivo à chegada.
          </p>
        </div>
        <div className="bg-[var(--gold)]/8 border border-[var(--gold)]/20 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-[var(--gold)]" />
            <span className="text-xs font-semibold text-[var(--gold)]">Impacto Económico</span>
          </div>
          <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">
            Criadores vendem cada vez mais cavalos &quot;piro-free&quot; como{" "}
            <strong className="text-[var(--foreground)]">categoria premium</strong>, criando duas
            categorias de valor comercial dentro da raça.
          </p>
        </div>
      </div>

      <p className="text-[10px] text-[var(--foreground-muted)]">
        Fontes: USDA APHIS (aphis.usda.gov), DVM360 (dvm360.com), Lusitano World
        (lusitanoworld.com), Lusitano Horse Finder (lusitanohorsefinder.com)
      </p>
    </div>
  );
}
