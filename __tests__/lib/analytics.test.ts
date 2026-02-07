import { describe, it, expect, vi, beforeEach } from "vitest";

describe("analytics", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("pageview should not throw when gtag is undefined", async () => {
    vi.stubGlobal("window", {});
    const { pageview } = await import("@/lib/analytics");
    expect(() => pageview("/test")).not.toThrow();
  });

  it("pageview should call gtag when available", async () => {
    const mockGtag = vi.fn();
    vi.stubGlobal("window", { gtag: mockGtag });
    const { pageview } = await import("@/lib/analytics");
    pageview("/test");
    expect(mockGtag).toHaveBeenCalledWith(
      "config",
      undefined, // NEXT_PUBLIC_GA_ID is not set in test env
      { page_path: "/test" }
    );
  });

  it("event should call gtag with correct params", async () => {
    const mockGtag = vi.fn();
    vi.stubGlobal("window", { gtag: mockGtag });
    const { event } = await import("@/lib/analytics");
    event({
      action: "test_action",
      category: "test_category",
      label: "test",
      value: 10,
    });
    expect(mockGtag).toHaveBeenCalledWith(
      "event",
      "test_action",
      expect.objectContaining({
        event_category: "test_category",
        event_label: "test",
        value: 10,
      })
    );
  });

  it("sendMetaEvent should not throw when fbq is undefined", async () => {
    vi.stubGlobal("window", {});
    const { sendMetaEvent } = await import("@/lib/analytics");
    expect(() => sendMetaEvent("Lead", {})).not.toThrow();
  });

  it("sendMetaEvent should call fbq when available", async () => {
    const mockFbq = vi.fn();
    vi.stubGlobal("window", { fbq: mockFbq });
    const { sendMetaEvent } = await import("@/lib/analytics");
    sendMetaEvent("Lead", { value: 0 });
    expect(mockFbq).toHaveBeenCalledWith("track", "Lead", { value: 0 });
  });

  it("sendGA4Event should call gtag with event name", async () => {
    const mockGtag = vi.fn();
    vi.stubGlobal("window", { gtag: mockGtag });
    const { sendGA4Event } = await import("@/lib/analytics");
    sendGA4Event("purchase", { value: 100 });
    expect(mockGtag).toHaveBeenCalledWith("event", "purchase", { value: 100 });
  });

  it("sendMetaCustomEvent should call fbq trackCustom", async () => {
    const mockFbq = vi.fn();
    vi.stubGlobal("window", { fbq: mockFbq });
    const { sendMetaCustomEvent } = await import("@/lib/analytics");
    sendMetaCustomEvent("CustomEvent", { data: "test" });
    expect(mockFbq).toHaveBeenCalledWith("trackCustom", "CustomEvent", {
      data: "test",
    });
  });
});
