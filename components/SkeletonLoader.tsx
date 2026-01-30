"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-zinc-800/50 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
      <Skeleton className="h-48 w-full mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

export function EbookCardSkeleton() {
  return (
    <div className="bg-zinc-900/30 border border-white/5 rounded-xl overflow-hidden hover:border-[#C5A059]/30 transition-all">
      <Skeleton className="w-full aspect-[3/4]" />
      <div className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

export function PricingCardSkeleton() {
  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-12 w-40 mb-6" />
      <Skeleton className="h-px w-full mb-6" />
      <div className="space-y-3 mb-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
      <Skeleton className="h-5 w-24 mb-2" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="border-b border-white/5 py-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}
