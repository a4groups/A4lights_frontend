"use client";

import React from "react";
import { motion } from "framer-motion";

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

const steps = ["Understand", "Recommend", "Supply", "Install"];

export function Installation() {
  return (
    <section
      id="installation"
      className="bg-soft px-5 py-24 md:px-10 md:py-36 lg:px-16"
    >
      <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left: Process Timeline and Text */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
          className="order-2 lg:order-1 lg:pt-14"
        >
          <p className="section-label">Installation support</p>
          <h2 className="section-title">
            More Than
            <br />
            <em>Just Lighting.</em>
          </h2>
          <p className="mt-7 max-w-md text-sm leading-7 text-muted-foreground">
            We help carry your lighting intent through—from understanding the
            space to supporting a professional installation.
          </p>

          {/* Staggered process timeline */}
          <div className="relative mt-12 pl-9">
            {/* Animated vertical connecting line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE_SMOOTH }}
              className="absolute bottom-4 left-[7px] top-4 w-px origin-top bg-gold"
            />

            {steps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.12,
                  duration: 0.55,
                  ease: EASE_SMOOTH,
                }}
                className="relative flex items-baseline gap-6 py-4"
              >
                <span className="absolute -left-9 top-6 size-[15px] rounded-full border border-gold bg-soft" />
                <span className="font-mono text-xs text-gold">0{index + 1}</span>
                <span className="font-serif text-2xl text-foreground">
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Installation Image */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
          className="order-1 overflow-hidden lg:order-2 bg-muted"
        >
          <img
            src="/assets/a4lights-installation-CnkZCkme.jpg"
            alt="Professional installing a recessed ceiling light"
            loading="lazy"
            width={1408}
            height={1056}
            className="h-full min-h-[520px] w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
