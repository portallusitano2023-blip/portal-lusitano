// @ts-nocheck
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
// Nova forma de criar o cliente no browser (Client Component)
import { createBrowserClient } from "@supabase/ssr"; 

export default function VenderPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  // Inicializa o cliente usando as variáveis de ambiente que já tens
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Processando Exemplar...");

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      let imageUrl = "";

      // 1. Upload da Foto para o Storage
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cavalos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Buscar a URL pública
        const { data: urlData } = supabase.storage.from('cavalos').getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      // 2. Enviar dados para a tua API
      const res = await fetch("/api/vender", {
        method: "POST",
        body: JSON.stringify({ ...data, imageUrl }),
      });

      if (res.ok) {
        setStatus("Sucesso! O exemplar foi submetido para curadoria.");
        e.target.reset();
        setFile(null);
      }
    } catch (error) {
      setStatus("Erro no upload. Tente novamente.");
    }
  }

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-48 px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <header className="mb-20 text-center">
            <h1 className="text-6xl font-serif italic mb-6">Marketplace <span className="text-[#C5A059]">Elite</span></h1>
            <p className="text-zinc-500 font-light tracking-[0.4em] text-[10px] uppercase">Upload de Fotografias em Alta Resolução</p>
          </header>

          <form onSubmit={handleSubmit} className="bg-zinc-950/40 p-12 border border-zinc-900 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <input name="nomeCavalo" placeholder="Nome do Exemplar" required className="bg-transparent border-b border-zinc-800 p-4 focus:border-[#C5A059] outline-none font-serif text-xl" />
              <input name="linhagem" placeholder="Linhagem" required className="bg-transparent border-b border-zinc-800 p-4 focus:border-[#C5A059] outline-none font-serif text-xl" />
            </div>

            {/* ZONA DE UPLOAD DE LUXO */}
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-zinc-800 p-20 text-center group-hover:border-[#C5A059]/50 transition-all">
                {file ? (
                  <p className="text-[#C5A059] font-serif italic text-lg">{file.name} selecionado</p>
                ) : (
                  <p className="text-zinc-500 uppercase text-[9px] tracking-widest font-bold">Clique ou arraste a fotografia principal</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <input name="preco" placeholder="Valor Pretendido (€)" required className="bg-transparent border-b border-zinc-800 p-4 focus:border-[#C5A059] outline-none font-serif text-xl text-[#C5A059]" />
               <button type="submit" className="bg-[#C5A059] text-black py-5 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-white transition-all duration-700">Submeter Exemplar</button>
            </div>

            {status && <p className="text-center text-[#C5A059] font-serif italic text-sm animate-pulse">{status}</p>}
          </form>
        </div>
      </main>
    </>
  );
}