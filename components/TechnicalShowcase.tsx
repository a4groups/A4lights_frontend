"use client";

import React from "react";
import { motion } from "framer-motion";

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

const callouts = [
  "Power",
  "Luminous Output",
  "Colour Temperature",
  "Beam Angle",
  "Material",
  "IP Rating",
];

export function TechnicalShowcase() {
  return (
    <section className="bg-soft px-5 py-24 md:px-10 md:py-36 lg:px-16">
      <div className="mx-auto max-w-[1280px] text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
        >
          <p className="section-label">Technical showcase</p>
          <h2 className="section-title">
            Designed in <em>detail.</em>
          </h2>
        </motion.div>

        <div className="relative mx-auto mt-12 max-w-4xl">
          {/* Main Product Photograph */}
          <motion.img
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_SMOOTH }}
            src="/assets/a4lights-product-DkxLuMym.jpg"
            alt="Black and champagne architectural ceiling downlight"
            loading="lazy"
            width={1200}
            height={1200}
            className="mx-auto aspect-square w-full max-w-2xl object-cover"
          />

          {/* Technical Callouts around the product image */}
          {callouts.map((label, index) => {
            const isLeft = index % 2 === 0;
            const topPositionClass =
              index < 2
                ? "md:top-[18%]"
                : index < 4
                ? "md:top-[48%]"
                : "md:top-[78%]";

            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: isLeft ? -14 : 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.2 + index * 0.1,
                  duration: 0.55,
                  ease: EASE_SMOOTH,
                }}
                className={`relative flex items-center gap-3 border-t border-border py-3 text-left text-xs uppercase tracking-wider text-foreground md:absolute md:w-44 ${
                  isLeft ? "md:left-0" : "md:right-0"
                } ${topPositionClass}`}
              >
                <span className="size-1.5 shrink-0 rounded-full bg-gold" />
                <span>{label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
