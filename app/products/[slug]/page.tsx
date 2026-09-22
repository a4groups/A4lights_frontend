"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";

const EASE = [0.22, 1, 0.36, 1] as const;

const SPEC_LABELS: Record<string, string> = {
  power: "Wattage",
  luminousOutput: "Lumen Output",
  colourTemperature: "Colour Temperature",
  beamAngle: "Beam Angle",
  material: "Material",
  ipRating: "IP Rating",
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/products/${slug}`)
      .then(({ data }) => setProduct(data?.data?.product ?? data?.data ?? null))
      .catch(() => router.push("/products"))
      .finally(() => setLoading(false));
  }, [slug, router]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error("Please sign in to add items to cart."); router.push("/login"); return; }
    setAdding(true);
    try {
      await addToCart((product as { _id: string })._id, quantity);
      toast.success("Added to cart!");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Could not add to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background pt-24 px-5 md:px-8">
      <div className="mx-auto max-w-[1200px] grid lg:grid-cols-12 gap-8 lg:gap-10">
        <div className="lg:col-span-6">
          <Skeleton className="aspect-square max-h-[460px] w-full" />
          <div className="mt-3 flex gap-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 w-14" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-6 space-y-4 pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="mt-4 h-28 w-full" />
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const images = (product.images as { url: string }[]) ?? [];
  const specs = (product.specifications as Record<string, string>) ?? {};
  const hasSpecs = Object.values(specs).some(Boolean);
  const stock = Number(product.stock) || 0;
  const price = Number(product.price) || 0;
  const category = product.category as { name: string } | undefined;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-5 pt-24 pb-14 md:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-5 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Link
            href="/products"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={13} /> All Products
          </Link>
          {category && (
            <>
              <span>/</span>
              <span className="text-gold font-medium">{category.name}</span>
            </>
          )}
        </motion.div>

        <div className="grid gap-8 lg:gap-10 lg:grid-cols-12 items-start">
          {/* Image Gallery (Left, Sticky) */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="lg:col-span-6 lg:sticky lg:top-24"
          >
            <div className="aspect-square max-h-[460px] w-full overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center">
              <img
                src={
                  images[activeImage]?.url ??
                  "/assets/a4lights-product-DkxLuMym.jpg"
                }
                alt={product.name as string}
                className="h-full w-full object-contain transition-all duration-300"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-14 w-14 flex-shrink-0 overflow-hidden border transition-colors bg-neutral-900 ${
                      i === activeImage
                        ? "border-gold"
                        : "border-border/60 hover:border-foreground/40"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info (Right) */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="lg:col-span-6 flex flex-col"
          >
            {category && (
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                {category.name}
              </p>
            )}
            <h1 className="mt-1 font-serif text-2xl md:text-3xl text-foreground font-normal leading-tight">
              {product.name as string}
            </h1>
            <p className="mt-2 text-xl md:text-2xl font-semibold text-foreground">
              ₹{price.toLocaleString("en-IN")}
            </p>

            {/* Stock */}
            <div className="mt-1.5">
              {stock > 0 ? (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  In Stock ({stock} available)
                </span>
              ) : (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-destructive">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-3 text-xs md:text-sm leading-relaxed text-muted-foreground">
              {product.description as string}
            </p>

            {/* Quantity + Actions */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 items-center border border-border bg-card">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="grid size-9 place-items-center text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="min-w-[2.2rem] text-center text-xs font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    disabled={quantity >= stock}
                    className="grid size-9 place-items-center text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">
                  Max: {stock}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={adding || stock === 0}
                  className="flex-1 flex h-11 items-center justify-center gap-2 bg-foreground px-6 text-xs font-semibold uppercase tracking-widest text-background hover:bg-gold disabled:opacity-50 transition-colors"
                >
                  <ShoppingCart size={14} />
                  <span>
                    {adding
                      ? "Adding…"
                      : stock === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </span>
                </button>

                <button
                  onClick={() => router.push(`/cart`)}
                  className="flex h-11 items-center justify-center gap-1.5 border border-foreground/80 px-5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  <span>View Cart</span>
                  <ArrowUpRight
                    size={13}
                    className="transition-transform duration-200 hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>

            {/* Specifications */}
            {hasSpecs && (
              <div className="mt-6 border-t border-border/70 pt-4">
                <p className="section-label mb-2">Specifications</p>
                <table className="w-full text-xs">
                  <tbody>
                    {Object.entries(specs)
                      .filter(([, v]) => v)
                      .map(([key, val]) => (
                        <tr key={key} className="border-b border-border/50">
                          <td className="py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-36">
                            {SPEC_LABELS[key] ?? key}
                          </td>
                          <td className="py-2 text-foreground font-medium">
                            {val}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
