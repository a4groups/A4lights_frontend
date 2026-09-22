"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Award, Compass, ShieldCheck, Cpu } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutPage() {
  const pillars = [
    {
      icon: Compass,
      title: "Architectural Intent",
      desc: "Every luminaire is designed to integrate seamlessly into modern architectural envelopes without visual noise.",
    },
    {
      icon: Cpu,
      title: "Optical Engineering",
      desc: "Custom reflectors, anti-glare louvers, and high CRI LED engines engineered for maximum visual comfort.",
    },
    {
      icon: Award,
      title: "Material Discipline",
      desc: "Aerospace-grade extruded aluminum, brass accents, and precision CNC finishes that age gracefully.",
    },
    {
      icon: ShieldCheck,
      title: "Enduring Longevity",
      desc: "Built with industry-leading thermal management and certified drivers for over 50,000 hours of continuous performance.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-charcoal px-5 pb-20 pt-36 md:px-10 lg:px-16 text-ivory relative overflow-hidden">
        <div className="mx-auto max-w-[1480px]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="section-label text-champagne">Heritage & Studio</p>
            <h1 className="section-title text-ivory">
              About <em>A4LIGHTS.</em>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-ivory/70">
              A4LIGHTS was founded at the intersection of architectural purity and
              advanced solid-state lighting. We craft precision illumination systems
              for environments where light defines experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="px-5 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="section-label">Design Philosophy</span>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground leading-snug">
                Illumination as an architectural material, not an afterthought.
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                In architectural design, light is the medium that reveals form, texture,
                and rhythm. Our fixtures are conceived with restraint — minimal bezels,
                deeply recessed light sources, and uncompromised color rendering.
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                From bespoke residential villas to sprawling hospitality resorts and
                corporate headquarters, A4LIGHTS collaborates closely with architects,
                lighting consultants, and interior designers to bring complex illumination
                concepts to reality.
              </p>

              <div className="pt-4 flex gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest text-background hover:bg-gold hover:text-foreground transition-colors"
                >
                  <span>Explore Products</span>
                  <ArrowUpRight size={14} />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-muted transition-colors"
                >
                  <span>Our Services</span>
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
              <img
                src="/assets/a4lights-manufacturing-LB_f2kw1.jpg"
                alt="A4LIGHTS Precision Manufacturing"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="bg-muted/30 px-5 py-24 md:px-10 lg:px-16 border-y border-border/80">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-14">
            <span className="section-label">Our Core Values</span>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
              Built on Precision & Discretion
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="p-8 bg-card border border-border/70 space-y-4">
                  <div className="p-3 bg-muted w-fit text-foreground">
                    <Icon size={20} className="text-gold" />
                  </div>
                  <h3 className="font-serif text-xl font-normal text-foreground">
                    {p.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
