import { describe, it, expect } from "vitest";
import { getLocaleFromPathname, getAlternateLinks, isValidLocale, defaultLocale } from "@/lib/i18n";

describe("i18n utilities", () => {
  describe("getLocaleFromPathname", () => {
    it("should return 'en' for /en/ paths", () => {
      expect(getLocaleFromPathname("/en/loja")).toBe("en");
      expect(getLocaleFromPathname("/en")).toBe("en");
      expect(getLocaleFromPathname("/en/comprar")).toBe("en");
    });

    it("should return default locale for Portuguese paths", () => {
      expect(getLocaleFromPathname("/loja")).toBe("pt");
      expect(getLocaleFromPathname("/")).toBe("pt");
      expect(getLocaleFromPathname("/comprar")).toBe("pt");
    });

    it("should not match /enterprise or similar", () => {
      expect(getLocaleFromPathname("/enterprise")).toBe("pt");
    });
  });

  describe("getAlternateLinks", () => {
    const siteUrl = "https://portal-lusitano.pt";

    it("should generate correct alternate links for root", () => {
      const links = getAlternateLinks("/", siteUrl);
      expect(links["pt-PT"]).toBe("https://portal-lusitano.pt/");
      expect(links["en-US"]).toBe("https://portal-lusitano.pt/en");
    });

    it("should generate correct alternate links for subpages", () => {
      const links = getAlternateLinks("/loja", siteUrl);
      expect(links["pt-PT"]).toBe("https://portal-lusitano.pt/loja");
      expect(links["en-US"]).toBe("https://portal-lusitano.pt/en/loja");
    });

    it("should strip /en prefix from English paths", () => {
      const links = getAlternateLinks("/en/loja", siteUrl);
      expect(links["pt-PT"]).toBe("https://portal-lusitano.pt/loja");
      expect(links["en-US"]).toBe("https://portal-lusitano.pt/en/loja");
    });

    it("should include x-default pointing to Portuguese", () => {
      const links = getAlternateLinks("/loja", siteUrl);
      expect(links["x-default"]).toBe("https://portal-lusitano.pt/loja");
    });
  });

  describe("isValidLocale", () => {
    it("should validate known locales", () => {
      expect(isValidLocale("pt")).toBe(true);
      expect(isValidLocale("en")).toBe(true);
    });

    it("should reject unknown locales", () => {
      expect(isValidLocale("fr")).toBe(false);
      expect(isValidLocale("")).toBe(false);
      expect(isValidLocale("de")).toBe(false);
    });
  });

  describe("defaultLocale", () => {
    it("should be Portuguese", () => {
      expect(defaultLocale).toBe("pt");
    });
  });
});
