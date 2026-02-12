import { Ban, Globe, XCircle, MapPin, TrendingUp, Info } from "lucide-react";

export function SeccaoConclusao() {
  return (
    <div className="space-y-6 text-sm text-[var(--foreground-secondary)] leading-relaxed">
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {
            icone: Ban,
            corIcone: "text-red-400",
            titulo: "Principal barreira comercial",
            // FONTE: Cabete et al. 2024 (32.7% nacional), Ribeiro et al. 2013 (17.9% Norte)
            texto:
              "Entre 18% e 33% dos Lusitanos em Portugal testa positivo para anticorpos, mesmo quando perfeitamente saudáveis, bloqueando a exportação.",
          },
          {
            icone: Globe,
            corIcone: "text-orange-400",
            titulo: "Mercados fechados",
            texto:
              "As políticas dos EUA, Canadá, Austrália e outros mercados excluem uma porção significativa de Lusitanos criados em Portugal.",
          },
          {
            icone: XCircle,
            corIcone: "text-red-500",
            titulo: "Sem solução simples",
            texto:
              "O tratamento é arriscado, não existe vacina, e os testes não distinguem infecção activa de imunidade natural por exposição em pastagem.",
          },
          {
            icone: MapPin,
            corIcone: "text-yellow-400",
            titulo: "Problema estrutural",
            texto:
              "Enquanto a Península Ibérica permanecer endémica — inevitável pelo clima e carraças — esta barreira à exportação persistirá.",
          },
          {
            icone: TrendingUp,
            corIcone: "text-[var(--gold)]",
            titulo: "Duas categorias de mercado",
            texto:
              'Cavalos "piro-free" são comercializados como categoria premium, criando dois níveis de valor dentro da raça.',
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`bg-[var(--background-card)]/40 border border-[var(--border)]/30 rounded-xl p-5 ${i === 4 ? "sm:col-span-2" : ""}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--border)]/30 flex items-center justify-center flex-shrink-0">
                <item.icone size={16} className={item.corIcone} />
              </div>
              <p className="text-[var(--foreground)] font-semibold text-sm">{item.titulo}</p>
            </div>
            <p className="text-[13px] text-[var(--foreground-secondary)] leading-relaxed">
              {item.texto}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--gold)]/8 border border-[var(--gold)]/20 rounded-xl p-5 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/20 flex items-center justify-center flex-shrink-0">
            <Info size={18} className="text-[var(--gold)]" />
          </div>
          <div>
            <p className="text-[var(--gold)] font-semibold text-sm mb-2">
              Para compradores internacionais
            </p>
            <p className="text-[13px] text-[var(--foreground-secondary)] leading-relaxed">
              Antes de adquirir um Lusitano em Portugal ou Espanha, solicite sempre o teste de
              piroplasmose actualizado. Se planeia exportar para um país não-endémico, certifique-se
              de que o cavalo testa negativo antes de concluir a compra. O custo do teste (
              <strong className="text-[var(--foreground)]">~60€ em Portugal</strong>) é
              insignificante comparado com o risco.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
