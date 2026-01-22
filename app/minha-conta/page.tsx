// @ts-nocheck
import Navbar from "@/components/Navbar";
import { getCustomer } from "@/lib/shopify";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "./actions";

export const dynamic = 'force-dynamic';

export default async function MinhaContaPage() {
  // 1. Ler Token
  const cookieStore = await cookies();
  const token = cookieStore.get('shopify_customer_token')?.value;

  if (!token) redirect('/login');

  // 2. Buscar Cliente
  const customer = await getCustomer(token);

  if (!customer) redirect('/login');

  // Formatar preço
  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: currency }).format(amount);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 selection:bg-[#C5A059] selection:text-black">
        
        <div className="max-w-6xl mx-auto">
            
            {/* CABEÇALHO DO DASHBOARD */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-zinc-800 pb-8 gap-6">
                <div>
                    <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold block mb-4">
                      Área Privada
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif italic text-white">
                      Olá, {customer.firstName || 'Membro'}
                    </h1>
                </div>
                
                {/* Botão de Logout */}
                <form action={logout}>
                    <button className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white border border-zinc-800 hover:border-red-900 px-6 py-3 transition-all hover:bg-red-900/10">
                        Terminar Sessão
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* --- COLUNA 1: DADOS PESSOAIS --- */}
                <div className="lg:col-span-1">
                    <div className="bg-zinc-900/30 p-8 border border-white/5">
                        <h3 className="text-lg font-serif italic text-white mb-6">O Meu Perfil</h3>
                        <div className="space-y-4 text-sm font-light text-zinc-400">
                            <div>
                                <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Nome</p>
                                <p className="text-white">{customer.firstName} {customer.lastName}</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Email</p>
                                <p className="text-white">{customer.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- COLUNA 2: HISTÓRICO DE ENCOMENDAS --- */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-serif italic text-white mb-6 flex items-center gap-4">
                        Histórico de Aquisições
                        <span className="h-[1px] flex-1 bg-zinc-800"></span>
                    </h3>

                    {customer.orders.edges.length > 0 ? (
                        <div className="space-y-4">
                            {customer.orders.edges.map(({ node: order }) => (
                                <div key={order.id} className="bg-zinc-900/20 border border-white/5 p-6 hover:border-[#C5A059]/30 transition-colors group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[#C5A059] font-mono text-sm">Encomenda #{order.orderNumber}</p>
                                            <p className="text-zinc-500 text-xs mt-1">
                                                {new Date(order.processedAt).toLocaleDateString('pt-PT')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-mono">
                                                {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                                            </p>
                                            <span className="inline-block mt-2 px-2 py-1 bg-zinc-800 text-[8px] uppercase tracking-widest rounded text-zinc-300">
                                                {order.financialStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Produtos da Encomenda (Miniaturas) */}
                                    <div className="flex gap-2 overflow-x-auto pt-4 border-t border-white/5">
                                        {order.lineItems.edges.map(({ node: item }) => (
                                            <div key={item.title} className="w-12 h-16 bg-zinc-800 flex-shrink-0 relative overflow-hidden">
                                                {item.variant?.image?.url ? (
                                                    <img src={item.variant.image.url} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-600">IMG</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-dashed border-zinc-800 bg-zinc-900/10">
                            <p className="text-zinc-500 font-serif italic mb-4">Ainda não possui aquisições.</p>
                            <a href="/loja" className="text-[#C5A059] text-xs uppercase tracking-widest hover:text-white transition-colors">
                                Explorar Coleção →
                            </a>
                        </div>
                    )}
                </div>

            </div>

        </div>
      </main>
    </>
  );
}