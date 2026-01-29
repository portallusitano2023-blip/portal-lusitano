"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-sm bg-zinc-800/50",
        className
      )}
    />
  );
}

// Skeleton para cards de produto
export function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

// Skeleton para grid de produtos
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton para artigo do jornal
export function ArticleCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[16/10] w-full" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

// Skeleton para lista de artigos
export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton para pagina de produto individual
export function ProductPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Imagens */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        </div>
        {/* Detalhes */}
        <div className="space-y-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

// Skeleton para hero section
export function HeroSkeleton() {
  return (
    <div className="relative h-screen w-full">
      <Skeleton className="absolute inset-0" />
      <div className="absolute bottom-20 left-10 space-y-4 max-w-2xl">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-12 w-48" />
      </div>
    </div>
  );
}

// Skeleton para tabela/lista
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-1/4" />
        </div>
      ))}
    </div>
  );
}
