import { AlertTriangle, FlaskConical, Info } from "lucide-react";
import { EstudoCard } from "./EstudoCard";

export function SeccaoPortugal() {
  return (
    <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
      <p className="text-[15px] leading-relaxed">
        A piroplasmose é <strong className="text-white">endémica</strong> em Portugal e Espanha,
        onde as carraças vectoras estão amplamente estabelecidas. A maioria dos cavalos nascidos em
        pastagens portuguesas é exposta ao parasita enquanto jovem, desenvolvendo anticorpos.
      </p>

      {/* FONTE: Lusitano Horse Finder */}
      <div className="bg-[#C5A059]/8 border border-[#C5A059]/20 rounded-xl p-5 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-[#C5A059]" />
          </div>
          <div>
            <p className="text-[#C5A059] font-semibold text-sm mb-2">O Problema Central</p>
            <p className="text-zinc-400 text-[13px] leading-relaxed">
              Um Lusitano perfeitamente saudável, que simplesmente cresceu em pastagens portuguesas,
              pode testar <strong className="text-white">positivo para anticorpos</strong> de
              piroplasmose e ser automaticamente{" "}
              <strong className="text-white">impedido de ser exportado</strong> para países livres
              da doença, como os EUA, Canadá, Austrália ou Japão.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-white font-semibold text-base flex items-center gap-2">
        <FlaskConical size={16} className="text-[#C5A059]" />
        Estudos Científicos Publicados
      </h3>

      {/* FONTE: Cabete et al. 2024 (DOI: 10.1016/j.vetpar.2024.110378, PMID: 39721257) - 3063 registos */}
      {/* FONTE: Ribeiro et al. 2013 (DOI: 10.1007/s00436-013-3429-9, PMID: 23591484) - 162 cavalos */}
      {/* FONTE: Fuehrer et al. 2020 (Frontiers Vet Sci, DOI: 10.3389/fvets.2020.591943) - 101 cavalos militares Lisboa */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <EstudoCard
          regiao="Portugal Nacional"
          metodo="cELISA"
          tEqui="32.7%"
          bCaballi="15.7%"
          fonte="Cabete et al., Veterinary Parasitology, 2024 (n=3063, estudo 5 anos)"
        />
        <EstudoCard
          regiao="Norte de Portugal"
          metodo="Serologia"
          tEqui="17.9%"
          bCaballi="11.1%"
          fonte="Ribeiro et al., Parasitology Research, 2013 (n=162)"
        />
        <EstudoCard
          regiao="Lisboa (Militares)"
          metodo="qPCR"
          tEqui="32.7%"
          bCaballi="0%"
          fonte="Fuehrer et al., Frontiers Vet Sci, 2020 (n=101)"
        />
      </div>

      <div className="bg-zinc-800/40 rounded-xl p-4 sm:p-5 border border-zinc-700/30">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
          <div>
            {/* FONTE: Cabete et al. 2024 - "location was found to play a significant role" */}
            <p className="text-xs text-zinc-400 leading-relaxed">
              <strong className="text-white">Nota:</strong> A prevalência varia significativamente
              por região. O estudo de Cabete et al. (2024) confirma que a localização geográfica é
              um factor significativo na seroprevalência. A co-infecção por ambos os parasitas foi
              registada em <strong className="text-white">7.4%</strong> dos casos analisados.
            </p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-zinc-600">
        Fontes: ScienceDirect (sciencedirect.com), PubMed (pubmed.ncbi.nlm.nih.gov), Frontiers in
        Veterinary Science (frontiersin.org), Lusitano Horse Finder (lusitanohorsefinder.com)
      </p>
    </div>
  );
}
