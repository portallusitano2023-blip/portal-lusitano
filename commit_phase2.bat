@echo off
echo =============================================
echo PHASE 2 PERFORMANCE IMPROVEMENTS - COMMITS
echo =============================================

echo.
echo [1/3] Committing: Sanity pagination
git add lib/sanity-queries.ts
git commit -m "perf(sanity): add paginated fetchArticlesPage with GROQ slice syntax" -m "- Add fetchArticlesPage({ skip, limit }) using GROQ [$skip...$to] slice (exclusive end)" -m "- Add fetchArticlesCount() for pagination UI controls" -m "- Add ArticlesPaginationParams type + ARTICLES_DEFAULT_LIMIT=20" -m "- Keep fetchArticlesList() for backward compat (existing /jornal page unchanged)" -m "- GROQ slice is processed server-side — only the requested window is transferred"

echo.
echo [2/3] Committing: Cache system upgrade
git add lib/cache.ts
git commit -m "perf(cache): add createServerCache (unstable_cache) + withUpstashCache" -m "- Import unstable_cache from next/cache at module top (fixes 0%% hit rate)" -m "- Add createServerCache() — Next.js Data Cache, survives cold starts" -m "- Add withUpstashCache() — Redis-backed with graceful degradation" -m "- ServerCacheOptions type: key[], revalidate (seconds|false), tags[]" -m "- Mark memCache/memoize/memoizeAsync @deprecated (kept for test compat)" -m "- Expected: ~90%% cache hit rate vs 0%% with memCache on Vercel serverless"

echo.
echo [3/3] Committing: Server Component conversions
git add components/SkipLinks.tsx components/TextSplit.tsx components/Breadcrumb.tsx
git commit -m "perf(rsc): convert SkipLinks, TextSplit, Breadcrumb to Server Components" -m "- Remove incorrect 'use client' directive from 3 static components" -m "- SkipLinks: pure HTML anchors, no hooks/browser APIs" -m "- TextSplit: CSS-only word animation, no hooks (comment already said zero JS)" -m "- Breadcrumb: no hooks; LocalizedLink client boundary preserved inside" -m "- Each component removed from client JS bundle sent to browser"

echo.
echo =============================================
echo Done! Run 'git log --oneline -5' to verify.
echo =============================================
pause
