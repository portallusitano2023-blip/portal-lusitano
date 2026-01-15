import Link from 'next/link';
// Removi o Youtube e Whatsapp dos imports para não dar erro
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";

export function Footer() {
  
  // LISTA REDUZIDA (Sem YouTube e WhatsApp)
  const SOCIAIS = [
    { 
      nome: "Instagram", 
      icon: <FaInstagram size={20} />, 
      url: "https://instagram.com/portal_lusitano" 
    },
    { 
      nome: "TikTok", 
      icon: <FaTiktok size={20} />, 
      url: "https://tiktok.com/@portal_lusitano" 
    },
    { 
      nome: "Facebook", 
      icon: <FaFacebookF size={20} />, 
      url: "https://www.facebook.com/profile.php?id=61555073591747"
    },
  ];

  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* --- Coluna 1: Marca & Redes --- */}
          <div>
            <h3 className="text-2xl font-serif text-[#C5A059] mb-4">PORTAL LUSITANO</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              A excelência do Cavalo Puro Sangue Lusitano. 
            </p>
            
            <div className="flex items-center gap-4 flex-wrap">
              {SOCIAIS.map((rede) => (
                <a 
                  key={rede.nome}
                  href={rede.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-gray-400 hover:bg-[#C5A059] hover:text-black transition duration-300"
                  aria-label={rede.nome}
                >
                  {rede.icon}
                </a>
              ))}
            </div>
          </div>

          {/* --- Coluna 2: Links --- */}
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-6 text-sm">Explorar</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-[#C5A059] transition">Cavalos à Venda</Link></li>
              <li><Link href="/leiloes" className="hover:text-[#C5A059] transition">Leilões</Link></li>
              <li><Link href="/blog" className="hover:text-[#C5A059] transition">Blog</Link></li>
            </ul>
          </div>

          {/* --- Coluna 3: Contactos --- */}
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-6 text-sm">Contacto</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>Portal Lusitano</li>
              <li>Portugal</li>
              <li className="text-[#C5A059]">portal.lusitano2023@gmail.com</li>
              <li>+351 939 513 151</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-600 text-xs uppercase tracking-wider">
          <p>&copy; 2026 Portal Lusitano.</p>
          <p className="mt-2 md:mt-0">Desenvolvido por Portal Lusitano</p>
        </div>
      </div>
    </footer>
  );
}