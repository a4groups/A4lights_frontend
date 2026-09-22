"use client";

import React, { createContext, useContext, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QuoteModal } from "@/components/QuoteModal";

interface QuoteContextType {
  openQuote: (productName?: string) => void;
  closeQuote: () => void;
}

const QuoteContext = createContext<QuoteContextType>({
  openQuote: () => {},
  closeQuote: () => {},
});

export const useQuote = () => useContext(QuoteContext);

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState("");

  const openQuote = (productName = "") => {
    setQuoteProduct(productName);
    setIsQuoteOpen(true);
  };

  const closeQuote = () => {
    setIsQuoteOpen(false);
    setQuoteProduct("");
  };

  return (
    <QuoteContext.Provider value={{ openQuote, closeQuote }}>
      <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
        <Navbar onOpenQuote={() => openQuote()} />
        <main className="flex-1">{children}</main>
        <Footer />
        <QuoteModal
          isOpen={isQuoteOpen}
          onClose={closeQuote}
          defaultProduct={quoteProduct}
        />
      </div>
    </QuoteContext.Provider>
  );
}
