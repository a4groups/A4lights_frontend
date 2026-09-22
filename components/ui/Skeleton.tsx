"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="group">
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="mt-5 h-2.5 w-20" />
      <Skeleton className="mt-3 h-6 w-3/4" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-2/3" />
      <Skeleton className="mt-5 h-4 w-28" />
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-5 border-b border-border py-6">
      <Skeleton className="h-24 w-20 shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-24 shrink-0" />
    </div>
  );
}

export function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-border py-5">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="border border-border p-6">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-10 w-16" />
      <Skeleton className="mt-2 h-3 w-28" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 pr-6">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
