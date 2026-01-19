// @ts-nocheck
import Navbar from "@/components/Navbar";

export default function LifestylePage() {
  
  // 👇 AQUI É ONDE COLOCAS OS TEUS PRODUTOS REAIS
  const products = [
    {
      id: 1,
      name: "T-shirt Portal Lusitano",
      price: "25.00 €",
      // Copia o link da imagem do Printful/Shopify e cola aqui:
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800", 
      tag: "Best Seller",
      // Copia o link do Checkout do produto no Shopify e cola aqui:
      checkoutUrl: "https://o-teu-shopify.com/products/tshirt-exemplo" 
    },
    {
      id: 2,
      name: "Boné Signature Gold",
      price: "30.00 €",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800",
      tag: "Edição Limitada",
      checkoutUrl: "https://o-teu-shopify.com/products/bone-exemplo"
    },
    {
      id: 3,
      name: "Hoodie Black Edition",
      price: "65.00 €",
      image: "https://images.unsplash.com/photo-1556906781-9a412961d289?q=80&w=800",
      tag: "Inverno 2026",
      checkoutUrl: "https://o-teu-shopify.com/products/hoodie-exemplo"
    }
  ];

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-40 pb-20 px-6">
        
        {/* HEADER */}
        <header className="max-w-7xl mx-auto mb-32 text-center border-b border-zinc-900 pb-20">
          <span className="text-[#C5A059] uppercase tracking-[1em] text-[10px] font-bold block mb-8 animate-pulse">Merchandising Oficial</span>
          <h1 className="text-6xl md:text-9xl font-serif italic tracking-tighter mb-10">
            Lifestyle & <span className="text-[#C5A059]">Legado</span>
          </h1>
          <p className="text-zinc-500 text-xl font-light italic max-w-2xl mx-auto">
            "Vista a marca. Sinta a tradição."
          </p>
        </header>

        {/* GRELHA DE PRODUTOS */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
          
          {products.map((product) => (
            <div key={product.id} className="group bg-black p-10 hover:bg-zinc-950 transition-colors relative flex flex-col">
              
              {/* TAG */}
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-white text-black text-[9px] uppercase font-bold px-3 py-1 tracking-widest">
                  {product.tag}
                </span>
              </div>

              {/* IMAGEM */}
              <div className="aspect-square overflow-hidden mb-8 relative grayscale group-hover:grayscale-0 transition-all duration-700">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s]" />
              </div>

              {/* INFO */}
              <div className="mt-auto">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-2xl font-serif italic text-white">{product.name}</h3>
                  <p className="text-xl font-light text-zinc-400">{product.price}</p>
                </div>

                {/* BOTÃO COMPRAR - LEVA AO SHOPIFY PARA PAGAR */}
                <a 
                  href={product.checkoutUrl} 
                  target="_blank" 
                  className="block text-center w-full border border-zinc-800 text-white py-4 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#C5A059] hover:text-black hover:border-[#C5A059] transition-all duration-300"
                >
                  Comprar Agora
                </a>
              </div>

            </div>
          ))}

        </div>

      </main>
    </>
  );
}