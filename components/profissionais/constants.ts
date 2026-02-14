import {
  Briefcase,
  Stethoscope,
  Hammer,
  GraduationCap,
  Camera,
  Scissors,
  Shield,
  ShieldCheck,
  Award,
  Crown,
  Scan,
  Activity,
  Pill,
  Microscope,
  Truck,
  Scale,
  BookOpen,
  Wrench,
  HandHeart,
  Sparkles,
  Wheat,
  ShoppingBag,
  Building2,
  Home,
  Handshake,
  TreePine,
  HeartPulse,
  Flower2,
} from "lucide-react";
import type { CategoriaProf, Modalidade, NivelVerificacao, NivelExpertise } from "./types";

// =============================================================================
// CONSTANTES - Profissionais
// =============================================================================

export const categorias: {
  id: CategoriaProf | "todos";
  label: string;
  icon: typeof Briefcase;
  descricao: string;
}[] = [
  { id: "todos", label: "Todos", icon: Briefcase, descricao: "Ver todos os profissionais" },
  {
    id: "veterinario",
    label: "Veterinários",
    icon: Stethoscope,
    descricao: "Medicina equina geral e especializada",
  },
  {
    id: "ferrador",
    label: "Ferradores",
    icon: Hammer,
    descricao: "Ferração normal, ortopédica e correctiva",
  },
  {
    id: "treinador",
    label: "Treinadores",
    icon: GraduationCap,
    descricao: "Dressage, Working Equitation, Salto",
  },
  {
    id: "dentista",
    label: "Dentistas Equinos",
    icon: Scan,
    descricao: "Odontologia equina especializada",
  },
  {
    id: "quiropratico",
    label: "Quiropráticos",
    icon: Activity,
    descricao: "Quiroprática e osteopatia equina",
  },
  {
    id: "nutricionista",
    label: "Nutricionistas",
    icon: Pill,
    descricao: "Nutrição e suplementação equina",
  },
  {
    id: "inseminador",
    label: "Inseminadores",
    icon: Microscope,
    descricao: "Reprodução assistida e IA",
  },
  { id: "fotografo", label: "Fotógrafos", icon: Camera, descricao: "Fotografia e vídeo equestre" },
  {
    id: "transportador",
    label: "Transportadores",
    icon: Truck,
    descricao: "Transporte nacional e internacional",
  },
  { id: "juiz", label: "Juízes", icon: Scale, descricao: "Juízes de concurso e morfologia" },
  { id: "instrutor", label: "Instrutores", icon: BookOpen, descricao: "Ensino de equitação" },
  { id: "seleiro", label: "Seleiros", icon: Wrench, descricao: "Selaria e equipamento equestre" },
  { id: "tosquiador", label: "Tosquiadores", icon: Scissors, descricao: "Tosquia profissional" },
  {
    id: "massagista",
    label: "Massagistas",
    icon: HandHeart,
    descricao: "Massagem e fisioterapia equina",
  },
  {
    id: "groomer",
    label: "Groomers",
    icon: Sparkles,
    descricao: "Tratamento e cuidado diário de cavalos",
  },
  {
    id: "fornecedor_racoes",
    label: "Rações e Alimentação",
    icon: Wheat,
    descricao: "Rações, feno, suplementos",
  },
  {
    id: "loja_equipamento",
    label: "Lojas de Equipamento",
    icon: ShoppingBag,
    descricao: "Equipamento e acessórios equestres",
  },
  {
    id: "centro_hipico",
    label: "Centros Hípicos",
    icon: Building2,
    descricao: "Escolas, manèges, instalações",
  },
  {
    id: "hospedagem",
    label: "Pensão/Hospedagem",
    icon: Home,
    descricao: "Alojamento e pensão para cavalos",
  },
  {
    id: "seguros",
    label: "Seguros Equestres",
    icon: ShieldCheck,
    descricao: "Seguros para cavalos e actividades",
  },
  {
    id: "mediador",
    label: "Mediadores",
    icon: Handshake,
    descricao: "Compra, venda e intermediação",
  },
  {
    id: "desbastador",
    label: "Desbastadores",
    icon: TreePine,
    descricao: "Desbaste e doma inicial",
  },
  {
    id: "fisioterapeuta",
    label: "Fisioterapeutas",
    icon: HeartPulse,
    descricao: "Fisioterapia e reabilitação equina",
  },
  {
    id: "terapeuta_alternativo",
    label: "Terapias Alternativas",
    icon: Flower2,
    descricao: "Acupuntura, homeopatia, holísticas",
  },
];

export const modalidades: {
  id: Modalidade;
  label: string;
  descricao: string;
}[] = [
  {
    id: "presencial",
    label: "Presencial",
    descricao: "Atendimento local em Portugal",
  },
  {
    id: "online",
    label: "Online",
    descricao: "Aulas e serviços remotos",
  },
  {
    id: "clinicas_internacionais",
    label: "Clínicas Internacionais",
    descricao: "Clínicas e workshops pelo mundo",
  },
];

export const distritos = [
  "Todos",
  "Aveiro",
  "Beja",
  "Braga",
  "Bragança",
  "Castelo Branco",
  "Coimbra",
  "Évora",
  "Faro",
  "Guarda",
  "Leiria",
  "Lisboa",
  "Portalegre",
  "Porto",
  "Santarém",
  "Setúbal",
  "Viana do Castelo",
  "Vila Real",
  "Viseu",
  "Açores",
  "Madeira",
];

export const VERIFICACAO_CONFIG: Record<
  NivelVerificacao,
  {
    cor: string;
    bg: string;
    icon: typeof Shield;
    label: string;
    descricao: string;
  }
> = {
  basico: {
    cor: "text-zinc-400",
    bg: "bg-zinc-800",
    icon: Shield,
    label: "Perfil Básico",
    descricao: "Perfil registado",
  },
  verificado: {
    cor: "text-blue-400",
    bg: "bg-blue-500/20",
    icon: ShieldCheck,
    label: "Verificado",
    descricao: "Identidade confirmada",
  },
  certificado: {
    cor: "text-[#C5A059]",
    bg: "bg-[#C5A059]/20",
    icon: Award,
    label: "Certificado",
    descricao: "Credenciais validadas",
  },
  expert: {
    cor: "text-purple-400",
    bg: "bg-purple-500/20",
    icon: Crown,
    label: "Expert",
    descricao: "Top profissional",
  },
};

export const EXPERTISE_CONFIG: Record<
  NivelExpertise,
  { cor: string; label: string; percent: number }
> = {
  iniciante: { cor: "bg-zinc-600", label: "Iniciante", percent: 25 },
  intermedio: { cor: "bg-blue-500", label: "Intermédio", percent: 50 },
  avancado: { cor: "bg-[#C5A059]", label: "Avançado", percent: 75 },
  especialista: { cor: "bg-purple-500", label: "Especialista", percent: 100 },
};
