"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

interface HeroProps {
  onOpenQuote: () => void;
}

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

export function Hero({ onOpenQuote }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Subtle mouse parallax (desktop only, 5-10px max)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobile) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 12;
    const y = ((clientY - top) / height - 0.5) * 12;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scrollY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : 14]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, isMobile ? 1 : 1.035]);

  return (
    <section
      ref={containerRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[780px] overflow-hidden bg-charcoal text-ivory lg:min-h-[860px]"
    >
      {/* Background Hero Image with subtle parallax */}
      <motion.div
        initial={{ opacity: 0, scale: isMobile ? 1 : 1.04 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: mouseOffset.x,
          y: mouseOffset.y,
        }}
        transition={{
          opacity: { duration: 1.1, ease: EASE_SMOOTH },
          scale: { duration: 1.2, ease: EASE_SMOOTH },
          x: { duration: 0.8, ease: "easeOut" },
          y: { duration: 0.8, ease: "easeOut" },
        }}
        style={{ y: scrollY, scale: scrollScale }}
        className="absolute inset-0 h-full w-full"
      >
        <img
          src="/assets/a4lights-hero-BClK_M-r.jpg"
          alt="Contemporary interior illuminated with sculptural pendant and integrated architectural lighting"
          className="h-full w-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 bg-hero-overlay pointer-events-none" />

      {/* Hero Content */}
      <div className="relative mx-auto flex min-h-[780px] max-w-[1480px] items-end px-5 pb-24 pt-32 md:px-10 lg:min-h-[860px] lg:items-center lg:px-16 lg:pb-0">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE_SMOOTH }}
            className="mb-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory/75"
          >
            Lighting solutions for a brighter tomorrow
          </motion.p>

          {/* Headline with line-by-line reveal */}
          <h1 className="font-serif text-[clamp(3.7rem,7.5vw,7.6rem)] leading-[0.88] tracking-normal">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.35, duration: 0.85, ease: EASE_SMOOTH }}
              >
                Better Light.
              </motion.span>
            </span>
            <span className="block overflow-hidden mt-1 md:mt-2">
              <motion.span
                className="block italic text-champagne"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.47, duration: 0.85, ease: EASE_SMOOTH }}
              >
                Brighter Spaces.
              </motion.span>
            </span>
          </h1>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7, ease: EASE_SMOOTH }}
            className="mt-7 max-w-xl text-sm leading-7 text-ivory/80 md:text-base"
          >
            A4Lights manufactures LED lighting solutions and provides
            professional installation support for residential, commercial and
            project applications.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.92, duration: 0.65, ease: EASE_SMOOTH }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <a
              href="#products"
              className="group flex items-center gap-8 bg-ivory px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal transition-colors duration-300 hover:bg-white"
            >
              <span>Explore Products</span>
              <ArrowDown
                size={15}
                className="transition-transform duration-300 group-hover:translate-y-1"
              />
            </a>

            <button
              type="button"
              onClick={onOpenQuote}
              className="group flex items-center gap-8 border border-ivory/55 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-ivory transition-colors duration-300 hover:bg-ivory hover:text-charcoal"
            >
              <span>Request a Quote</span>
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
