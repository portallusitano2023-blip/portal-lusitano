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

interface NavTranslations {
  buy_horse: string;
  buy_horse_desc: string;
  sell_horse: string;
  sell_horse_desc: string;
  studs: string;
  studs_desc: string;
  map: string;
  map_desc: string;
  events: string;
  events_desc: string;
  lineages: string;
  lineages_desc: string;
  piroplasmosis: string;
  piroplasmosis_desc: string;
  calculator: string;
  calculator_desc: string;
  comparator: string;
  comparator_desc: string;
  compatibility: string;
  compatibility_desc: string;
  professionals: string;
  professionals_desc: string;
  notable_lusitanos: string;
  notable_lusitanos_desc: string;
  profile_analysis: string;
  profile_analysis_desc: string;
}

export function getDbItems(nav: NavTranslations): NavDropdownItem[] {
  return [
    { href: "/comprar", icon: ShoppingCart, label: nav.buy_horse, desc: nav.buy_horse_desc },
    {
      href: "/vender-cavalo",
      icon: Euro,
      label: nav.sell_horse,
      desc: nav.sell_horse_desc,
      iconClass: "text-green-500",
    },
    { href: "/directorio", icon: Crown, label: nav.studs, desc: nav.studs_desc },
    { href: "/mapa", icon: MapPin, label: nav.map, desc: nav.map_desc },
    { href: "/eventos", icon: Calendar, label: nav.events, desc: nav.events_desc },
    { href: "/linhagens", icon: BookOpen, label: nav.lineages, desc: nav.lineages_desc },
    { href: "/piroplasmose", icon: Shield, label: nav.piroplasmosis, desc: nav.piroplasmosis_desc },
  ];
}

export function getToolsItems(nav: NavTranslations): NavDropdownItem[] {
  return [
    {
      href: "/calculadora-valor",
      icon: Calculator,
      label: nav.calculator,
      desc: nav.calculator_desc,
    },
    { href: "/comparador-cavalos", icon: Scale, label: nav.comparator, desc: nav.comparator_desc },
    {
      href: "/verificador-compatibilidade",
      icon: Dna,
      label: nav.compatibility,
      desc: nav.compatibility_desc,
    },
  ];
}

export function getCommunityItems(nav: NavTranslations): NavDropdownItem[] {
  return [
    {
      href: "/profissionais",
      icon: Users,
      label: nav.professionals,
      desc: nav.professionals_desc,
    },
    {
      href: "/cavalos-famosos",
      icon: Trophy,
      label: nav.notable_lusitanos,
      desc: nav.notable_lusitanos_desc,
    },
    {
      href: "/analise-perfil",
      icon: HelpCircle,
      label: nav.profile_analysis,
      desc: nav.profile_analysis_desc,
    },
  ];
}

export function getMobileDbItems(nav: NavTranslations): MobileNavItem[] {
  return [
    { href: "/comprar", icon: ShoppingCart, label: nav.buy_horse },
    { href: "/vender-cavalo", icon: Euro, label: nav.sell_horse, highlight: true },
    { href: "/directorio", icon: Crown, label: nav.studs },
    { href: "/mapa", icon: MapPin, label: nav.map },
    { href: "/eventos", icon: Calendar, label: nav.events },
    { href: "/linhagens", icon: BookOpen, label: nav.lineages },
    { href: "/piroplasmose", icon: Shield, label: nav.piroplasmosis },
  ];
}

export function getMobileToolsItems(nav: NavTranslations): MobileNavItem[] {
  return [
    { href: "/calculadora-valor", icon: Calculator, label: nav.calculator },
    { href: "/comparador-cavalos", icon: Scale, label: nav.comparator },
    { href: "/verificador-compatibilidade", icon: Dna, label: nav.compatibility },
  ];
}

export function getMobileCommunityItems(nav: NavTranslations): MobileNavItem[] {
  return [
    { href: "/profissionais", icon: Users, label: nav.professionals },
    { href: "/cavalos-famosos", icon: Trophy, label: nav.notable_lusitanos },
    // Consistent with desktop nav: analise-perfil is under Community, not Tools
    { href: "/analise-perfil", icon: HelpCircle, label: nav.profile_analysis },
  ];
}

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
