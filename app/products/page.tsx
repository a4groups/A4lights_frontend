"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import api from "@/lib/api";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSearchParams, useRouter } from "next/navigation";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Category { _id: string; name: string; }
interface Product { _id: string; name: string; slug: string; price: number; stock: number; images: { url: string }[]; category?: { name: string }; isFeatured?: boolean; }

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [featured, setFeatured] = useState(searchParams.get("featured") === "true");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "newest");
  const [page, setPage] = useState(Number(searchParams.get("page") ?? 1));

  const searchDebounce = useRef<ReturnType<typeof setTimeout>>(null);

  // Fetch categories once
  useEffect(() => {
    api
      .get("/api/categories")
      .then(({ data }) => {
        const list =
          data?.data?.categories ??
          (Array.isArray(data?.data) ? data.data : []);
        setCategories(Array.isArray(list) ? list : []);
      })
      .catch(() => setCategories([]));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory) params.set("category", selectedCategory);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (featured) params.set("featured", "true");
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", "12");

      const { data } = await api.get(`/api/products?${params}`);
      const productList =
        data?.data?.products ??
        (Array.isArray(data?.data) ? data.data : []);
      setProducts(Array.isArray(productList) ? productList : []);
      setTotal(data?.data?.total ?? 0);
      setTotalPages(data?.data?.totalPages ?? 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, minPrice, maxPrice, featured, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {}, 400); // debounce handled via useCallback
  };

  const clearFilters = () => {
    setSearch(""); setSelectedCategory(""); setMinPrice(""); setMaxPrice(""); setFeatured(false); setSort("newest"); setPage(1);
  };

  const hasActiveFilters = search || selectedCategory || minPrice || maxPrice || featured;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-charcoal px-5 pb-16 pt-36 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <p className="section-label text-champagne">Our Range</p>
            <h1 className="section-title text-ivory">
              All <em>Products.</em>
            </h1>
            {!loading && <p className="mt-4 text-sm text-ivory/50">{total} product{total !== 1 ? "s" : ""} found</p>}
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-[1480px] px-5 py-14 md:px-10 lg:px-16">
        {/* Search + Sort bar */}
        <div className="mb-10 flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-52">
            <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products…"
              className="w-full border-b border-border bg-transparent py-2.5 pl-6 text-sm text-foreground outline-none transition-colors focus:border-gold"
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="border-b border-border bg-transparent py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 border border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background lg:hidden"
          >
            <SlidersHorizontal size={13} />
            <span>Filters</span>
            {hasActiveFilters && <span className="size-4 flex items-center justify-center bg-gold text-[9px] font-bold">!</span>}
          </button>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors">
              <X size={12} /> Clear all
            </button>
          )}
        </div>

        <div className="flex gap-14">
          {/* Filters Sidebar */}
          <aside className={`w-56 shrink-0 ${filtersOpen ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-28 space-y-8">
              {/* Category */}
              <div>
                <p className="section-label mb-4">Category</p>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground/70 hover:text-foreground">
                    <input type="radio" name="cat" value="" checked={!selectedCategory}
                      onChange={() => { setSelectedCategory(""); setPage(1); }} className="accent-foreground" />
                    All Categories
                  </label>
                  {(Array.isArray(categories) ? categories : []).map((cat) => (
                    <label key={cat._id} className="flex cursor-pointer items-center gap-3 text-sm text-foreground/70 hover:text-foreground">
                      <input type="radio" name="cat" value={cat._id} checked={selectedCategory === cat._id}
                        onChange={() => { setSelectedCategory(cat._id); setPage(1); }} className="accent-foreground" />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <p className="section-label mb-4">Price Range</p>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-gold" />
                  <span className="text-muted-foreground">–</span>
                  <input type="number" placeholder="Max" value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-gold" />
                </div>
              </div>

              {/* Featured toggle */}
              <div>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground/70 hover:text-foreground">
                  <input type="checkbox" checked={featured} onChange={(e) => { setFeatured(e.target.checked); setPage(1); }} className="accent-foreground" />
                  Featured only
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid gap-12 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try adjusting your search or filters to find what you're looking for."
                action={<button onClick={clearFilters} className="border border-foreground px-6 py-3 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-foreground hover:text-background transition-colors">Clear Filters</button>}
              />
            ) : (
              <>
                <div className="grid gap-12 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                </div>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <section className="bg-charcoal px-5 pb-16 pt-36 md:px-10 lg:px-16">
          <div className="mx-auto max-w-[1480px]">
            <div className="h-3 w-20 animate-pulse bg-muted/40 mb-4" />
            <div className="h-16 w-72 animate-pulse bg-muted/40" />
          </div>
        </section>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
