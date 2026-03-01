"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import { analytics } from "@/lib/analytics-events";
import { CONTACT_EMAIL } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

export interface CavaloSanity {
  nome: string;
  idade: number;
  ferro: string;
  genealogia?: string;
  descricao: string;
  preco?: number;
  imageUrl: string;
  galeriaUrls?: string[];
}

export interface CavaloRelacionado {
  nome: string;
  slug: string;
  imageUrl: string;
  idade: number;
}

interface CavaloDetailProps {
  cavalo: CavaloSanity;
  relacionados: CavaloRelacionado[];
  slug: string;
}

export default function CavaloDetail({ cavalo, relacionados, slug }: CavaloDetailProps) {
  const [fotoAtiva, setFotoAtiva] = useState<string>(cavalo.imageUrl);
  const { language } = useLanguage();
  const tr = createTranslator(language);

  useEffect(() => {
    analytics.viewCavalo({
      id: slug,
      nome: cavalo.nome,
      preco: cavalo.preco,
      coudelaria: cavalo.ferro,
      idade: cavalo.idade,
    });
  }, [slug, cavalo.nome, cavalo.preco, cavalo.ferro, cavalo.idade]);

  const numeroTelemovel = "351939513151";
  const mensagem = tr(
    `Ol\u00e1! Estou interessado no cavalo *${cavalo.nome}* que vi no Portal Lusitano.`,
    `Hello! I am interested in the horse *${cavalo.nome}* I saw on Portal Lusitano.`,
    `\u00a1Hola! Estoy interesado en el caballo *${cavalo.nome}* que vi en Portal Lusitano.`
  );
  const linkWhatsApp = `https://wa.me/${numeroTelemovel}?text=${encodeURIComponent(mensagem)}`;

  const todasAsFotos = [cavalo.imageUrl, ...(cavalo.galeriaUrls || [])];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: tr("Comprar", "Buy", "Comprar"), href: "/comprar" },
            { label: cavalo.nome },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* GALERIA INTERATIVA */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden border border-[var(--background-secondary)] bg-[var(--background-secondary)] shadow-2xl">
              {fotoAtiva && (
                <Image
                  src={fotoAtiva}
                  alt={cavalo.nome}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-all duration-500"
                  priority
                />
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 no-print">
              {todasAsFotos.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setFotoAtiva(url)}
                  className={`relative aspect-square border-2 transition-all ${fotoAtiva === url ? "border-[var(--gold)]" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <Image
                    src={url}
                    fill
                    sizes="(max-width: 1024px) 25vw, 12vw"
                    className="object-cover"
                    alt={`${cavalo.nome} ${idx + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* DETALHES */}
          <div className="flex flex-col">
            <span className="text-[var(--gold)] uppercase tracking-[0.3em] text-sm mb-2 font-bold">
              {tr("Puro Sangue Lusitano", "Purebred Lusitano", "Pura Sangre Lusitano")}
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif mb-6">{cavalo.nome}</h1>

            <div className="bg-[var(--background-secondary)]/50 border border-[var(--gold)]/30 p-8 mb-10 shadow-2xl backdrop-blur-sm">
              <div className="mb-8">
                <p className="text-[var(--foreground-muted)] text-[10px] uppercase tracking-widest mb-1">
                  {tr("Pre\u00e7o", "Price", "Precio")}
                </p>
                <p className="text-3xl font-serif text-[var(--gold)]">
                  {cavalo.preco
                    ? `${cavalo.preco.toLocaleString(language === "pt" ? "pt-PT" : language === "es" ? "es-ES" : "en-GB")} \u20ac`
                    : tr("Sob Consulta", "On Request", "Bajo Consulta")}
                </p>
              </div>

              <div className="flex flex-col gap-3 no-print">
                <a
                  href={linkWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    analytics.contactCavalo({
                      id: slug,
                      nome: cavalo.nome,
                      preco: cavalo.preco,
                      method: "whatsapp",
                    });
                  }}
                  className="w-full py-4 bg-[#25D366] text-black font-bold uppercase text-xs tracking-[0.2em] hover:bg-[#20bd5a] transition-all text-center"
                >
                  {tr("Contactar por WhatsApp", "Contact via WhatsApp", "Contactar por WhatsApp")}
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  onClick={() => {
                    analytics.contactCavalo({
                      id: slug,
                      nome: cavalo.nome,
                      preco: cavalo.preco,
                      method: "email",
                    });
                  }}
                  className="w-full py-4 bg-[var(--background-secondary)] border border-[var(--gold)]/30 text-[var(--gold)] font-bold uppercase text-xs tracking-[0.2em] hover:bg-[var(--gold)] hover:text-black transition-all text-center"
                >
                  {tr("Enviar Email", "Send Email", "Enviar Email")}
                </a>
              </div>
            </div>

            {/* FICHA TECNICA */}
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-y-4 border-t border-[var(--border)] pt-6">
                <p>
                  <span className="text-[var(--foreground-muted)] uppercase tracking-tighter block mb-1">
                    {tr("Idade", "Age", "Edad")}
                  </span>{" "}
                  {cavalo.idade} {tr("anos", "years", "a\u00f1os")}
                </p>
                <p>
                  <span className="text-[var(--foreground-muted)] uppercase tracking-tighter block mb-1">
                    {tr("Ferro", "Brand", "Hierro")}
                  </span>{" "}
                  {cavalo.ferro}
                </p>
              </div>
              {cavalo.genealogia && (
                <div className="border-t border-[var(--border)] pt-6">
                  <span className="text-[var(--foreground-muted)] uppercase tracking-tighter block mb-2">
                    {tr("Genealogia", "Genealogy", "Genealog\u00eda")}
                  </span>
                  <p className="text-[var(--foreground-secondary)]">{cavalo.genealogia}</p>
                </div>
              )}
              <div className="border-t border-[var(--border)] pt-6">
                <span className="text-[var(--foreground-muted)] uppercase tracking-tighter block mb-2">
                  {tr("Descri\u00e7\u00e3o", "Description", "Descripci\u00f3n")}
                </span>
                <p className="text-[var(--foreground-secondary)] leading-relaxed text-base italic font-serif">
                  {cavalo.descricao}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* EXEMPLARES RELACIONADOS */}
        {relacionados.length > 0 && (
          <div className="mt-32 pt-20 border-t border-[var(--background-secondary)]">
            <h3 className="font-serif text-3xl mb-12 text-center text-[var(--foreground)]">
              {tr("Outros ", "Other ", "Otros ")}
              <span className="text-[var(--gold)]">
                {tr("Exemplares de Elite", "Elite Specimens", "Ejemplares de \u00c9lite")}
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relacionados.map((rel) => (
                <Link key={rel.slug} href={`/cavalo/${rel.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-[var(--background-secondary)] mb-4 border border-[var(--border)] group-hover:border-[var(--gold)] transition-all relative">
                    <Image
                      src={rel.imageUrl}
                      alt={rel.nome}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[var(--gold)] uppercase tracking-widest text-[10px] mb-1 font-bold">
                    {tr("Puro Sangue Lusitano", "Purebred Lusitano", "Pura Sangre Lusitano")}
                  </p>
                  <h4 className="text-xl font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                    {rel.nome}
                  </h4>
                  <p className="text-[var(--foreground-muted)] text-xs mt-1">
                    {rel.idade} {tr("anos", "years", "a\u00f1os")}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
