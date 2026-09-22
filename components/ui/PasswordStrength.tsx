"use client";

import React from "react";

interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[@$!%*?&_#]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-destructive" };
  if (score === 2) return { score: 2, label: "Fair", color: "bg-champagne" };
  if (score === 3) return { score: 3, label: "Good", color: "bg-gold" };
  if (score >= 4) return { score: 4, label: "Strong", color: "bg-foreground" };
  return { score: 0, label: "", color: "" };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label, color } = getStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 transition-all duration-300 ${
              i <= score ? color : "bg-border"
            }`}
          />
        ))}
      </div>
      <p
        className={`mt-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
          score === 1
            ? "text-destructive"
            : score === 2
            ? "text-champagne"
            : score === 3
            ? "text-gold"
            : "text-foreground"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
