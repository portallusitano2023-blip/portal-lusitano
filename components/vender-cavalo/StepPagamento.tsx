"use client";

import Link from "next/link";
import { CreditCard, Shield } from "lucide-react";
import type { FormData } from "@/components/vender-cavalo/types";
import { PRECO_ANUNCIO, PRECO_DESTAQUE } from "@/components/vender-cavalo/data";
import { useLanguage } from "@/context/LanguageContext";

interface StepPagamentoProps {
  formData: FormData;
  imagens: File[];
  opcaoDestaque: boolean;
  onOpcaoDestaqueChange: (checked: boolean) => void;
  termsAccepted: boolean;
  onTermsChange: (checked: boolean) => void;
  precoTotal: number;
  loading: boolean;
  onSubmit: () => void;
}

export default function StepPagamento({
  formData,
  imagens,
  opcaoDestaque,
  onOpcaoDestaqueChange,
  termsAccepted,
  onTermsChange,
  precoTotal,
  loading,
  onSubmit,
}: StepPagamentoProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-6">
      <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
        <span className="w-8 h-8 bg-[var(--gold)] rounded-full flex items-center justify-center text-black text-sm font-bold">
          6
        </span>
        {t.vender_cavalo.step_payment_title}
      </h2>

      {/* Resumo */}
      <div className="bg-[var(--background-card)]/50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium mb-4">{t.vender_cavalo.ad_summary}</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-[var(--foreground-muted)]">{t.vender_cavalo.summary_horse}:</span>
          <span>{formData.nome || "-"}</span>
          <span className="text-[var(--foreground-muted)]">
            {t.vender_cavalo.summary_registration}:
          </span>
          <span>{formData.numero_registo || "-"}</span>
          <span className="text-[var(--foreground-muted)]">{t.vender_cavalo.summary_price}:</span>
          <span>{formData.preco ? `${parseInt(formData.preco).toLocaleString()}€` : "-"}</span>
          <span className="text-[var(--foreground-muted)]">
            {t.vender_cavalo.summary_location}:
          </span>
          <span>{formData.localizacao || "-"}</span>
          <span className="text-[var(--foreground-muted)]">{t.vender_cavalo.summary_photos}:</span>
          <span>
            {imagens.length} {t.vender_cavalo.photos_count}
          </span>
        </div>
      </div>

      {/* Opção Destaque */}
      <div className="border border-[var(--gold)]/30 rounded-lg p-4 mb-6">
        <label
          htmlFor="opcao_destaque"
          className="flex items-start gap-4 cursor-pointer touch-manipulation"
        >
          <input
            id="opcao_destaque"
            type="checkbox"
            checked={opcaoDestaque}
            onChange={(e) => onOpcaoDestaqueChange(e.target.checked)}
            className="w-5 h-5 accent-[var(--gold)] mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{t.vender_cavalo.highlight_option}</span>
              <span className="px-2 py-0.5 bg-[var(--gold)] text-black text-xs font-bold rounded">
                +{PRECO_DESTAQUE}€
              </span>
            </div>
            <p className="text-sm text-[var(--foreground-secondary)]">
              {t.vender_cavalo.highlight_desc}
            </p>
          </div>
        </label>
      </div>

      {/* Preço Total */}
      <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-[var(--foreground-secondary)]">
              {t.vender_cavalo.total_to_pay}
            </span>
            <div className="text-2xl font-bold text-[var(--gold)]">{precoTotal}€</div>
          </div>
          <CreditCard size={32} className="text-[var(--gold)]" />
        </div>
        <div className="text-xs text-[var(--foreground-muted)] mt-2">
          {t.vender_cavalo.base_ad} ({PRECO_ANUNCIO}€){" "}
          {opcaoDestaque && `+ ${t.vender_cavalo.highlight_label} (${PRECO_DESTAQUE}€)`}
        </div>
      </div>

      {/* Termos */}
      <div className="mb-6">
        <label
          htmlFor="termos_aceites"
          className="flex items-start gap-3 cursor-pointer touch-manipulation"
        >
          <input
            id="termos_aceites"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="w-5 h-5 accent-[var(--gold)] mt-0.5"
          />
          <span className="text-sm text-[var(--foreground-secondary)]">
            {t.vender_cavalo.terms_agree}{" "}
            <Link href="/termos" className="text-[var(--gold)] hover:underline">
              {t.vender_cavalo.terms_link}
            </Link>{" "}
            {t.vender_cavalo.privacy_and}{" "}
            <Link href="/privacidade" className="text-[var(--gold)] hover:underline">
              {t.vender_cavalo.privacy_link}
            </Link>
            . {t.vender_cavalo.terms_confirm}
          </span>
        </label>
      </div>

      {/* Info Verificação */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="font-medium mb-1">{t.vender_cavalo.doc_verification_title}</p>
            <p className="text-blue-300/80">{t.vender_cavalo.doc_verification_desc}</p>
          </div>
        </div>
      </div>

      {/* Botão Pagamento */}
      <button
        onClick={onSubmit}
        disabled={loading || !termsAccepted}
        className="w-full py-4 bg-[var(--gold)] text-black font-semibold rounded-lg hover:bg-[var(--gold-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 touch-manipulation active:scale-[0.98]"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            {t.vender_cavalo.processing}
          </>
        ) : (
          <>
            <CreditCard size={20} />
            {t.vender_cavalo.pay_and_publish.replace("{price}", `${precoTotal}€`)}
          </>
        )}
      </button>

      <p className="text-center text-xs text-[var(--foreground-muted)] mt-4">
        {t.vender_cavalo.secure_payment}
      </p>
    </div>
  );
}
