import { FileText, ExternalLink } from "lucide-react";

const fontes = [
  { nome: "USDA APHIS", desc: "Departamento de Agricultura dos EUA" },
  { nome: "WOAH (OIE)", desc: "Organização Mundial de Saúde Animal" },
  { nome: "PubMed / PMC", desc: "Estudos veterinários peer-reviewed" },
  { nome: "Frontiers in Veterinary Science", desc: "Journal científico" },
  { nome: "ScienceDirect", desc: "Estudo prevalência Portugal (5 anos)" },
  { nome: "FEI", desc: "Federação Equestre Internacional" },
  { nome: "Lusitano Horse Finder", desc: "Portal especializado Lusitano" },
  { nome: "Lusitano World", desc: "Recurso internacional Lusitano" },
  { nome: "Horse Sport", desc: "Notícias desporto equestre" },
  { nome: "EquiManagement", desc: "Gestão equina profissional" },
  { nome: "Olympics.com", desc: "Comité Olímpico Internacional" },
  { nome: "DVM360", desc: "Publicação veterinária" },
];

export function SeccaoFontes() {
  return (
    <div className="max-w-4xl mx-auto mt-12">
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-[#C5A059] mb-4 flex items-center gap-2">
          <FileText size={16} />
          Fontes e Referências
        </h3>
        <div className="grid sm:grid-cols-2 gap-2 text-xs text-zinc-500">
          {fontes.map((fonte, i) => (
            <div key={i} className="flex items-start gap-2">
              <ExternalLink size={10} className="text-zinc-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-zinc-400">{fonte.nome}</span>
                <span className="text-zinc-600"> — {fonte.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-zinc-600 mt-4 pt-4 border-t border-zinc-800">
          Toda a informação nesta página foi verificada a partir de fontes escritas credíveis.
          Nenhuma informação foi inventada ou assumida.
        </p>
      </div>
    </div>
  );
}
