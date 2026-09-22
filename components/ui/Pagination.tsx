"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  let last = 0;
  const withEllipsis: (number | "…")[] = [];
  for (const p of visiblePages) {
    if (last && p - last > 1) withEllipsis.push("…");
    withEllipsis.push(p);
    last = p;
  }

  return (
    <div className="mt-12 flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="grid size-9 place-items-center border border-border text-foreground/60 transition-colors hover:border-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={15} />
      </button>

      {withEllipsis.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`grid size-9 place-items-center text-xs font-semibold uppercase tracking-wider transition-colors ${
              page === p
                ? "bg-foreground text-background"
                : "border border-border text-foreground/60 hover:border-foreground hover:text-foreground"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="grid size-9 place-items-center border border-border text-foreground/60 transition-colors hover:border-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}
