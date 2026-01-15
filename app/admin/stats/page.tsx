// @ts-nocheck
import { client } from "@/lib/client";
import Link from "next/link";

export const dynamic = 'force-dynamic';

/**
 * Função para procurar dados reais no Sanity.
 * Agora inclui a contagem de licitações e a soma total dos valores.
 */
async function getStats() {
  const stats = await client.fetch(`{
    "totalSubscritores": count(*[_type == "subscritor"]),
    "totalCavalos": count(*[_type == "cavalo"]),
    "leiloesAtivos": count(*[_type == "leilao" && ativo == true]),
    "totalLicitacoes": count(*[_type == "licitacao"]),
    "valorTotal": sum(*[_type == "licitacao"].valor),
    "ultimasLicitacoes": *[_type == "licitacao"] | order(dataHora desc)[0...5] {
      nome,
      valor,
      cavalo,
      dataHora
    }
  }`);
  return stats;
}

export default async function AdminStats({ searchParams }) {
  const params = await searchParams;
  const password = params.pwd;

  // SENHA DE ACESSO AO PAINEL
  const SENHA_CORRETA = "gaspar2026"; 

  // Verificação de Segurança
  if (password !== SENHA_CORRETA) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 font-sans">
        <div className="w-16 h-16 border border-red-900 rounded-full flex items-center justify-center mb-6">
          <span className="text-red-900 text-2xl">✕</span>
        </div>
        <h1 className="text-zinc-800 uppercase tracking-[0.5em] text-xs font-bold">Acesso Restrito</h1>
        <p className="text-zinc-900 text-[10px] mt-4 uppercase font-sans">Consola de Administração Portal Lusitano</p>
        <Link href="/" className="mt-8 text-zinc-600 text-[10px] underline uppercase tracking-widest hover:text-white transition-colors font-sans">
          Voltar ao Início
        </Link>
      </main>
    );
  }

  const data = await getStats();

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 font-sans">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* CABEÇALHO DE GESTÃO */}
        <div className="flex justify-between items-end mb-12 border-b border-zinc-800 pb-8">
          <div>
            <span className="text-[#C5A059] uppercase tracking-[0.4em] text-[10px] font-bold block mb-2 font-sans">Consola de Administração</span>
            <h1 className="text-4xl font-serif italic text-white">Performance do Portal</h1>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-sans">Identidade Verificada</p>
            <p className="text-green-600 text-sm font-mono animate-pulse">● Acesso Autorizado</p>
          </div>
        </div>

        {/* GRID DE MÉTRICAS - AGORA COM DADOS DE LICITAÇÃO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="bg-zinc-900/30 border border-zinc-800 p-8 hover:border-[#C5A059]/50 transition-all group">
            <span className="text-2xl mb-4 block">📈</span>
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-2 font-sans">Total de Leads</p>
            <p className="text-4xl font-serif text-[#C5A059]">{data.totalSubscritores}</p>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 p-8 hover:border-[#C5A059]/50 transition-all group">
            <span className="text-2xl mb-4 block">⚖️</span>
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-2 font-sans">Licitações Recebidas</p>
            <p className="text-4xl font-serif text-white">{data.totalLicitacoes}</p>
          </div>

          <div className="bg-zinc-900/30 border border-[#C5A059]/30 p-8 hover:border-[#C5A059] transition-all group">
            <span className="text-2xl mb-4 block">💰</span>
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-2 font-sans">Volume Total em Propostas</p>
            <p className="text-4xl font-serif text-[#C5A059]">
               {(data.valorTotal || 0).toLocaleString('pt-PT')} €
            </p>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 p-8 hover:border-[#C5A059]/50 transition-all group">
            <span className="text-2xl mb-4 block">🐎</span>
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-2 font-sans">Cavalos Ativos</p>
            <p className="text-4xl font-serif text-white">{data.totalCavalos}</p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LISTA DE ATIVIDADE RECENTE (LICITAÇÕES) */}
          <div className="lg:col-span-2 bg-zinc-900/10 border border-zinc-900 p-8">
            <h3 className="font-serif text-xl mb-6">Últimas Propostas Recebidas</h3>
            <div className="space-y-4">
              {data.ultimasLicitacoes && data.ultimasLicitacoes.length > 0 ? (
                data.ultimasLicitacoes.map((licitacao, i) => (
                  <div key={i} className="flex justify-between items-center p-4 border-b border-zinc-900 hover:bg-zinc-900/40 transition-all">
                    <div>
                      <p className="text-sm font-bold text-zinc-200">{licitacao.nome}</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-sans">Exemplar: <span className="text-zinc-400 italic font-serif">{licitacao.cavalo}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#C5A059] font-serif font-bold">{(licitacao.valor).toLocaleString('pt-PT')} €</p>
                      <p className="text-[9px] text-zinc-600 uppercase font-sans">
                        {new Date(licitacao.dataHora).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-600 text-sm italic font-serif py-10 text-center">Aguardando as primeiras propostas oficiais...</p>
              )}
            </div>
          </div>

          {/* GESTÃO RÁPIDA */}
          <div className="bg-zinc-900/10 border border-zinc-900 p-8">
            <h3 className="font-serif text-xl mb-6">Controlo Studio</h3>
            <div className="space-y-4">
              <Link href="https://portal-lusitano.sanity.studio" target="_blank" className="block w-full py-4 bg-white text-black text-center text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-all font-sans">
                Gerir Cavalos & Vendas
              </Link>
              <div className="p-4 bg-zinc-900/50 border border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-sans">Suporte Técnico</p>
                <p className="text-xs text-zinc-300 font-sans">Francisco Gaspar - Nova FCT</p>
              </div>
            </div>
          </div>

        </div>

        <p className="mt-12 text-zinc-700 text-[10px] text-center uppercase tracking-[0.4em] font-sans">
           Consola Privada • Portal Lusitano 2026
        </p>

      </div>
    </main>
  );
}