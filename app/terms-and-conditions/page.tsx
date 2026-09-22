"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-charcoal px-5 pb-16 pt-36 md:px-10 lg:px-16 text-ivory">
        <div className="mx-auto max-w-[960px]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-champagne/70 hover:text-champagne mb-6 uppercase tracking-wider font-semibold transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Return to Store</span>
          </Link>
          <span className="section-label text-champagne mb-0 block">Contractual Agreement</span>
          <h1 className="section-title text-ivory mt-2">
            Terms & <em>Conditions.</em>
          </h1>
          <p className="mt-4 text-xs text-ivory/50">
            Effective Date: September 2026 • A4LIGHTS Architectural Systems
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="px-5 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[960px] space-y-12 text-sm text-foreground/85 leading-relaxed">
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing, browsing, or placing orders through the A4LIGHTS portal, you agree
              to be legally bound by these Terms and Conditions. If you do not agree with any part
              of these terms, please refrain from using this website or ordering our architectural products.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              2. Architectural Specifications & Technical Data
            </h2>
            <p className="text-muted-foreground">
              We strive to provide precise photometric ratings, beam angle tolerances, color rendering
              indices (CRI), and dimensional drawings. However, natural variances in anodized aluminum
              finishes, architectural brass patinas, and hand-blown glass elements are inherent to the
              bespoke manufacturing process and do not constitute defect.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              3. Orders, Pricing, and Availability
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>All prices displayed are in Indian National Rupees (₹ INR) inclusive of applicable taxes unless otherwise noted.</li>
              <li>Placing an order constitutes an offer to purchase. A4LIGHTS reserves the right to decline or cancel orders due to stock depletion, technical inaccuracies, or transit constraints.</li>
              <li>Order numbers generated upon checkout serve as formal transaction identifiers for fulfillment tracking.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              4. Warranty & Installation Guidelines
            </h2>
            <p className="text-muted-foreground">
              All architectural LED products are backed by our standard 2-year manufacturer warranty
              against LED chip failure and driver malfunction. This warranty requires installation by
              licensed electrical contractors conforming to our supplied technical wiring diagrams and
              proper surge protection.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              5. Intellectual Property
            </h2>
            <p className="text-muted-foreground">
              All luminaire designs, CAD specifications, product imagery, brand trademarks, and
              photometric data published on A4LIGHTS are the exclusive intellectual property of A4LIGHTS.
              Unauthorized reproduction or commercial exploitation is strictly prohibited.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
