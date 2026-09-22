"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <div className="flex items-center gap-3">
            <span className="section-label text-champagne mb-0">Legal Compliance</span>
          </div>
          <h1 className="section-title text-ivory mt-2">
            Privacy <em>Policy.</em>
          </h1>
          <p className="mt-4 text-xs text-ivory/50">
            Last Updated: September 2026 • A4LIGHTS Systems Pvt. Ltd.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="px-5 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[960px] space-y-12 text-sm text-foreground/85 leading-relaxed">
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              1. Overview & Commitment
            </h2>
            <p>
              At A4LIGHTS (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we respect your privacy and are committed
              to safeguarding the personal data you share with us. This Privacy Policy
              describes how we collect, use, disclose, and protect your information when
              you visit our website, place orders, or request architectural lighting services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Identity Data:</strong> Name, phone number, and email address provided during account registration or checkout.
              </li>
              <li>
                <strong className="text-foreground">Delivery Data:</strong> Shipping addresses, city, state, postal code, and recipient contact details.
              </li>
              <li>
                <strong className="text-foreground">Transaction & Order Records:</strong> Order numbers, product selections, quantities, order values, and fulfillment timestamps.
              </li>
              <li>
                <strong className="text-foreground">Inquiry Details:</strong> Project descriptions, lighting requirements, and technical specifications submitted via our quote request forms.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              3. How We Use Your Information
            </h2>
            <p className="text-muted-foreground">
              We process your personal information strictly for legitimate business purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Fulfilling, packaging, and dispatching your architectural lighting orders.</li>
              <li>Transmitting order status updates, confirmation notifications, and invoice records.</li>
              <li>Responding to design consultations, custom luminaire inquiries, and technical support requests.</li>
              <li>Maintaining authenticated user sessions and securing access tokens via encrypted protocols.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              4. Cookies and Local Storage
            </h2>
            <p className="text-muted-foreground">
              We use secure cookies and browser local storage solely to retain authentication tokens,
              preserve active cart selections, and ensure seamless navigation across our storefront. We do
              not sell, lease, or monetize your browser data to third-party ad networks.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              5. Data Security
            </h2>
            <p className="text-muted-foreground">
              Your passwords are cryptographically salted and hashed using bcrypt. Access to your
              account and personal addresses is guarded by JSON Web Tokens with strict expiration
              cycles. All traffic is encrypted in transit using industry-standard TLS protocols.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-border/80 pb-3">
              6. Contact Us
            </h2>
            <p className="text-muted-foreground">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please
              contact our data compliance officer at:
            </p>
            <div className="p-5 bg-muted/40 border border-border/70 text-xs space-y-1">
              <p className="font-semibold text-foreground">A4LIGHTS Privacy & Compliance</p>
              <p className="text-muted-foreground">Email: privacy@a4lights.com</p>
              <p className="text-muted-foreground">Toll-Free Support: 1800-1030054</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
