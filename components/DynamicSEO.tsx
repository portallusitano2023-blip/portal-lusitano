"use client";

import { useEffect } from "react";

interface DynamicSEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

/**
 * Componente para adicionar SEO dinâmico em Client Components
 * Manipula document.title e meta tags via DOM
 *
 * Nota: Solução pragmática para Client Components.
 * Idealmente, páginas dinâmicas deveriam ser Server Components com generateMetadata.
 */
export default function DynamicSEO({ title, description, image, url }: DynamicSEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (property: string, content: string, isName = false) => {
      const attribute = isName ? "name" : "property";
      let element = document.querySelector(`meta[${attribute}="${property}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", description, true);

    // Open Graph tags
    updateMetaTag("og:title", title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:type", "website");
    updateMetaTag("og:locale", "pt_PT");

    if (image) {
      updateMetaTag("og:image", image);
    }

    if (url) {
      updateMetaTag("og:url", url);
    }

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image", true);
    updateMetaTag("twitter:title", title, true);
    updateMetaTag("twitter:description", description, true);

    if (image) {
      updateMetaTag("twitter:image", image, true);
    }

    // Cleanup function to restore default title
    return () => {
      document.title = "Portal Lusitano";
    };
  }, [title, description, image, url]);

  return null; // Component doesn't render anything
}
