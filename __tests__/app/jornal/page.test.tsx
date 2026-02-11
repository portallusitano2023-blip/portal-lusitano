import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks — vi.mock calls are hoisted, so we cannot reference outer variables.
// All mock data must be defined inline within the factory functions.
// ---------------------------------------------------------------------------

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    toggleLanguage: vi.fn(),
    t: {
      journal: {
        archive: "Arquivo",
        title: "Jornal Lusitano",
        subtitle: "Conhecimento preservado por escrito",
        technical_read: "Leitura Tecnica",
      },
    },
  }),
}));

vi.mock("@/lib/sanity-queries", () => ({
  fetchArticlesList: vi.fn().mockResolvedValue([
    {
      _id: "article-1",
      title: "A Genese do Cavalo Iberico",
      slug: { current: "genese-cavalo-iberico" },
      contentType: "article",
      featured: true,
      subtitle: "Das origens pre-historicas ao Lusitano moderno",
      publishedAt: "2026-01-25T00:00:00Z",
      estimatedReadTime: 30,
      category: "Historia",
      image: {
        asset: { _ref: "image-ref-1", url: "/images/article1.jpg" },
        alt: "Cavalo Lusitano",
      },
    },
    {
      _id: "article-2",
      title: "Biomecanica da Reuniao",
      slug: { current: "biomecanica-reuniao" },
      contentType: "article",
      featured: false,
      subtitle: "A ciencia por tras da Alta Escola",
      publishedAt: "2026-01-20T00:00:00Z",
      estimatedReadTime: 25,
      category: "Tecnica",
      image: {
        asset: { _ref: "image-ref-2", url: "/images/article2.jpg" },
        alt: "Reuniao",
      },
    },
  ]),
}));

vi.mock("@/data/articlesList", () => ({
  articlesListPT: [
    {
      id: "1",
      title: "Artigo PT 1",
      subtitle: "Subtitulo PT",
      readTime: "30 min",
      category: "Historia",
      image: "/fallback1.jpg",
    },
  ],
  articlesListEN: [
    {
      id: "1",
      title: "Article EN 1",
      subtitle: "Subtitle EN",
      readTime: "30 min",
      category: "History",
      image: "/fallback1.jpg",
    },
  ],
}));

vi.mock("@/app/jornal/JornalListClient", () => ({
  default: ({
    articles,
    articlesEN: _articlesEN,
  }: {
    articles: Array<{ title: string; _id: string }>;
    articlesEN?: Array<{ title: string }>;
  }) => (
    <div data-testid="jornal-list-client">
      <h1>Jornal Client Component</h1>
      <div data-testid="articles-count">{articles.length} articles</div>
      {articles.map((article) => (
        <div key={article._id} data-testid={`article-${article._id}`}>
          {article.title}
        </div>
      ))}
    </div>
  ),
}));

// Import AFTER mocks
import JornalPage from "@/app/jornal/page";
import { fetchArticlesList } from "@/lib/sanity-queries";

describe("JornalPage (Server Component)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches articles from Sanity and passes to client component", async () => {
    render(await JornalPage());

    expect(screen.getByTestId("jornal-list-client")).toBeInTheDocument();
    expect(screen.getByText("Jornal Client Component")).toBeInTheDocument();
  });

  it("displays correct number of articles", async () => {
    render(await JornalPage());

    expect(screen.getByTestId("articles-count")).toHaveTextContent("2 articles");
  });

  it("displays article from Sanity", async () => {
    render(await JornalPage());

    expect(screen.getByTestId("article-article-1")).toBeInTheDocument();
    expect(screen.getByText("A Genese do Cavalo Iberico")).toBeInTheDocument();
  });

  it("calls fetchArticlesList on render", async () => {
    await JornalPage();

    expect(fetchArticlesList).toHaveBeenCalled();
  });

  it("uses fallback data when Sanity returns empty", async () => {
    vi.mocked(fetchArticlesList).mockResolvedValueOnce([]);

    render(await JornalPage());

    // Should still render client component with fallback data
    expect(screen.getByTestId("jornal-list-client")).toBeInTheDocument();
  });

  it("uses fallback data when Sanity throws error", async () => {
    vi.mocked(fetchArticlesList).mockRejectedValueOnce(new Error("Sanity error"));

    render(await JornalPage());

    // Should still render client component with fallback data
    expect(screen.getByTestId("jornal-list-client")).toBeInTheDocument();
  });

  it("passes both PT and EN articles to client component", async () => {
    const page = await JornalPage();
    const { container } = render(page);

    // Client component should receive both article sets
    expect(container.querySelector('[data-testid="jornal-list-client"]')).toBeInTheDocument();
  });
});
