import Link from "next/link";
import { MapPin, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <MapPin className="text-[#C5A059]" size={80} />
            <div className="absolute -bottom-2 -right-2 bg-zinc-900 rounded-full p-2">
              <Search className="text-zinc-500" size={24} />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-serif text-[#C5A059] mb-4">404</h1>

        {/* Message */}
        <h2 className="text-3xl font-serif text-white mb-4">Coudelaria não encontrada</h2>
        <p className="text-zinc-400 text-lg mb-8 max-w-md mx-auto">
          A coudelaria que procura não existe ou foi removida do nosso diretório.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/directorio"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C5A059] text-black font-bold uppercase text-sm tracking-[0.2em] hover:bg-[#d4b670] transition-all"
          >
            <ArrowLeft size={18} />
            Ver Diretório
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 border border-[#C5A059]/30 text-[#C5A059] font-bold uppercase text-sm tracking-[0.2em] hover:bg-[#C5A059] hover:text-black transition-all"
          >
            Página Inicial
          </Link>
        </div>

        {/* Suggestion */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm mb-4">Sugestões:</p>
          <ul className="text-zinc-400 text-sm space-y-2">
            <li>• Verifique se o endereço está correto</li>
            <li>• Explore o nosso diretório completo de coudelarias</li>
            <li>• Use a pesquisa para encontrar coudelarias específicas</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
