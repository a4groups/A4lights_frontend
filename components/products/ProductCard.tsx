"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { toast, notifyProductAdded } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: { url: string }[];
  category?: { name: string };
  isFeatured?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [adding, setAdding] = React.useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.warn("Please sign in to add items to cart.");
      router.push("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id);
      notifyProductAdded({
        name: product.name,
        image: product.images?.[0]?.url ?? "/assets/a4lights-product-DkxLuMym.jpg",
        price: product.price,
        quantity: 1,
      });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Could not add to cart.";
      toast.error(msg);
    } finally {
      setAdding(false);
    }
  };

  const image = product.images?.[0]?.url ?? "/assets/a4lights-product-DkxLuMym.jpg";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.7, ease: EASE }}
      className="group"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-muted relative">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-end bg-charcoal/40 p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ivory/80 bg-charcoal/60 px-2 py-1">Out of Stock</span>
            </div>
          )}
          {product.isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="bg-gold px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-foreground">Featured</span>
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      {product.category && (
        <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-gold">{product.category.name}</p>
      )}
      <h3 className="mt-2 font-serif text-2xl text-foreground">
        <Link href={`/products/${product.slug}`} className="hover:text-gold transition-colors">{product.name}</Link>
      </h3>
      <p className="mt-2 text-sm font-semibold text-foreground">₹{product.price.toLocaleString("en-IN")}</p>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleAddToCart}
          disabled={adding || product.stock === 0}
          className="flex items-center gap-2 border border-foreground px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-40"
        >
          <ShoppingCart size={13} />
          <span>{adding ? "Adding…" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
        </button>
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-2 border-b border-foreground pb-0.5 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-gold hover:text-gold"
        >
          <span>View</span>
          <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}
