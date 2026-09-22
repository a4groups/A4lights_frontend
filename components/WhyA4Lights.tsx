"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

const items = [
  {
    number: "01",
    title: "Manufacturing",
    text: "Thoughtful production processes bring together materials, light and form for dependable everyday performance.",
    image: "/assets/a4lights-manufacturing-LB_f2kw1.jpg",
  },
  {
    number: "02",
    title: "Quality-Focused Products",
    text: "Every product is considered through the lens of finish, consistency and its contribution to the spaces it illuminates.",
    image: "/assets/a4lights-product-DkxLuMym.jpg",
  },
  {
    number: "03",
    title: "Project Support",
    text: "From early selection through supply, our team supports residential, commercial and project lighting requirements.",
    image: "/assets/a4lights-application-BDr6iJ2h.jpg",
  },
  {
    number: "04",
    title: "Installation Support",
    text: "Professional installation support helps turn a considered lighting plan into a finished, functional environment.",
    image: "/assets/a4lights-installation-CnkZCkme.jpg",
  },
];

export function WhyA4Lights() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = items[activeIndex] ?? items[0];

  return (
    <section
      id="about"
      className="bg-charcoal px-5 py-24 text-ivory md:px-10 md:py-36 lg:px-16"
    >
      <div className="mx-auto max-w-[1480px]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
        >
          <p className="section-label text-champagne">Why A4Lights</p>
          <h2 className="section-title max-w-3xl">
            A considered approach
            <br />
            to <em>every project.</em>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Numbered tabs list */}
          <div className="border-t border-ivory/20">
            {items.map((item, index) => (
              <button
                key={item.number}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`group flex w-full items-center gap-7 border-b border-ivory/20 py-6 text-left transition-colors duration-300 ${
                  activeIndex === index
                    ? "text-ivory"
                    : "text-ivory/45 hover:text-ivory/80"
                }`}
              >
                <span className="text-xs text-champagne font-mono">
                  {item.number}
                </span>
                <span className="font-serif text-xl md:text-2xl">
                  {item.title}
                </span>
                <ArrowUpRight
                  size={16}
                  className={`ml-auto transition-all duration-300 ${
                    activeIndex === index
                      ? "translate-x-0 opacity-100 text-champagne"
                      : "-translate-x-2 opacity-0"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Active Content Showcase */}
          <div className="min-h-[520px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.number}
                initial={{ opacity: 0, x: 18, scale: 0.99 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.45, ease: EASE_SMOOTH }}
              >
                <div className="overflow-hidden bg-ivory/5">
                  <img
                    src={current.image}
                    alt={current.title}
                    loading="lazy"
                    width={1000}
                    height={700}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <div className="mt-7 grid gap-3 md:grid-cols-[1fr_1.2fr]">
                  <h3 className="font-serif text-3xl">{current.title}</h3>
                  <p className="text-sm leading-7 text-ivory/65">
                    {current.text}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
