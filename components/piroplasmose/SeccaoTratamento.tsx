import { CheckCircle2, XCircle, AlertTriangle, CircleDot, Scale } from "lucide-react";

export function SeccaoTratamento() {
  return (
    <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
      {/* FONTE: PMC/PubMed, Frontiers, Lusitano World */}
      <p className="text-[15px] leading-relaxed">
        O <strong className="text-white">dipropionato de imidocarb</strong> é o tratamento de
        referência mundial. No entanto, apresenta limitações significativas.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={16} className="text-green-400" />
            <span className="text-sm font-semibold text-green-300">Eficácia</span>
          </div>
          <div className="space-y-3">
            {[
              { texto: "Eficaz contra B. caballi", bom: true },
              { texto: "T. equi é notavelmente mais difícil de eliminar", bom: false },
              { texto: "T. haneyi mostra resistência ao imidocarb", bom: false },
              { texto: "Falhas de tratamento documentadas", bom: false },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                {item.bom ? (
                  <CheckCircle2 size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle size={12} className="text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <span className="text-xs text-zinc-400">{item.texto}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-red-400" />
            <span className="text-sm font-semibold text-red-300">Efeitos Secundários</span>
          </div>
          <div className="space-y-3">
            {[
              "Agitação e sudorese",
              "Cólica e diarreia",
              "Toxicidade hepática",
              "Toxicidade renal",
              "Requer pré-medicação anticolinérgica",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CircleDot size={10} className="text-red-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-zinc-400">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FONTE: Lusitano World */}
      <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-5 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <p className="text-red-300 font-semibold text-sm mb-2">Aviso: Lusitano World</p>
            <p className="text-[13px] text-zinc-400 leading-relaxed">
              <strong className="text-red-300">Desaconselha fortemente</strong> a compra de cavalos
              piro-positivos com a intenção de os tratar e depois exportar, citando efeitos
              secundários graves e a impraticabilidade de reduzir os títulos sanguíneos abaixo dos
              limiares de exportação.
            </p>
          </div>
        </div>
      </div>

      {/* FONTE: FEI Vet Regs 2026 */}
      <div className="bg-[#C5A059]/8 border border-[#C5A059]/20 rounded-xl p-5 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 flex items-center justify-center flex-shrink-0">
            <Scale size={18} className="text-[#C5A059]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[#C5A059] font-semibold text-sm">Regulamentação FEI 2026</p>
              <span className="text-[9px] bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded-full font-bold">
                NOVO
              </span>
            </div>
            <p className="text-[13px] text-zinc-400 leading-relaxed">
              A partir de <strong className="text-white">1 de Janeiro de 2026</strong>, a FEI
              adicionou o imidocarb como{" "}
              <strong className="text-[#C5A059]">Medicação Controlada</strong> sob as
              regulamentações EADCM. Pode ser administrado a cavalos de competição sob condições
              reguladas, com notificação obrigatória aos delegados veterinários e restrições
              temporais relativas à competição.
            </p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-zinc-600">
        Fontes: PMC/PubMed (pmc.ncbi.nlm.nih.gov), Frontiers in Veterinary Science
        (frontiersin.org), Lusitano World (lusitanoworld.com), FEI Veterinary Regulations 2026
        (fei.org)
      </p>
    </div>
  );
}
