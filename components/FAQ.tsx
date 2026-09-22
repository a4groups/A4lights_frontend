"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

const faqs = [
  [
    "What products does A4Lights manufacture?",
    "A4Lights offers LED bulbs, panels, downlights, floodlights, decorative lighting, and solutions for commercial and industrial spaces.",
  ],
  [
    "Do you provide installation support?",
    "Yes. We provide professional installation support to help ensure lighting is placed and fitted correctly for the intended space.",
  ],
  [
    "Can you support commercial lighting projects?",
    "Yes. We support residential, commercial, retail, hospitality and project-based lighting requirements.",
  ],
  [
    "How can I request a quote?",
    "Use any Request a Quote or Enquire Now link on this page to contact our team with your project details.",
  ],
  [
    "Can you help select the right lighting solution?",
    "Yes. Our team can understand your application and recommend a suitable product direction before supply and installation.",
  ],
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-background px-5 pb-24 md:px-10 md:pb-36 lg:px-16">
      <div className="mx-auto grid max-w-[1280px] gap-12 border-t border-border pt-20 lg:grid-cols-[0.7fr_1.3fr]">
        {/* Left: Questions heading */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
        >
          <p className="section-label">Questions</p>
          <h2 className="section-title">
            Good to
            <br />
            <em>know.</em>
          </h2>
        </motion.div>

        {/* Right: Accordion Items */}
        <div>
          {faqs.map(([question, answer], index) => {
            const isOpen = openIndex === index;
            return (
              <div key={question} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-serif text-xl md:text-2xl text-foreground">
                    {question}
                  </span>
                  <Plus
                    size={20}
                    className={`shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-gold" : "text-foreground"
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE_SMOOTH }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-sm leading-7 text-muted-foreground">
                        {answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
