"use client";

import React from "react";

const STATUS_MAP: Record<string, { label: string; classes: string }> = {
  pending:     { label: "Pending",    classes: "bg-amber-100 text-amber-800" },
  confirmed:   { label: "Confirmed",  classes: "bg-blue-100 text-blue-800" },
  completed:   { label: "Completed",  classes: "bg-gold/15 text-foreground" },
  cancelled:   { label: "Cancelled",  classes: "bg-muted text-muted-foreground" },
  new:         { label: "New",        classes: "bg-blue-100 text-blue-800" },
  in_progress: { label: "In Progress",classes: "bg-amber-100 text-amber-800" },
  resolved:    { label: "Resolved",   classes: "bg-gold/15 text-foreground" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] ?? { label: status, classes: "bg-muted text-muted-foreground" };
  return (
    <span className={`inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${config.classes}`}>
      {config.label}
    </span>
  );
}
