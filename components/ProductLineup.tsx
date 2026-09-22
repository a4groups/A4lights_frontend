"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

const DEFAULT_IMAGES: Record<string, string> = {
  "led-bulbs": "/assets/a4lights-product-DkxLuMym.jpg",
  "led-panels": "/assets/a4lights-manufacturing-LB_f2kw1.jpg",
  "downlights": "/assets/a4lights-installation-CnkZCkme.jpg",
  "floodlights": "/assets/a4lights-application-BDr6iJ2h.jpg",
  "decorative-lighting": "/assets/a4lights-hero-BClK_M-r.jpg",
  "commercial-and-industrial": "/assets/a4lights-manufacturing-LB_f2kw1.jpg",
};

export function ProductLineup() {
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const list = data?.data?.categories ?? (Array.isArray(data?.data) ? data.data : []);
        const clean = (Array.isArray(list) ? list : []).filter(
          (c: any) => !c.name?.toLowerCase().includes("qa test")
        );
        setCategories(clean);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section
      id="products"
      className="bg-background px-5 py-24 md:px-10 md:py-36 lg:px-16"
    >
      <div className="mx-auto max-w-[1480px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
          className="mb-14 grid gap-5 md:grid-cols-2 md:items-end"
        >
          <div>
            <p className="section-label">Our products</p>
            <h2 className="section-title">
              Lighting for
              <br />
              <em>Every Space.</em>
            </h2>
          </div>
          <div className="justify-self-end text-right">
            <p className="max-w-md text-sm leading-7 text-muted-foreground mb-3">
              A considered range of lighting products designed for the different
              ways people live, work and gather.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-foreground hover:text-gold transition-colors"
            >
              <span>View Full Catalog</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* 6 Category Tiles leading directly to /products */}
        <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.06,
                ease: EASE_SMOOTH,
              }}
            >
              <Link
                href={`/products?category=${category.slug}`}
                className="group block border-b border-border pb-5 transition-colors duration-300 hover:border-foreground"
              >
                <div className="mb-5 aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={
                      category.image ||
                      DEFAULT_IMAGES[category.slug] ||
                      "/assets/a4lights-hero-BClK_M-r.jpg"
                    }
                    alt={`${category.name} lighting by A4Lights`}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl text-foreground transition-transform duration-300 group-hover:translate-x-1">
                    {category.name}
                  </h3>
                  <ArrowUpRight
                    size={18}
                    className="text-gold transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
