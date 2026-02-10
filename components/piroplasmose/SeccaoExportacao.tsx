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
    <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
      {/* FONTE: USDA APHIS, Lusitano World */}
      <p className="text-[15px] leading-relaxed">
        A piroplasmose é descrita como a{" "}
        <strong className="text-white">
          principal restrição à importação/exportação de cavalos
        </strong>{" "}
        a nível mundial. Vários países exigem testes negativos para{" "}
        <em className="text-[#C5A059]">T. equi</em> e <em className="text-[#C5A059]">B. caballi</em>{" "}
        antes de permitirem a entrada.
      </p>

      {/* FONTE: PMC11349644 lista USA, Canada, Japan, New Zealand como piro-free */}
      {/* FONTE: Lusitano Horse Finder lista também Australia, UK, Ireland, Iceland */}
      <div>
        <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
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
        <p className="text-[10px] text-zinc-500 mt-2 ml-1">
          <strong className="text-zinc-400">Nota:</strong> China, Tailândia e México também exigem
          testes negativos para importação, apesar de terem populações de carraças endémicas.
        </p>
      </div>

      {/* Testes de Exportação */}
      <div>
        <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
          <FlaskConical size={16} className="text-[#C5A059]" />
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
            <div key={i} className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-2">
                <item.icone size={16} className="text-[#C5A059]" />
                <span className="text-xs text-zinc-500">{item.titulo}</span>
              </div>
              <p className="text-white font-bold text-lg">{item.valor}</p>
              <p className="text-[11px] text-zinc-500 mt-1">{item.detalhe}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Consequências nos EUA */}
      {/* FONTE: USDA APHIS */}
      <div>
        <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
          <Flag size={16} className="text-red-400" />
          Consequências nos EUA
        </h3>
        <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-5 sm:p-6">
          <p className="text-[13px] text-zinc-400 mb-4">
            Os EUA são um mercado crítico para o Lusitano, especialmente para dressage. Se um cavalo
            testar positivo após a importação:
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icone: XCircle, texto: "Eutanásia", cor: "text-red-500" },
              { icone: ShieldAlert, texto: "Quarentena vitalícia", cor: "text-orange-400" },
              { icone: Plane, texto: "Devolução ao país de origem", cor: "text-yellow-400" },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900/60 rounded-lg p-3 sm:p-4 flex items-center gap-3">
                <item.icone size={18} className={item.cor} />
                <span className="text-sm text-zinc-300 font-medium">{item.texto}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FONTE: USDA APHIS, DVM360 */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-orange-400" />
            <span className="text-xs font-semibold text-orange-300">Risco do Transporte</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            O stress do transporte pode causar a{" "}
            <strong className="text-white">subida dos títulos sanguíneos</strong> acima do limiar de
            30%, fazendo com que um cavalo que testou negativo antes da partida possa testar
            positivo à chegada.
          </p>
        </div>
        <div className="bg-[#C5A059]/8 border border-[#C5A059]/20 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-[#C5A059]" />
            <span className="text-xs font-semibold text-[#C5A059]">Impacto Económico</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Criadores vendem cada vez mais cavalos &quot;piro-free&quot; como{" "}
            <strong className="text-white">categoria premium</strong>, criando duas categorias de
            valor comercial dentro da raça.
          </p>
        </div>
      </div>

      <p className="text-[10px] text-zinc-600">
        Fontes: USDA APHIS (aphis.usda.gov), DVM360 (dvm360.com), Lusitano World
        (lusitanoworld.com), Lusitano Horse Finder (lusitanohorsefinder.com)
      </p>
    </div>
  );
}
