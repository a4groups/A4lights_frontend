"use client";

import React from "react";
import { useQuote } from "@/components/ClientLayout";
import { Hero } from "@/components/Hero";
import { BrandStatement } from "@/components/BrandStatement";
import { ProductLineup } from "@/components/ProductLineup";
import { WhyA4Lights } from "@/components/WhyA4Lights";
import { Manufacturing } from "@/components/Manufacturing";
import { Installation } from "@/components/Installation";
import { Applications } from "@/components/Applications";
import { TechnicalShowcase } from "@/components/TechnicalShowcase";
import { TrustStrip } from "@/components/TrustStrip";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";

export default function Home() {
  const { openQuote } = useQuote();

  return (
    <div className="relative font-sans text-foreground">
      {/* Hero Section with Parallax & Reveals */}
      <Hero onOpenQuote={() => openQuote()} />

      {/* Brand Statement with Editorial Typography */}
      <BrandStatement />

      {/* 6 Product Categories */}
      <ProductLineup />

      {/* Why A4Lights Interactive Tabs */}
      <WhyA4Lights />

      {/* Manufacturing Section */}
      <Manufacturing />

      {/* Professional Installation Support Timeline */}
      <Installation />

      {/* Architectural Applications Showcase */}
      <Applications />

      {/* Technical Showcase with Callouts */}
      <TechnicalShowcase />

      {/* Horizontal Trust Strip */}
      <TrustStrip />

      {/* 3 Featured Products */}
      <FeaturedProducts
        onEnquireProduct={(productName) => openQuote(productName)}
      />

      {/* FAQ Accordion */}
      <FAQ />

      {/* Final CTA with subtle light sweep */}
      <FinalCTA onOpenQuote={() => openQuote()} />
    </div>
  );
}
