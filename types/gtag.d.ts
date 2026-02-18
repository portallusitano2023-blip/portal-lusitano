// Declaração global para Google Tag Manager / gtag
// Necessário para Consent Mode v2 e GA4

type GtagConsentArg = "granted" | "denied";

interface GtagConsentParams {
  ad_storage?: GtagConsentArg;
  ad_user_data?: GtagConsentArg;
  ad_personalization?: GtagConsentArg;
  analytics_storage?: GtagConsentArg;
  functionality_storage?: GtagConsentArg;
  personalization_storage?: GtagConsentArg;
  security_storage?: GtagConsentArg;
  wait_for_update?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GtagFunction = (command: string, ...args: any[]) => void;

declare global {
  interface Window {
    gtag: GtagFunction;
    dataLayer: Record<string, unknown>[];
  }
}

export {};
