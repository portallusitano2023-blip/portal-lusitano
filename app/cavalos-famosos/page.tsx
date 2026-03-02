import CavalosFamososContent from "@/components/cavalos-famosos/CavalosFamososContent";
import { generatePageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = generatePageMetadata({
  title: "Cavalos Lusitanos Famosos — Os Mais Célebres da Raça",
  description:
    "Descubra os cavalos Lusitanos mais famosos da história: campeões olímpicos, garanhões lendários e cavalos que marcaram a raça PSL.",
  path: "/cavalos-famosos",
  keywords: [
    "cavalos lusitanos famosos",
    "cavalos famosos portugal",
    "garanhões lusitanos célebres",
    "novilheiro cavalo",
    "opus lusitano",
  ],
});

export default function CavalosFamososPage() {
  return <CavalosFamososContent />;
}
