import type { Cavalo } from "./types";

// ============================================
// DADOS — Verificador de Compatibilidade
// ============================================

export const criarCavalo = (sexo: "Garanhão" | "Égua"): Cavalo => ({
  nome: "",
  sexo,
  idade: sexo === "Garanhão" ? 8 : 7,
  altura: sexo === "Garanhão" ? 163 : 158,
  pelagem: "Ruço",
  genetica: { extension: "Ee", agouti: "Aa", grey: "Gg", cream: "NN", dun: "dd" },
  linhagem: "Certificada",
  linhagemFamosa: "veiga",
  coudelaria: "Particular",
  conformacao: 7,
  andamentos: 7,
  temperamento: "Equilibrado",
  saude: 8,
  fertilidade: "Normal",
  blup: 100,
  coi: 4,
  defeitos: [],
  aprovado: true,
  matingsRealizados: 0,
  potradasNascidos: 0,
});

export const COUDELARIAS = [
  { value: "Veiga", label: "Coudelaria Veiga", labelEn: "Veiga Stud", labelEs: "Yeguada Veiga", familia: "veiga" },
  { value: "Andrade", label: "Coudelaria Andrade", labelEn: "Andrade Stud", labelEs: "Yeguada Andrade", familia: "andrade" },
  { value: "Alter Real", label: "Alter Real", labelEn: "Alter Real", labelEs: "Alter Real", familia: "alter" },
  { value: "Interagro", label: "Interagro", labelEn: "Interagro", labelEs: "Interagro", familia: "interagro" },
  { value: "Lezírias", label: "Companhia das Lezírias", labelEn: "Lezírias Company", labelEs: "Compañía das Lezírias", familia: "lezirias" },
  { value: "Particular", label: "Criador Particular", labelEn: "Private Breeder", labelEs: "Criador Particular", familia: "particular" },
];

export const LINHAGENS = [
  { value: "Desconhecida", label: "Desconhecida", labelEn: "Unknown", labelEs: "Desconocida", mult: 0.6 },
  { value: "Comum", label: "Comum", labelEn: "Common", labelEs: "Común", mult: 0.8 },
  { value: "Registada", label: "Registada APSL", labelEn: "Registered APSL", labelEs: "Registrada APSL", mult: 1.0 },
  { value: "Certificada", label: "Certificada", labelEn: "Certified", labelEs: "Certificada", mult: 1.2 },
  { value: "Premium", label: "Premium", labelEn: "Premium", labelEs: "Premium", mult: 1.5 },
  { value: "Elite", label: "Elite", labelEn: "Elite", labelEs: "Élite", mult: 2.0 },
];

export const LINHAGENS_FAMOSAS = [
  { value: "veiga", label: "Veiga", labelEn: "Veiga", labelEs: "Veiga", desc: "Alta Escola, piaffé natural", descEn: "Haute Ecole, natural piaffe", descEs: "Alta Escuela, piaffé natural" },
  { value: "andrade", label: "Andrade", labelEn: "Andrade", labelEs: "Andrade", desc: "Força e trabalho", descEn: "Strength and work", descEs: "Fuerza y trabajo" },
  { value: "alter", label: "Alter Real", labelEn: "Alter Real", labelEs: "Alter Real", desc: "Tradição Real", descEn: "Royal tradition", descEs: "Tradición Real" },
  { value: "interagro", label: "Interagro", labelEn: "Interagro", labelEs: "Interagro", desc: "Programa genético brasileiro", descEn: "Brazilian genetic program", descEs: "Programa genético brasileño" },
  { value: "coudelaria_nacional", label: "Coudelaria Nacional", labelEn: "National Stud", labelEs: "Yeguada Nacional", desc: "Versatilidade", descEn: "Versatility", descEs: "Versatilidad" },
  { value: "infante_camara", label: "Infante da Câmara", labelEn: "Infante da Câmara", labelEs: "Infante da Câmara", desc: "Refinamento", descEn: "Refinement", descEs: "Refinamiento" },
  { value: "outra", label: "Outra / Mista", labelEn: "Other / Mixed", labelEs: "Otra / Mixta", desc: "Linhagem diversa", descEn: "Mixed lineage", descEs: "Linaje diverso" },
];

export const TEMPERAMENTOS = [
  { value: "Calmo", label: "Calmo", labelEn: "Calm", labelEs: "Calmado", desc: "Muito dócil", descEn: "Very docile", descEs: "Muy dócil" },
  { value: "Equilibrado", label: "Equilibrado", labelEn: "Balanced", labelEs: "Equilibrado", desc: "Ideal para reprodução", descEn: "Ideal for breeding", descEs: "Ideal para reproducción" },
  { value: "Energético", label: "Energético", labelEn: "Energetic", labelEs: "Enérgico", desc: "Vivo mas cooperativo", descEn: "Lively but cooperative", descEs: "Vivo pero cooperativo" },
  { value: "Nervoso", label: "Nervoso", labelEn: "Nervous", labelEs: "Nervioso", desc: "Sensível, requer experiência", descEn: "Sensitive, requires experience", descEs: "Sensible, requiere experiencia" },
];

export const FERTILIDADES = [
  { value: "Muito Alta", label: "Muito Alta", labelEn: "Very High", labelEs: "Muy Alta", mult: 1.3 },
  { value: "Alta", label: "Alta", labelEn: "High", labelEs: "Alta", mult: 1.15 },
  { value: "Normal", label: "Normal", labelEn: "Normal", labelEs: "Normal", mult: 1.0 },
  { value: "Baixa", label: "Baixa", labelEn: "Low", labelEs: "Baja", mult: 0.7 },
];

export const DEFEITOS_GENETICOS = [
  { value: "WFFS", label: "WFFS Portador", labelEn: "WFFS Carrier", labelEs: "WFFS Portador", desc: "Síndrome do Potro Frágil", descEn: "Warmblood Fragile Foal Syndrome", descEs: "Síndrome del Potro Frágil", risco: "alto" },
  {
    value: "HYPP",
    label: "HYPP (raro em PSL)",
    labelEn: "HYPP (rare in PSL)",
    labelEs: "HYPP (raro en PSL)",
    desc: "Paralisia Periódica Hipercalémica — comum em Quarter Horse/Paint, raro em Lusitano",
    descEn: "Hyperkalemic Periodic Paralysis — common in Quarter Horse/Paint, rare in Lusitano",
    descEs: "Parálisis Periódica Hipercalémica — común en Quarter Horse/Paint, raro en Lusitano",
    risco: "alto",
  },
  { value: "Lordose", label: "Lordose", labelEn: "Lordosis", labelEs: "Lordosis", desc: "Curvatura anormal da coluna", descEn: "Abnormal spinal curvature", descEs: "Curvatura anormal de la columna", risco: "medio" },
  { value: "OCD", label: "OCD", labelEn: "OCD", labelEs: "OCD", desc: "Osteocondrite Dissecante", descEn: "Osteochondritis Dissecans", descEs: "Osteocondritis Disecante", risco: "medio" },
  { value: "Navicular", label: "Síndrome Navicular", labelEn: "Navicular Syndrome", labelEs: "Síndrome Navicular", desc: "Problema podal", descEn: "Hoof problem", descEs: "Problema podal", risco: "medio" },
  {
    value: "EMS",
    label: "EMS/Síndrome Metabólico",
    labelEn: "EMS/Metabolic Syndrome",
    labelEs: "EMS/Síndrome Metabólico",
    desc: "Resistência à insulina equina",
    descEn: "Equine insulin resistance",
    descEs: "Resistencia a la insulina equina",
    risco: "medio",
  },
  {
    value: "Laminite",
    label: "Pred. Laminite",
    labelEn: "Laminitis Pred.",
    labelEs: "Pred. Laminitis",
    desc: "Predisposição genética a laminite crónica",
    descEn: "Genetic predisposition to chronic laminitis",
    descEs: "Predisposición genética a laminitis crónica",
    risco: "medio",
  },
  {
    value: "EPM",
    label: "Pred. EPM",
    labelEn: "EPM Pred.",
    labelEs: "Pred. EPM",
    desc: "Susceptibilidade a Mieloencefalite Protozoária",
    descEn: "Susceptibility to Protozoal Myeloencephalitis",
    descEs: "Susceptibilidad a Mieloencefalitis Protozoaria",
    risco: "medio",
  },
  {
    value: "DPOC",
    label: "DPOC/RAO",
    labelEn: "COPD/RAO",
    labelEs: "EPOC/RAO",
    desc: "Doença obstrutiva crónica das vias aéreas",
    descEn: "Chronic obstructive airway disease",
    descEs: "Enfermedad obstructiva crónica de las vías aéreas",
    risco: "baixo",
  },
  {
    value: "Melanoma",
    label: "Predisposição Melanoma",
    labelEn: "Melanoma Predisposition",
    labelEs: "Predisposición Melanoma",
    desc: "Em ruços — melanoma dérmico",
    descEn: "In greys — dermal melanoma",
    descEs: "En ruanos — melanoma dérmico",
    risco: "baixo",
  },
];

/** Pick the right label based on language */
export function localizedLabel(item: { label: string; labelEn?: string; labelEs?: string }, lang?: string): string {
  if (lang === "en" && item.labelEn) return item.labelEn;
  if (lang === "es" && item.labelEs) return item.labelEs;
  return item.label;
}

/** Pick the right desc based on language */
export function localizedDesc(item: { desc: string; descEn?: string; descEs?: string }, lang?: string): string {
  if (lang === "en" && item.descEn) return item.descEn;
  if (lang === "es" && item.descEs) return item.descEs;
  return item.desc;
}