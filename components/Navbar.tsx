"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import api from "@/lib/api";

interface NavbarProps {
  onOpenQuote?: () => void;
}

interface CategoryNav {
  _id: string;
  name: string;
  slug: string;
  badge?: string;
  subcategories?: string[];
  spaces?: string[];
}

export function Logo({
  light = false,
  className = "h-11 md:h-12 w-auto",
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="A4LIGHTS home"
      className="group flex items-center gap-3 transition-opacity duration-300 hover:opacity-90 flex-shrink-0"
    >
      <img
        src={light ? "/assets/a4lights-logo-light.png" : "/assets/a4lights-logo.png"}
        alt="A4LIGHTS Logo"
        width={140}
        height={48}
        className={`${className} object-contain transition-transform duration-300 group-hover:scale-105`}
      />
    </Link>
  );
}

export function Navbar({ onOpenQuote }: NavbarProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryNav[]>([]);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch live active categories from backend database
  useEffect(() => {
    api
      .get("/api/categories")
      .then(({ data }) => {
        const list =
          data?.data?.categories ??
          (Array.isArray(data?.data) ? data.data : []);
        // Clean out any leftover test records
        const cleanList = (Array.isArray(list) ? list : []).filter(
          (c: any) => !c.name?.toLowerCase().includes("qa test")
        );
        setCategories(cleanList);
      })
      .catch(() => {});
  }, []);

  const handleMouseEnter = (menuKey: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const pathname = usePathname();
  // Pages that start with a dark background hero or charcoal banner
  const hasDarkHeader =
    pathname === "/" ||
    pathname === "/products" ||
    pathname === "/services" ||
    pathname === "/cart" ||
    pathname === "/orders" ||
    pathname === "/about";

  const isLight =
    hasDarkHeader && !scrolled && !mobileMenuOpen && !activeDropdown;

  // Dynamically slice categories: first 3 shown as direct tabs, rest under "More Categories"
  const visibleCategories = categories.slice(0, 3);
  const moreCategories = categories.slice(3);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen || activeDropdown || !hasDarkHeader
          ? "border-b border-border bg-background/95 shadow-soft backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1480px] items-center justify-between px-5 md:px-8 xl:px-14">
        {/* Left: Brand Logo */}
        <Logo light={isLight} />

        {/* Center: Desktop Navigation Bar (Completely Dynamic from Backend) */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 xl:gap-8 lg:flex relative"
        >
          {/* 1. Home */}
          <Link
            href="/"
            className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
              isLight
                ? "text-ivory drop-shadow-sm hover:text-gold"
                : "text-foreground hover:text-gold"
            }`}
          >
            Home
          </Link>

          {/* 2. Products (Mega-Dropdown containing all dynamic categories & spaces) */}
          <div
            className="relative py-6"
            onMouseEnter={() => handleMouseEnter("products-all")}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/products"
              className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                activeDropdown === "products-all"
                  ? "text-gold"
                  : isLight
                  ? "text-ivory drop-shadow-sm hover:text-gold"
                  : "text-foreground hover:text-gold"
              }`}
            >
              <span>Products</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  activeDropdown === "products-all" ? "rotate-180 text-gold" : "opacity-70"
                }`}
              />
            </Link>

            {/* Products Mega Dropdown */}
            <AnimatePresence>
              {activeDropdown === "products-all" && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-0 top-full -mt-2 w-[580px] bg-white text-neutral-900 border border-neutral-200 shadow-2xl ring-1 ring-black/10 p-7 z-50"
                >
                  <div className="grid grid-cols-2 gap-8">
                    {/* Col 1: All Database Categories */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-3 pb-1 border-b border-neutral-200">
                        Lighting Categories
                      </p>
                      <div className="space-y-2.5">
                        {categories.map((cat) => (
                          <Link
                            key={cat._id}
                            href={`/products?category=${cat.slug || cat._id}`}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between text-xs font-medium text-neutral-700 hover:text-black hover:translate-x-1 transition-all duration-150"
                          >
                            <span>{cat.name}</span>
                            {cat.badge && (
                              <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[9px] font-bold tracking-tight">
                                {cat.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Col 2: Shop by Space (Dynamically aggregated from categories in DB) */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-900 mb-3 pb-1 border-b border-neutral-200">
                        Shop by Space
                      </p>
                      <div className="space-y-2.5 text-xs">
                        {Array.from(
                          new Set(
                            categories.flatMap((c) => c.spaces || [])
                          )
                        ).length > 0 ? (
                          Array.from(
                            new Set(categories.flatMap((c) => c.spaces || []))
                          )
                            .slice(0, 8)
                            .map((sp) => (
                              <Link
                                key={sp}
                                href={`/products?search=${encodeURIComponent(sp)}`}
                                onClick={() => setActiveDropdown(null)}
                                className="block font-medium text-neutral-700 hover:text-gold hover:translate-x-1 transition-all duration-150"
                              >
                                {sp}
                              </Link>
                            ))
                        ) : (
                          [
                            "Living Room",
                            "Bedroom & Suites",
                            "Duplex & Foyer",
                            "Dining & Kitchen",
                            "Offices & Commercial",
                            "Garden & Facade",
                          ].map((sp) => (
                            <Link
                              key={sp}
                              href={`/products?search=${encodeURIComponent(sp)}`}
                              onClick={() => setActiveDropdown(null)}
                              className="block font-medium text-neutral-700 hover:text-gold hover:translate-x-1 transition-all duration-150"
                            >
                              {sp}
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Footer */}
                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <Link
                      href="/products?sort=newest"
                      onClick={() => setActiveDropdown(null)}
                      className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <span>★ View New Arrivals</span>
                    </Link>
                    <Link
                      href="/products"
                      onClick={() => setActiveDropdown(null)}
                      className="text-[11px] font-semibold uppercase tracking-wider text-neutral-900 hover:text-gold flex items-center gap-1 transition-colors"
                    >
                      <span>Browse Full Catalog</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. DYNAMIC CATEGORIES (Directly from Database) */}
          {visibleCategories.map((cat) => {
            const hasSub =
              (cat.subcategories && cat.subcategories.length > 0) ||
              (cat.spaces && cat.spaces.length > 0);
            const isOpen = activeDropdown === cat._id;

            return (
              <div
                key={cat._id}
                className="relative py-6"
                onMouseEnter={() => handleMouseEnter(cat._id)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={`/products?category=${cat.slug || cat._id}`}
                  className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                    isOpen
                      ? "text-gold"
                      : isLight
                      ? "text-ivory drop-shadow-sm hover:text-gold"
                      : "text-foreground hover:text-gold"
                  }`}
                >
                  <span>{cat.name}</span>
                  {hasSub && (
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-gold" : "opacity-70"
                      }`}
                    />
                  )}
                </Link>

                {/* White Teak 2-Column Mega Dropdown (Fixture Types + SHOP BY SPACE) */}
                <AnimatePresence>
                  {isOpen && hasSub && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute left-0 top-full -mt-2 w-[500px] bg-white text-neutral-900 border border-neutral-200 shadow-2xl ring-1 ring-black/10 p-7 z-50"
                    >
                      <div className="grid grid-cols-2 gap-8">
                        {/* Col 1: Dynamic Subcategories from DB */}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-3 pb-1 border-b border-neutral-200">
                            Fixture Types
                          </p>
                          <div className="space-y-2.5">
                            {cat.subcategories && cat.subcategories.length > 0 ? (
                              cat.subcategories.map((sub) => (
                                <Link
                                  key={sub}
                                  href={`/products?category=${cat.slug || cat._id}&search=${encodeURIComponent(sub)}`}
                                  onClick={() => setActiveDropdown(null)}
                                  className="block text-xs font-medium text-neutral-700 hover:text-black hover:translate-x-1 transition-all duration-150"
                                >
                                  {sub}
                                </Link>
                              ))
                            ) : (
                              <Link
                                href={`/products?category=${cat.slug || cat._id}`}
                                onClick={() => setActiveDropdown(null)}
                                className="block text-xs font-medium text-neutral-700 hover:text-black"
                              >
                                All {cat.name}
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* Col 2: Dynamic Spaces from DB */}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-900 mb-3 pb-1 border-b border-neutral-200">
                            SHOP BY SPACE
                          </p>
                          <div className="space-y-2.5">
                            {cat.spaces && cat.spaces.length > 0 ? (
                              cat.spaces.map((space) => (
                                <Link
                                  key={space}
                                  href={`/products?category=${cat.slug || cat._id}&search=${encodeURIComponent(space)}`}
                                  onClick={() => setActiveDropdown(null)}
                                  className="block text-xs font-medium text-neutral-700 hover:text-gold hover:translate-x-1 transition-all duration-150"
                                >
                                  {space}
                                </Link>
                              ))
                            ) : (
                              <p className="text-[11px] text-neutral-400 italic">
                                Residential & Commercial
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Explore link */}
                      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <Link
                          href={`/products?category=${cat.slug || cat._id}`}
                          onClick={() => setActiveDropdown(null)}
                          className="text-[11px] font-semibold uppercase tracking-wider text-neutral-900 hover:text-gold flex items-center gap-1 transition-colors"
                        >
                          <span>Explore All {cat.name}</span>
                          <ArrowUpRight size={13} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* 4. More Categories Dropdown (Dynamic for any categories beyond top 3) */}
          {moreCategories.length > 0 && (
            <div
              className="relative py-6"
              onMouseEnter={() => handleMouseEnter("more-cats")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                  activeDropdown === "more-cats"
                    ? "text-gold"
                    : isLight
                    ? "text-ivory drop-shadow-sm hover:text-gold"
                    : "text-foreground hover:text-gold"
                }`}
              >
                <span>More Categories</span>
                <ChevronDown size={13} />
              </button>

              <AnimatePresence>
                {activeDropdown === "more-cats" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full -mt-2 w-64 bg-white text-neutral-900 border border-neutral-200 shadow-2xl ring-1 ring-black/10 p-4 z-50 space-y-2"
                  >
                    {moreCategories.map((c) => (
                      <Link
                        key={c._id}
                        href={`/products?category=${c.slug || c._id}`}
                        onClick={() => setActiveDropdown(null)}
                        className="block px-3 py-2 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors"
                      >
                        {c.name}
                      </Link>
                    ))}
                    <div className="pt-2 border-t border-neutral-200">
                      <Link
                        href="/products"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold hover:underline"
                      >
                        Browse All Products →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 5. Services */}
          <Link
            href="/services"
            className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
              isLight
                ? "text-ivory drop-shadow-sm hover:text-gold"
                : "text-foreground hover:text-gold"
            }`}
          >
            Services
          </Link>

          {/* 6. Contact */}
          <Link
            href="/#contact"
            className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
              isLight
                ? "text-ivory drop-shadow-sm hover:text-gold"
                : "text-foreground hover:text-gold"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right actions (Cart, Account, Quote) */}
        <div className="hidden items-center gap-4 lg:flex">
          {/* Cart */}
          <Link
            href="/cart"
            className={`relative grid size-9 place-items-center transition-colors ${
              isLight ? "text-ivory hover:text-gold" : "text-foreground hover:text-gold"
            }`}
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center bg-gold text-[9px] font-bold text-foreground">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          {/* User menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`grid size-9 place-items-center transition-colors ${
                  isLight ? "text-ivory hover:text-gold" : "text-foreground hover:text-gold"
                }`}
                aria-label="User menu"
              >
                <User size={18} />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white text-neutral-900 border border-neutral-200 shadow-xl z-50"
                  >
                    <div className="border-b border-neutral-100 px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                        Signed in as
                      </p>
                      <p className="mt-0.5 truncate text-sm font-medium text-neutral-900">
                        {user.name}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-xs text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                    >
                      <User size={14} /> Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-xs text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                    >
                      <ArrowUpRight size={14} /> My Orders
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-xs text-rose-600 transition-colors hover:bg-neutral-50"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className={`grid size-9 place-items-center transition-colors ${
                isLight ? "text-ivory hover:text-gold" : "text-foreground hover:text-gold"
              }`}
              aria-label="Sign in"
            >
              <User size={18} />
            </Link>
          )}

          {/* Quote CTA */}
          <button
            onClick={onOpenQuote}
            type="button"
            className={`flex items-center gap-2 border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest transition-colors duration-300 ${
              !isLight
                ? "border-foreground bg-foreground text-background hover:border-gold hover:bg-gold hover:text-foreground"
                : "border-ivory/80 text-ivory hover:bg-ivory hover:text-foreground"
            }`}
          >
            <span>Quote</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`grid size-10 place-items-center lg:hidden transition-colors ${
            isLight ? "text-ivory" : "text-foreground"
          }`}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-background border-b border-border lg:hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col px-5 pb-8 pt-2 divide-y divide-border/60">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 font-serif text-xl text-foreground"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 font-serif text-xl text-foreground flex items-center justify-between"
              >
                <span>All Products</span>
                <ArrowUpRight size={16} />
              </Link>

              {/* Dynamic Category Accordions */}
              {categories.map((cat) => {
                const isExpanded = mobileExpandedCat === cat._id;
                const hasSub =
                  (cat.subcategories && cat.subcategories.length > 0) ||
                  (cat.spaces && cat.spaces.length > 0);

                return (
                  <div key={cat._id} className="py-2">
                    <div className="flex items-center justify-between py-2">
                      <Link
                        href={`/products?category=${cat.slug || cat._id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-serif text-xl text-foreground hover:text-gold"
                      >
                        {cat.name}
                      </Link>
                      {hasSub && (
                        <button
                          onClick={() =>
                            setMobileExpandedCat(isExpanded ? null : cat._id)
                          }
                          className="p-2 text-muted-foreground hover:text-foreground"
                        >
                          <ChevronDown
                            size={18}
                            className={`transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-gold" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Accordion content */}
                    {isExpanded && hasSub && (
                      <div className="pl-4 pb-3 pt-1 space-y-4 border-l-2 border-gold/40 my-1 bg-muted/20 p-3">
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gold mb-2">
                              Fixture Types
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {cat.subcategories.map((sub) => (
                                <Link
                                  key={sub}
                                  href={`/products?category=${cat.slug || cat._id}&search=${encodeURIComponent(sub)}`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="text-xs text-foreground/80 hover:text-foreground"
                                >
                                  • {sub}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {cat.spaces && cat.spaces.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/70 mb-2">
                              Shop by Space
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {cat.spaces.map((sp) => (
                                <Link
                                  key={sp}
                                  href={`/products?category=${cat.slug || cat._id}&search=${encodeURIComponent(sp)}`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="text-xs text-foreground/80 hover:text-gold"
                                >
                                  • {sp}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 font-serif text-xl text-foreground"
              >
                Services
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 font-serif text-xl text-foreground"
              >
                About Us
              </Link>
              <Link
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 font-serif text-xl text-foreground"
              >
                Contact
              </Link>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col gap-3">
                <div className="flex gap-3">
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 relative flex items-center justify-center gap-2 border border-border py-3 text-xs font-semibold uppercase tracking-wider text-foreground"
                  >
                    <ShoppingCart size={15} /> Cart{" "}
                    {itemCount > 0 && (
                      <span className="ml-1 bg-gold px-1.5 text-[9px] font-bold text-foreground">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                  {user ? (
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 flex items-center justify-center gap-2 border border-border py-3 text-xs font-semibold uppercase tracking-wider text-foreground"
                    >
                      <User size={15} /> Profile
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 flex items-center justify-center gap-2 border border-border py-3 text-xs font-semibold uppercase tracking-wider text-foreground"
                    >
                      <User size={15} /> Sign In
                    </Link>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuote?.();
                  }}
                  className="w-full flex items-center justify-between bg-foreground px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-background"
                >
                  <span>Request a Quote</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
