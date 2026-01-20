import Maintenance from "@/components/Maintenance";

export default function Home() {
  // Neste momento, forçamos a manutenção para todos (tu e os clientes)
  // para garantir que o build passa e o site fica escondido.
  return <Maintenance />;
}