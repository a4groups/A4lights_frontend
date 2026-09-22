"use client";

import React from "react";
import { motion } from "framer-motion";

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

export function BrandStatement() {
  return (
    <section className="bg-soft px-5 py-28 md:px-10 md:py-44 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: EASE_SMOOTH }}
        className="mx-auto max-w-5xl text-center"
      >
        <p className="font-serif text-[clamp(2.8rem,6vw,6.5rem)] leading-[1.03] text-foreground">
          Lighting isn&apos;t just what you see.
          <br />
          <em className="text-gold">It&apos;s what a space feels like.</em>
        </p>
      </motion.div>
    </section>
  );
}
