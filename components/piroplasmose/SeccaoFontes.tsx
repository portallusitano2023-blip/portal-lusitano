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
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-[var(--gold)] mb-4 flex items-center gap-2">
          <FileText size={16} />
          Fontes e Referências
        </h3>
        <div className="grid sm:grid-cols-2 gap-2 text-xs text-[var(--foreground-muted)]">
          {fontes.map((fonte, i) => (
            <div key={i} className="flex items-start gap-2">
              <ExternalLink
                size={10}
                className="text-[var(--foreground-muted)] mt-0.5 flex-shrink-0"
              />
              <div>
                <span className="text-[var(--foreground-secondary)]">{fonte.nome}</span>
                <span className="text-[var(--foreground-muted)]"> — {fonte.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[var(--foreground-muted)] mt-4 pt-4 border-t border-[var(--border)]">
          Toda a informação nesta página foi verificada a partir de fontes escritas credíveis.
          Nenhuma informação foi inventada ou assumida.
        </p>
      </div>
    </div>
  );
}
