"use client";

import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {icon && (
        <div className="mb-6 text-muted-foreground opacity-40">{icon}</div>
      )}
      <p className="section-label">Empty</p>
      <h3 className="mt-2 font-serif text-3xl text-foreground">{title}</h3>
      {description && (
        <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
