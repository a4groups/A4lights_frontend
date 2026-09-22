"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, RefreshCw, CheckCircle2 } from "lucide-react";

export default function RefundAndCancellationPage() {
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
          <span className="section-label text-champagne mb-0 block">Customer Assurance</span>
          <h1 className="section-title text-ivory mt-2">
            Refund & <em>Cancellation.</em>
          </h1>
          <p className="mt-4 text-xs text-ivory/50">
            A4LIGHTS Order Fulfillment & Return Guidelines
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="px-5 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[960px] space-y-12 text-sm text-foreground/85 leading-relaxed">
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              1. Order Cancellation Policy
            </h2>
            <p className="text-muted-foreground">
              Orders placed for standard catalog luminaires can be cancelled within <strong>24 hours</strong> of
              placement or prior to warehouse dispatch (whichever is earlier). Once a tracking consignment is
              generated and handed over to logistics partners, the order cannot be cancelled in transit.
            </p>
            <p className="text-muted-foreground">
              To request an order cancellation, please contact support at <strong>support@a4lights.com</strong> with
              your Order Number (e.g. <code>A4-XXXXXX</code>).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              2. Transit Damage & Dead-On-Arrival (DOA)
            </h2>
            <p className="text-muted-foreground">
              We package our architectural glass and precision fixtures in reinforced cellular crates. In the rare event
              that a package arrives with visible carton damage or non-functional electronic drivers:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Report the damage within <strong>48 hours</strong> of physical delivery receipt.</li>
              <li>Provide clear photographs or an unboxing video showing the shipping label and the damaged fixture.</li>
              <li>A4LIGHTS will dispatch an expedited replacement unit free of any additional charge.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              3. Returns & Exchange Eligibility
            </h2>
            <p className="text-muted-foreground">
              Items may be returned for exchange or store credit within <strong>7 days</strong> of delivery provided:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>The fixture has not been mounted, wired, modified, or energized.</li>
              <li>All original packaging, mounting brackets, manual leaflets, and driver boxes are intact.</li>
              <li>Custom-cut linear profiles, custom anodized finishes, or bespoke chandeliers made to order are non-returnable.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              4. Refund Processing & Timelines
            </h2>
            <p className="text-muted-foreground">
              Approved cancellations and return refunds are processed within <strong>5 to 7 business days</strong> following
              quality inspection at our fulfillment facility. Reimbursements are credited to the original mode of payment
              or bank transfer for trade accounts.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
