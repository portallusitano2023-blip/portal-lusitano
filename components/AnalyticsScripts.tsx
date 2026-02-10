"use client";

import Script from "next/script";

/**
 * Analytics Scripts Component
 *
 * Carrega os scripts de Google Analytics 4 e Meta Pixel.
 * Incluir no layout.tsx principal.
 *
 * Configuração (adicionar ao .env.local):
 * NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
 * NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXXX
 */

export default function AnalyticsScripts() {
  const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  // Não carregar analytics em desenvolvimento
  if (process.env.NODE_ENV === "development") return null;

  return (
    <>
      {/* ============================================================ */}
      {/* GOOGLE ANALYTICS 4 */}
      {/* ============================================================ */}
      {GA4_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}', {
                page_path: window.location.pathname,
                send_page_view: true
              });
            `}
          </Script>
        </>
      )}

      {/* ============================================================ */}
      {/* META PIXEL (FACEBOOK/INSTAGRAM) */}
      {/* ============================================================ */}
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Meta Pixel NoScript Fallback */}
      {META_PIXEL_ID && (
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
    </>
  );
}
