"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ArrowUpRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { CartItemSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import toast from "react-hot-toast";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CartPage() {
  const { items, isLoading, updateQuantity, removeItem } = useCart();

  const subtotal = items.reduce(
    (sum, i) => sum + i.priceAtAddition * i.quantity,
    0
  );

  const handleUpdateQty = async (productId: string, qty: number) => {
    try { await updateQuantity(productId, qty); }
    catch { toast.error("Could not update quantity."); }
  };

  const handleRemove = async (productId: string, name: string) => {
    try { await removeItem(productId); toast.success(`${name} removed.`); }
    catch { toast.error("Could not remove item."); }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-charcoal px-5 pb-16 pt-36 md:px-10 lg:px-16">
          <div className="mx-auto max-w-[1480px]">
            <p className="section-label text-champagne">Your Selection</p>
            <h1 className="section-title text-ivory">Shopping <em>Cart.</em></h1>
          </div>
        </section>

        <div className="mx-auto max-w-[1480px] px-5 py-14 md:px-10 lg:px-16">
          {isLoading ? (
            <div className="space-y-0">
              {[0,1,2].map(i => <CartItemSkeleton key={i} />)}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={<ShoppingCart size={64} />}
              title="Your cart is empty"
              description="Browse our architectural LED lighting range and add products you love."
              action={
                <Link href="/products" className="flex items-center gap-3 bg-foreground px-8 py-4 text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:bg-gold">
                  Browse Products <ArrowUpRight size={14} />
                </Link>
              }
            />
          ) : (
            <div className="grid gap-14 lg:grid-cols-[1fr_360px]">
              {/* Cart Items */}
              <div>
                {items.map((item, idx) => {
                  const product = item.product;
                  const productId = product?.id || product?._id || `cart-item-${idx}`;
                  const image =
                    product?.image ||
                    product?.images?.[0]?.url ||
                    "/assets/a4lights-product-DkxLuMym.jpg";
                  return (
                    <motion.div
                      key={productId}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.5, ease: EASE }}
                      className="flex gap-6 border-b border-border py-8"
                    >
                      {/* Image */}
                      <Link href={`/products/${product.slug}`} className="shrink-0">
                        <div className="h-28 w-20 overflow-hidden bg-muted">
                          <img src={image} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row">
                        <div>
                          {product.category && <p className="text-[10px] uppercase tracking-[0.2em] text-gold">{product.category.name}</p>}
                          <h3 className="mt-1 font-serif text-xl text-foreground">
                            <Link href={`/products/${product.slug}`} className="hover:text-gold transition-colors">{product.name}</Link>
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">₹{item.priceAtAddition.toLocaleString("en-IN")} each</p>
                        </div>

                        <div className="flex flex-col items-end justify-between gap-4">
                          {/* Qty controls */}
                          <div className="flex items-center border border-border">
                            <button onClick={() => handleUpdateQty(productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="grid size-9 place-items-center text-foreground transition-colors hover:bg-muted disabled:opacity-30">
                              <Minus size={13} />
                            </button>
                            <span className="min-w-[2.5rem] text-center text-sm font-semibold">{item.quantity}</span>
                            <button onClick={() => handleUpdateQty(productId, item.quantity + 1)}
                              disabled={item.quantity >= product.stock}
                              className="grid size-9 place-items-center text-foreground transition-colors hover:bg-muted disabled:opacity-30">
                              <Plus size={13} />
                            </button>
                          </div>

                          {/* Line total + Remove */}
                          <div className="flex items-center gap-4">
                            <p className="text-sm font-semibold text-foreground">
                              ₹{(item.priceAtAddition * item.quantity).toLocaleString("en-IN")}
                            </p>
                            <button onClick={() => handleRemove(productId, product.name)}
                              className="text-muted-foreground transition-colors hover:text-destructive" aria-label="Remove item">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div>
                <div className="sticky top-28 border border-border p-8">
                  <p className="section-label">Order Summary</p>
                  <div className="mt-6 space-y-4 border-b border-border pb-6">
                    {items.map((item, idx) => (
                      <div key={item.product?.id || item.product?._id || idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.product.name} × {item.quantity}</span>
                        <span className="font-medium">₹{(item.priceAtAddition * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <span className="text-sm font-semibold uppercase tracking-wider text-foreground">Subtotal</span>
                    <span className="font-serif text-2xl text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">Shipping & installation fees calculated at checkout</p>
                  <Link
                    href="/checkout"
                    className="group mt-8 flex w-full items-center justify-center gap-3 bg-foreground py-4 text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:bg-gold"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                  <Link href="/products" className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
