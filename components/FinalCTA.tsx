"use client";

import React from "react";
import { motion } from "framer-motion";

interface FinalCTAProps {
  onOpenQuote: () => void;
}

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

export function FinalCTA({ onOpenQuote }: FinalCTAProps) {
  return (
    <section
      id="contact"
      className="relative isolate min-h-[620px] overflow-hidden text-ivory"
    >
      {/* Background Architectural Image */}
      <img
        src="/assets/a4lights-cta-DAW__Tbt.jpg"
        alt="Modern residential interior illuminated with warm architectural lighting"
        loading="lazy"
        width={1600}
        height={1008}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-cta-overlay" />

      {/* Subtle animated light sweep across image */}
      <div className="light-sweep absolute inset-0 pointer-events-none" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_SMOOTH }}
        className="relative mx-auto flex min-h-[620px] max-w-[1480px] flex-col items-center justify-center px-5 py-24 text-center"
      >
        <p className="section-label text-champagne">Start a conversation</p>
        <h2 className="font-serif text-[clamp(3rem,6vw,6.3rem)] leading-[0.95]">
          Planning a
          <br />
          <em>Lighting Project?</em>
        </h2>
        <p className="mt-7 max-w-xl text-sm leading-7 text-ivory/75">
          Tell us about your space, application and lighting requirements. We’ll
          help you find a considered way forward.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onOpenQuote}
            className="bg-ivory px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal transition-colors hover:bg-white"
          >
            Request a Quote
          </button>
          <button
            type="button"
            onClick={onOpenQuote}
            className="border border-ivory/60 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-ivory transition-colors hover:bg-ivory hover:text-charcoal"
          >
            Contact Us
          </button>
        </div>
      </motion.div>
    </section>
  );
}
