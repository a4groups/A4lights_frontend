"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

export function Manufacturing() {
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.04, 1, isMobile ? 1 : 1.04]
  );

  const points = [
    "Considered material selection",
    "Consistent production process",
    "Attention to finish and function",
  ];

  return (
    <section
      ref={containerRef}
      className="bg-background px-5 py-24 md:px-10 md:py-36 lg:px-16"
    >
      <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
        {/* Left: Manufacturing production image with scroll scale */}
        <div className="overflow-hidden bg-muted">
          <motion.img
            style={{ scale }}
            src="/assets/a4lights-manufacturing-LB_f2kw1.jpg"
            alt="Lighting fixture assembly in a professional production environment"
            loading="lazy"
            width={1408}
            height={1008}
            className="aspect-[5/4] w-full object-cover"
          />
        </div>

        {/* Right: Text and thin separators */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
          className="lg:pb-4"
        >
          <p className="section-label">Manufacturing</p>
          <h2 className="section-title">
            Engineered
            <br />
            <em>With Purpose.</em>
          </h2>
          <p className="mt-7 max-w-lg text-sm leading-7 text-muted-foreground">
            From material selection to final assembly, each stage is guided by a
            clear purpose: creating lighting products that feel considered in
            both form and function.
          </p>

          <div className="mt-10 border-t border-border">
            {points.map((point, i) => (
              <div
                key={point}
                className="flex items-center gap-5 border-b border-border py-4 text-sm"
              >
                <span className="font-mono text-xs text-gold">0{i + 1}</span>
                <span className="text-foreground">{point}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
