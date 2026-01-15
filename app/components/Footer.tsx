import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-gray-900 text-gray-400 py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* COLUNA 1: MARCA */}
          <div className="space-y-4">
            <div className="flex items-center gap-1 font-serif text-xl tracking-widest">
              <span className="text-white font-medium">PORTAL</span>
              <span className="text-[#C5A059] font-bold">LUSITANO</span>
            </div>
            <p className="text-xs leading-relaxed opacity-60">
              A excelência do Cavalo Lusitano ao alcance de um clique. 
              Unimos tradição e tecnologia para levar a nossa paixão a todo o mundo.
            </p>
          </div>

          {/* COLUNA 2: NAVEGAÇÃO */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">Explorar</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-[#C5A059] transition">Início</Link></li>
              <li><Link href="/loja" className="hover:text-[#C5A059] transition">Loja Oficial</Link></li>
              <li><Link href="/leiloes" className="hover:text-[#C5A059] transition">Leilões</Link></li>
              <li><Link href="/blog" className="hover:text-[#C5A059] transition">Blog</Link></li>
            </ul>
          </div>

          {/* COLUNA 3: CONTACTOS */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">Contactos</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                {/* Ícone Email */}
                <svg className="w-5 h-5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>portal.lusitano2023@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                {/* Ícone Telefone */}
                <svg className="w-5 h-5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>+351 939 513 151</span>
              </li>
            </ul>
          </div>

          {/* COLUNA 4: REDES SOCIAIS */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">Seguir</h3>
            <div className="flex gap-4">
              {/* Instagram */}
              <a href="https://instagram.com/portal_lusitano" target="_blank" className="bg-gray-900 p-2 rounded-full hover:bg-[#C5A059] hover:text-black transition duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>

               {/* TikTok */}
               <a href="https://tiktok.com/@portal_lusitano" target="_blank" className="bg-gray-900 p-2 rounded-full hover:bg-[#C5A059] hover:text-black transition duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.03 5.91-.05 8.81-.4 1.41-1.25 2.66-2.42 3.61-1.52 1.25-3.53 1.84-5.46 1.54-2.13-.33-4.13-1.63-5.21-3.49-1.08-1.87-.97-4.25.29-6.02 1.19-1.67 3.2-2.7 5.25-2.61v4.05c-1.11-.12-2.25.4-2.85 1.34-.6.94-.48 2.22.28 3.03.75.8 1.99 1.07 3.03.65.92-.37 1.52-1.27 1.53-2.26.01-4.04.01-8.08.01-12.12-.02-.01-.03-.01-.03-.02z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-900 mt-12 pt-8 text-center text-xs opacity-40">
          <p>&copy; 2026 Portal Lusitano. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}