import type { Cavalo } from "./types";

// ============================================
// DADOS - Verificador de Compatibilidade
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
});

export const COUDELARIAS = [
  { value: "Veiga", label: "Coudelaria Veiga", familia: "veiga" },
  { value: "Andrade", label: "Coudelaria Andrade", familia: "andrade" },
  { value: "Alter Real", label: "Alter Real", familia: "alter" },
  { value: "Interagro", label: "Interagro", familia: "interagro" },
  { value: "Lezírias", label: "Companhia das Lezírias", familia: "lezirias" },
  { value: "Particular", label: "Criador Particular", familia: "particular" },
];

export const LINHAGENS = [
  { value: "Desconhecida", label: "Desconhecida", mult: 0.6 },
  { value: "Comum", label: "Comum", mult: 0.8 },
  { value: "Registada", label: "Registada APSL", mult: 1.0 },
  { value: "Certificada", label: "Certificada", mult: 1.2 },
  { value: "Premium", label: "Premium", mult: 1.5 },
  { value: "Elite", label: "Elite", mult: 2.0 },
];

export const LINHAGENS_FAMOSAS = [
  { value: "veiga", label: "Veiga", desc: "Alta Escola, piaffé natural" },
  { value: "andrade", label: "Andrade", desc: "Força e trabalho" },
  { value: "alter", label: "Alter Real", desc: "Tradição Real" },
  { value: "coudelaria_nacional", label: "Coudelaria Nacional", desc: "Versatilidade" },
  { value: "infante_camara", label: "Infante da Câmara", desc: "Refinamento" },
  { value: "outra", label: "Outra / Mista", desc: "Linhagem diversa" },
];

export const TEMPERAMENTOS = [
  { value: "Calmo", label: "Calmo", desc: "Muito dócil" },
  { value: "Equilibrado", label: "Equilibrado", desc: "Ideal para reprodução" },
  { value: "Energético", label: "Energético", desc: "Vivo mas cooperativo" },
  { value: "Nervoso", label: "Nervoso", desc: "Sensível, requer experiência" },
];

export const FERTILIDADES = [
  { value: "Muito Alta", label: "Muito Alta", mult: 1.3 },
  { value: "Alta", label: "Alta", mult: 1.15 },
  { value: "Normal", label: "Normal", mult: 1.0 },
  { value: "Baixa", label: "Baixa", mult: 0.7 },
];

export const DEFEITOS_GENETICOS = [
  { value: "WFFS", label: "WFFS Portador", desc: "Síndrome do Potro Frágil", risco: "alto" },
  { value: "HYPP", label: "HYPP", desc: "Paralisia Periódica Hipercalémica", risco: "alto" },
  { value: "Lordose", label: "Lordose", desc: "Curvatura anormal da coluna", risco: "medio" },
  { value: "OCD", label: "OCD", desc: "Osteocondrite Dissecante", risco: "medio" },
  { value: "Navicular", label: "Síndrome Navicular", desc: "Problema podal", risco: "medio" },
  {
    value: "EMS",
    label: "EMS/Síndrome Metabólico",
    desc: "Resistência à insulina equina",
    risco: "medio",
  },
  {
    value: "Laminite",
    label: "Pred. Laminite",
    desc: "Predisposição genética a laminite crónica",
    risco: "medio",
  },
  {
    value: "EPM",
    label: "Pred. EPM",
    desc: "Susceptibilidade a Mieloencefalite Protozoária",
    risco: "medio",
  },
  {
    value: "DPOC",
    label: "DPOC/RAO",
    desc: "Doença obstrutiva crónica das vias aéreas",
    risco: "baixo",
  },
  {
    value: "Melanoma",
    label: "Predisposição Melanoma",
    desc: "Em ruços — melanoma dérmico",
    risco: "baixo",
  },
];
