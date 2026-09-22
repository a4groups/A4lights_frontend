"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: string;
}

export function QuoteModal({
  isOpen,
  onClose,
  defaultProduct = "",
}: QuoteModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("Residential");
  const [product, setProduct] = useState(defaultProduct);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (defaultProduct) {
      setProduct(defaultProduct);
    }
  }, [defaultProduct]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-xl overflow-hidden border border-border bg-background p-6 shadow-2xl sm:p-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-5 top-5 p-2 text-foreground/60 transition-colors hover:text-foreground"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <div>
                <p className="section-label">Consultation & Quote</p>
                <h3 className="font-serif text-3xl md:text-4xl text-foreground">
                  Planning a <em>Lighting Project?</em>
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Tell us about your space and requirements. Our architectural
                  lighting specialists will respond with product specifications
                  and guidance.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="eleanor@studio.com"
                        className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-gold"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Application Type
                      </label>
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-gold"
                      >
                        <option value="Residential">Residential Space</option>
                        <option value="Commercial">Commercial Office</option>
                        <option value="Retail">Retail & Showroom</option>
                        <option value="Hospitality">Hospitality & Hotel</option>
                        <option value="Industrial">Commercial & Industrial</option>
                        <option value="Custom Project">Custom Architectural</option>
                      </select>
                    </div>
                  </div>

                  {product && (
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Inquiring About
                      </label>
                      <input
                        type="text"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm font-medium text-foreground outline-none transition-colors focus:border-gold"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Project Notes / Scope
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Brief details about room dimensions, ceiling height, or installation assistance needed..."
                      className="mt-1 w-full resize-none border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-gold"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="group flex w-full items-center justify-center gap-3 bg-foreground py-3.5 text-xs font-semibold uppercase tracking-widest text-background transition-colors duration-300 hover:bg-gold"
                    >
                      <span>Submit Inquiry</span>
                      <ArrowUpRight
                        size={15}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="font-serif text-3xl text-foreground">
                  Inquiry Received
                </h4>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Thank you, <strong className="text-foreground">{name || "Client"}</strong>. An architectural lighting specialist will review your project requirements and follow up within one business day.
                </p>
                <div className="mt-8">
                  <button
                    onClick={handleReset}
                    className="border border-foreground/30 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
