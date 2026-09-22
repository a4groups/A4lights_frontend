"use client";

import React from "react";

const trustItems = [
  "Manufacturing Expertise",
  "Quality-Focused Products",
  "Installation Support",
  "Residential & Commercial Solutions",
];

export function TrustStrip() {
  return (
    <section className="bg-charcoal px-5 py-8 text-ivory md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[1480px] md:grid-cols-4">
        {trustItems.map((item, index) => (
          <div
            key={item}
            className={`flex min-h-20 items-center border-ivory/15 px-5 py-4 text-center text-xs uppercase tracking-wider md:justify-center ${
              index > 0 ? "border-t md:border-l md:border-t-0" : ""
            }`}
          >
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
