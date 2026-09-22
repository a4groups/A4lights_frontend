"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "./Navbar";

export function Footer() {
  const navLinks = [
    ["Home", "/"],
    ["Products", "/products"],
    ["Services", "/services"],
    ["About Us", "/about"],
    ["Track Orders", "/orders"],
  ];

  return (
    <footer className="bg-charcoal px-5 py-14 text-ivory md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1480px]">
        <div className="grid gap-10 border-b border-ivory/15 pb-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Logo light={true} className="h-14 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-ivory/55 leading-relaxed">
              Precision architectural illumination systems designed for living, working, and gathering.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne mb-4">
              Explore
            </p>
            <nav
              aria-label="Footer navigation"
              className="grid grid-cols-2 gap-3 text-sm text-ivory/65"
            >
              {navLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="transition-colors hover:text-ivory"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Details */}
          <div className="text-sm leading-7 text-ivory/55 md:text-right">
            <p className="text-ivory font-medium">A4LIGHTS Systems</p>
            <p>Toll-Free: 1800-1030054</p>
            <p>Support: support@a4lights.com</p>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="flex flex-wrap justify-between items-center gap-5 pt-7 text-[11px] text-ivory/40">
          <p>© 2026 A4LIGHTS. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-ivory/80"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="transition-colors hover:text-ivory/80"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/refund-and-cancellation"
              className="transition-colors hover:text-ivory/80"
            >
              Refund & Cancellation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
