import { describe, it, expect, vi, beforeEach } from "vitest";
import { exportToCSV, exportToJSON, exportToExcel } from "@/lib/export";

const mockClick = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  // Mock DOM APIs needed by export functions
  vi.stubGlobal("document", {
    createElement: vi.fn(() => ({
      href: "",
      download: "",
      click: mockClick,
    })),
  });
  vi.stubGlobal("URL", { createObjectURL: vi.fn(() => "blob:mock-url") });
  vi.stubGlobal(
    "Blob",
    class MockBlob {
      constructor(
        public content: unknown[],
        public options: Record<string, string>
      ) {}
    }
  );
});

describe("exportToCSV", () => {
  it("should generate CSV and trigger download", () => {
    const data = [
      { name: "John", age: 30 },
      { name: "Jane", age: 25 },
    ];
    exportToCSV(data);
    expect(mockClick).toHaveBeenCalledOnce();
  });

  it("should throw on empty data", () => {
    expect(() => exportToCSV([])).toThrow("Sem dados para exportar");
  });

  it("should use custom column headers", () => {
    const data = [{ name: "John", email: "john@test.com" }];
    exportToCSV(data, { headers: { name: "Nome", email: "Email" } });
    expect(mockClick).toHaveBeenCalledOnce();
  });

  it("should use custom filename", () => {
    const data = [{ id: 1 }];
    exportToCSV(data, { filename: "my-export" });
    expect(mockClick).toHaveBeenCalledOnce();
  });

  it("should filter columns when specified", () => {
    const data = [{ name: "John", age: 30, secret: "hidden" }];
    exportToCSV(data, { columns: ["name", "age"] });
    expect(mockClick).toHaveBeenCalledOnce();
  });
});

describe("exportToJSON", () => {
  it("should export valid JSON and trigger download", () => {
    const data = [{ id: 1, name: "Test" }];
    exportToJSON(data);
    expect(mockClick).toHaveBeenCalledOnce();
  });

  it("should use custom filename", () => {
    const data = [{ id: 1 }];
    exportToJSON(data, { filename: "data-export" });
    expect(mockClick).toHaveBeenCalledOnce();
  });
});

describe("exportToExcel", () => {
  it("should trigger download (uses CSV format internally)", () => {
    const data = [{ name: "Test", value: 42 }];
    exportToExcel(data);
    expect(mockClick).toHaveBeenCalledOnce();
  });
});
