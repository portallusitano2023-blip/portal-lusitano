import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React, { ReactNode } from "react";
import {
  HorseFavoritesProvider,
  useHorseFavorites,
  FavoriteHorse,
} from "@/context/HorseFavoritesContext";
import { ToastProvider } from "@/context/ToastContext";
import { LanguageProvider } from "@/context/LanguageContext";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
    _getStore: () => store,
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Wrapper with all required providers
function AllProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ToastProvider>
        <HorseFavoritesProvider>{children}</HorseFavoritesProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}

// Test horse data
const mockHorse1: FavoriteHorse = {
  id: "horse-1",
  slug: "xaquiro",
  name: "Xaquiro",
  breed: "Lusitano",
  age: 12,
  price: 50000,
  image: "https://example.com/xaquiro.jpg",
  location: "Portugal",
};

const mockHorse2: FavoriteHorse = {
  id: "horse-2",
  slug: "firme",
  name: "Firme",
  breed: "Lusitano",
  age: 8,
  price: 35000,
  image: "https://example.com/firme.jpg",
  location: "Portugal",
};

const mockHorse3: FavoriteHorse = {
  id: "horse-3",
  slug: "nilo",
  name: "Nilo",
  breed: "Lusitano",
  age: 15,
};

describe("HorseFavoritesContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // =============================================
  // Adicionar favoritos
  // =============================================
  describe("addToFavorites", () => {
    it("deve adicionar um cavalo aos favoritos", () => {
      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      expect(result.current.favorites).toHaveLength(0);
      expect(result.current.favoritesCount).toBe(0);

      act(() => {
        result.current.addToFavorites(mockHorse1);
      });

      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites[0].name).toBe("Xaquiro");
      expect(result.current.favoritesCount).toBe(1);
    });

    it("nao deve adicionar cavalo duplicado", () => {
      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.addToFavorites(mockHorse1);
      });

      act(() => {
        result.current.addToFavorites(mockHorse1);
      });

      // Deve manter apenas uma copia
      expect(result.current.favorites).toHaveLength(1);
    });

    it("deve adicionar multiplos cavalos diferentes", () => {
      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.addToFavorites(mockHorse1);
      });

      act(() => {
        result.current.addToFavorites(mockHorse2);
      });

      act(() => {
        result.current.addToFavorites(mockHorse3);
      });

      expect(result.current.favorites).toHaveLength(3);
      expect(result.current.favoritesCount).toBe(3);
    });
  });

  // =============================================
  // Remover favoritos
  // =============================================
  describe("removeFromFavorites", () => {
    it("deve remover um cavalo dos favoritos pelo id", () => {
      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      // Adicionar dois cavalos
      act(() => {
        result.current.addToFavorites(mockHorse1);
      });

      act(() => {
        result.current.addToFavorites(mockHorse2);
      });

      expect(result.current.favorites).toHaveLength(2);

      // Remover o primeiro
      act(() => {
        result.current.removeFromFavorites("horse-1");
      });

      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites[0].id).toBe("horse-2");
      expect(result.current.favoritesCount).toBe(1);
    });

    it("nao deve crashar ao remover id inexistente", () => {
      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.addToFavorites(mockHorse1);
      });

      // Remover id que nao existe
      act(() => {
        result.current.removeFromFavorites("nao-existe");
      });

      // Lista deve permanecer igual
      expect(result.current.favorites).toHaveLength(1);
    });
  });

  // =============================================
  // isFavorite
  // =============================================
  describe("isFavorite", () => {
    it("deve retornar true para cavalos adicionados", () => {
      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.addToFavorites(mockHorse1);
      });

      expect(result.current.isFavorite("horse-1")).toBe(true);
    });

    it("deve retornar false para cavalos nao adicionados", () => {
      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      expect(result.current.isFavorite("horse-999")).toBe(false);
    });

    it("deve retornar false apos remover o cavalo", () => {
      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.addToFavorites(mockHorse1);
      });

      expect(result.current.isFavorite("horse-1")).toBe(true);

      act(() => {
        result.current.removeFromFavorites("horse-1");
      });

      expect(result.current.isFavorite("horse-1")).toBe(false);
    });
  });

  // =============================================
  // clearFavorites
  // =============================================
  describe("clearFavorites", () => {
    it("deve limpar todos os favoritos", () => {
      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.addToFavorites(mockHorse1);
      });

      act(() => {
        result.current.addToFavorites(mockHorse2);
      });

      act(() => {
        result.current.addToFavorites(mockHorse3);
      });

      expect(result.current.favorites).toHaveLength(3);

      act(() => {
        result.current.clearFavorites();
      });

      expect(result.current.favorites).toHaveLength(0);
      expect(result.current.favoritesCount).toBe(0);
    });

    it("nao deve crashar quando clearFavorites e chamado com lista vazia", () => {
      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      expect(result.current.favorites).toHaveLength(0);

      // Nao deve dar erro
      act(() => {
        result.current.clearFavorites();
      });

      expect(result.current.favorites).toHaveLength(0);
    });
  });

  // =============================================
  // Persistencia no localStorage
  // =============================================
  describe("Persistencia localStorage", () => {
    it("deve guardar favoritos no localStorage quando adicionados", () => {
      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.addToFavorites(mockHorse1);
      });

      // O useEffect precisa de correr
      act(() => {
        vi.runAllTimers();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith("horse_favorites", expect.any(String));

      // Verificar que o conteudo salvo contem o cavalo
      const savedCalls = localStorageMock.setItem.mock.calls.filter(
        (call: string[]) => call[0] === "horse_favorites"
      );
      const lastSaved = savedCalls[savedCalls.length - 1];
      if (lastSaved) {
        const parsed = JSON.parse(lastSaved[1]);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].id).toBe("horse-1");
      }
    });

    it("deve carregar favoritos do localStorage ao montar", () => {
      // Pre-popular o localStorage
      const savedHorses = [mockHorse1, mockHorse2];
      localStorageMock.setItem("horse_favorites", JSON.stringify(savedHorses));

      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      // Deve ter carregado os 2 cavalos
      expect(result.current.favorites).toHaveLength(2);
      expect(result.current.favorites[0].name).toBe("Xaquiro");
      expect(result.current.favorites[1].name).toBe("Firme");
    });

    it("deve lidar com dados corrompidos no localStorage", () => {
      // Dados invalidos no localStorage
      localStorageMock.setItem("horse_favorites", "not-valid-json{{{");

      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      // Deve inicializar com lista vazia
      expect(result.current.favorites).toHaveLength(0);
      consoleError.mockRestore();
    });

    it("deve limpar localStorage quando clearFavorites e chamado", () => {
      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.addToFavorites(mockHorse1);
      });

      act(() => {
        result.current.clearFavorites();
      });

      // Correr timers para garantir que useEffect executa
      act(() => {
        vi.runAllTimers();
      });

      // Deve ter salvo array vazio
      const savedCalls = localStorageMock.setItem.mock.calls.filter(
        (call: string[]) => call[0] === "horse_favorites"
      );
      const lastSaved = savedCalls[savedCalls.length - 1];
      if (lastSaved) {
        const parsed = JSON.parse(lastSaved[1]);
        expect(parsed).toHaveLength(0);
      }
    });
  });

  // =============================================
  // Hook fora do Provider
  // =============================================
  describe("useHorseFavorites hook", () => {
    it("deve lancar erro quando usado fora do HorseFavoritesProvider", () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        renderHook(() => useHorseFavorites());
      }).toThrow("useHorseFavorites must be used within a HorseFavoritesProvider");

      consoleError.mockRestore();
    });
  });

  // =============================================
  // favoritesCount
  // =============================================
  describe("favoritesCount", () => {
    it("deve reflectir o numero correcto de favoritos", () => {
      const { result } = renderHook(() => useHorseFavorites(), {
        wrapper: AllProviders,
      });

      expect(result.current.favoritesCount).toBe(0);

      act(() => {
        result.current.addToFavorites(mockHorse1);
      });
      expect(result.current.favoritesCount).toBe(1);

      act(() => {
        result.current.addToFavorites(mockHorse2);
      });
      expect(result.current.favoritesCount).toBe(2);

      act(() => {
        result.current.removeFromFavorites("horse-1");
      });
      expect(result.current.favoritesCount).toBe(1);

      act(() => {
        result.current.clearFavorites();
      });
      expect(result.current.favoritesCount).toBe(0);
    });
  });
});
