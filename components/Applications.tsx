"use client";

import React from "react";
import { motion } from "framer-motion";

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

const applicationCategories = [
  "Homes",
  "Offices",
  "Retail",
  "Hospitality",
  "Industrial",
];

export function Applications() {
  return (
    <section className="overflow-hidden bg-background py-24 md:py-36">
      {/* Title & Category tags */}
      <div className="mx-auto max-w-[1480px] px-5 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
          className="mb-14 flex flex-wrap items-end justify-between gap-5"
        >
          <div>
            <p className="section-label">Applications</p>
            <h2 className="section-title">
              Light, in <em>context.</em>
            </h2>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-wider text-muted-foreground">
            {applicationCategories.map((cat) => (
              <span key={cat}>{cat}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Large Showcase Image Block */}
      <motion.div
        initial={{ opacity: 0, x: 24, scale: 1.02 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EASE_SMOOTH }}
        className="mx-auto max-w-[1600px] px-0 md:px-10"
      >
        <div className="overflow-hidden bg-muted">
          <img
            src="/assets/a4lights-application-BDr6iJ2h.jpg"
            alt="Hospitality interior with layered architectural lighting"
            loading="lazy"
            width={1600}
            height={1008}
            className="aspect-[16/8.5] min-h-[420px] w-full object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
