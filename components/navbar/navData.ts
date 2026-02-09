import type { LucideIcon } from "lucide-react";
import {
  ShoppingCart,
  Euro,
  Crown,
  MapPin,
  Calendar,
  BookOpen,
  Shield,
  Calculator,
  Scale,
  Dna,
  Users,
  Trophy,
  HelpCircle,
  Home,
  Store,
} from "lucide-react";

export interface NavDropdownItem {
  href: string;
  icon: LucideIcon;
  label: string;
  desc: string;
  iconClass?: string;
}

export interface MobileNavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  highlight?: boolean;
}

export const DB_ITEMS: NavDropdownItem[] = [
  { href: "/comprar", icon: ShoppingCart, label: "Comprar Cavalo", desc: "Cavalos à venda" },
  {
    href: "/vender-cavalo",
    icon: Euro,
    label: "Vender Cavalo",
    desc: "Anuncie aqui",
    iconClass: "text-green-500",
  },
  { href: "/directorio", icon: Crown, label: "Coudelarias", desc: "Diretório completo" },
  { href: "/mapa", icon: MapPin, label: "Mapa", desc: "Mapa interativo" },
  { href: "/eventos", icon: Calendar, label: "Eventos", desc: "Feiras e competições" },
  { href: "/linhagens", icon: BookOpen, label: "Linhagens", desc: "Guia das linhagens" },
  { href: "/piroplasmose", icon: Shield, label: "Piroplasmose", desc: "Saúde e exportação" },
];

export const TOOLS_ITEMS: NavDropdownItem[] = [
  { href: "/calculadora-valor", icon: Calculator, label: "Calculadora", desc: "Estimar valor" },
  { href: "/comparador-cavalos", icon: Scale, label: "Comparador", desc: "Comparar cavalos" },
  {
    href: "/verificador-compatibilidade",
    icon: Dna,
    label: "Compatibilidade",
    desc: "Para criação",
  },
];

export const COMMUNITY_ITEMS: NavDropdownItem[] = [
  {
    href: "/profissionais",
    icon: Users,
    label: "Profissionais",
    desc: "Vets, ferradores, treinadores",
  },
  { href: "/cavalos-famosos", icon: Trophy, label: "Lusitanos Notáveis", desc: "Galeria de honra" },
  {
    href: "/analise-perfil",
    icon: HelpCircle,
    label: "Análise de Perfil",
    desc: "Descubra o seu perfil equestre",
  },
];

export const MOBILE_DB_ITEMS: MobileNavItem[] = [
  { href: "/comprar", icon: ShoppingCart, label: "Comprar Cavalo" },
  { href: "/vender-cavalo", icon: Euro, label: "Vender Cavalo", highlight: true },
  { href: "/directorio", icon: Crown, label: "Coudelarias" },
  { href: "/mapa", icon: MapPin, label: "Mapa" },
  { href: "/eventos", icon: Calendar, label: "Eventos" },
  { href: "/linhagens", icon: BookOpen, label: "Linhagens" },
  { href: "/piroplasmose", icon: Shield, label: "Piroplasmose" },
];

export const MOBILE_TOOLS_ITEMS: MobileNavItem[] = [
  { href: "/calculadora-valor", icon: Calculator, label: "Calculadora" },
  { href: "/comparador-cavalos", icon: Scale, label: "Comparador" },
  { href: "/verificador-compatibilidade", icon: Dna, label: "Compatibilidade" },
  { href: "/analise-perfil", icon: HelpCircle, label: "Análise" },
];

export const MOBILE_COMMUNITY_ITEMS: MobileNavItem[] = [
  { href: "/profissionais", icon: Users, label: "Profissionais" },
  { href: "/cavalos-famosos", icon: Trophy, label: "Lusitanos Notáveis" },
];

export const MAIN_NAV_ITEMS = [
  { nameKey: "home" as const, href: "/" },
  { nameKey: "shop" as const, href: "/loja" },
  { nameKey: "journal" as const, href: "/jornal" },
  { nameKey: "about" as const, href: "/sobre" },
];

export const MOBILE_MAIN_NAV_ITEMS = [
  { nameKey: "home" as const, href: "/", icon: Home },
  { nameKey: "shop" as const, href: "/loja", icon: Store },
  { nameKey: "journal" as const, href: "/jornal", icon: BookOpen },
  { nameKey: "about" as const, href: "/sobre", icon: Users },
];
