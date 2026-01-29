"use client";

import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // URL atual se não for fornecida
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500 uppercase tracking-wider mr-2 hidden sm:block">
        Partilhar:
      </span>

      <button
        onClick={() => openShareWindow(shareLinks.facebook)}
        className="p-2 rounded-sm bg-zinc-900 hover:bg-[#1877F2] text-zinc-400 hover:text-white transition-all"
        aria-label="Partilhar no Facebook"
      >
        <Facebook size={16} />
      </button>

      <button
        onClick={() => openShareWindow(shareLinks.twitter)}
        className="p-2 rounded-sm bg-zinc-900 hover:bg-black text-zinc-400 hover:text-white transition-all"
        aria-label="Partilhar no Twitter/X"
      >
        <Twitter size={16} />
      </button>

      <button
        onClick={() => openShareWindow(shareLinks.linkedin)}
        className="p-2 rounded-sm bg-zinc-900 hover:bg-[#0A66C2] text-zinc-400 hover:text-white transition-all"
        aria-label="Partilhar no LinkedIn"
      >
        <Linkedin size={16} />
      </button>

      <button
        onClick={() => openShareWindow(shareLinks.whatsapp)}
        className="p-2 rounded-sm bg-zinc-900 hover:bg-[#25D366] text-zinc-400 hover:text-white transition-all"
        aria-label="Partilhar no WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>

      <button
        onClick={copyToClipboard}
        className={`p-2 rounded-sm transition-all ${
          copied
            ? "bg-green-600 text-white"
            : "bg-zinc-900 hover:bg-[#C5A059] text-zinc-400 hover:text-black"
        }`}
        aria-label="Copiar link"
      >
        {copied ? <Check size={16} /> : <Link2 size={16} />}
      </button>
    </div>
  );
}
