"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface FeaturedProductsProps {
  onEnquireProduct: (productName: string) => void;
}

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

const featured = [
  {
    name: "Arc Downlight",
    type: "Architectural downlight",
    description:
      "A refined surface-mounted fixture for focused, comfortable illumination.",
    image: "/assets/a4lights-product-DkxLuMym.jpg",
  },
  {
    name: "Halo Panel",
    type: "LED panel",
    description:
      "A minimal lighting plane for calm and evenly illuminated interiors.",
    image: "/assets/a4lights-manufacturing-LB_f2kw1.jpg",
  },
  {
    name: "Line Pendant",
    type: "Decorative lighting",
    description:
      "A sculptural lighting element that brings warmth and definition to a room.",
    image: "/assets/a4lights-hero-BClK_M-r.jpg",
  },
];

export function FeaturedProducts({ onEnquireProduct }: FeaturedProductsProps) {
  return (
    <section className="bg-background px-5 py-24 md:px-10 md:py-36 lg:px-16">
      <div className="mx-auto max-w-[1480px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
        >
          <p className="section-label">Selected range</p>
          <h2 className="section-title">
            Featured <em>Products.</em>
          </h2>
        </motion.div>

        {/* 3 Products Grid */}
        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {featured.map((item, index) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.7,
                ease: EASE_SMOOTH,
              }}
              className="group"
            >
              {/* Product Image Frame */}
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              {/* Product Details */}
              <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-gold">
                {item.type}
              </p>
              <h3 className="mt-2 font-serif text-2xl text-foreground">
                {item.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>

              {/* Enquire Now Link */}
              <button
                type="button"
                onClick={() => onEnquireProduct(item.name)}
                className="mt-5 inline-flex items-center gap-3 border-b border-foreground pb-1 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-gold hover:text-gold"
              >
                <span>Enquire Now</span>
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
