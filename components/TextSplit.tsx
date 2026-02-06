"use client";

/**
 * Componente que anima cada palavra de um texto individualmente.
 * CSS puro — usa a classe .text-split-word do globals.css.
 * Zero dependências, zero JS runtime (apenas split no render).
 */
export default function TextSplit({
  text,
  className = "",
  baseDelay = 0,
  wordDelay = 0.08,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  wordDelay?: number;
}) {
  const words = text.split(" ");

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="text-split-word"
          style={{ animationDelay: `${baseDelay + i * wordDelay}s` }}
          aria-hidden="true"
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
