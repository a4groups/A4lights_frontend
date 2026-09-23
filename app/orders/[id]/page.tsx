"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import api from "@/lib/api";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";

const STATUS_STEPS = ["pending", "confirmed", "completed"];
const EASE = [0.22, 1, 0.36, 1] as const;

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/orders/${id}`)
      .then(({ data }) => {
        const orderData = data?.data?.order ?? data?.data ?? null;
        setOrder(orderData);
      })
      .catch(() => router.push("/orders"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return (
    <div className="min-h-screen bg-background pt-36 px-5 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );

  if (!order) return null;

  const items = ((order.items ?? []) as { name: string; quantity: number; price: number; image?: string }[]);
  const addr = ((order.shippingAddress ?? {}) as Record<string, string>);
  const statusIdx = STATUS_STEPS.indexOf((order.status as string) || "pending");

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <section className="bg-charcoal px-5 pb-14 pt-36 md:px-10 lg:px-16">
          <div className="mx-auto max-w-[1480px]">
            <Link href="/orders" className="flex items-center gap-2 text-ivory/60 text-xs hover:text-ivory transition-colors mb-6">
              <ArrowLeft size={13} /> All Orders
            </Link>
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <p className="section-label text-champagne">Order Detail</p>
                <h1 className="font-serif text-4xl text-ivory">{(order.orderNumber as string) || "Order"}</h1>
                <p className="mt-2 text-sm text-ivory/50">
                  {order.createdAt ? `Placed on ${new Date(order.createdAt as string).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : "Recent Order"}
                </p>
              </div>
              <OrderStatusBadge status={(order.status as string) || "pending"} />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1480px] px-5 py-14 md:px-10 lg:px-16">
          {/* Status Timeline */}
          {(order.status as string) !== "cancelled" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
              className="mb-12 flex items-center gap-0">
              {STATUS_STEPS.map((step, i) => {
                const done = i <= statusIdx;
                const current = i === statusIdx;
                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center gap-2">
                      <div className={`flex size-8 items-center justify-center transition-colors ${done ? "text-gold" : "text-border"}`}>
                        {done ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                      </div>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${current ? "text-foreground" : done ? "text-muted-foreground" : "text-border"}`}>
                        {step}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`mb-5 h-px flex-1 transition-colors ${i < statusIdx ? "bg-gold" : "bg-border"}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </motion.div>
          )}

          <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
            {/* Items */}
            <div>
              <p className="section-label">Items Ordered</p>
              <div className="mt-6 space-y-0">
                {items.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.4, ease: EASE }}
                    className="flex gap-5 border-b border-border py-5">
                    {item.image && (
                      <div className="h-20 w-16 shrink-0 overflow-hidden bg-muted">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex flex-1 justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-lg text-foreground">{item.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 flex justify-between border-t border-border pt-6">
                <span className="text-sm font-semibold uppercase tracking-wider">Total</span>
                <span className="font-serif text-2xl">₹{((order.totalAmount as number) || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="space-y-8">
              <div className="border border-border p-6">
                <p className="section-label">Delivery Address</p>
                <div className="mt-4 text-sm leading-7 text-muted-foreground">
                  <p className="font-semibold text-foreground">{addr?.fullName || "—"}</p>
                  {addr?.phone && <p>{addr.phone}</p>}
                  {addr?.street && <p>{addr.street}</p>}
                  {(addr?.city || addr?.state) && <p>{[addr?.city, addr?.state].filter(Boolean).join(", ")}</p>}
                  {(addr?.pincode || addr?.country) && <p>{[addr?.pincode, addr?.country].filter(Boolean).join(", ")}</p>}
                </div>
              </div>
              {order.notes && (
                <div className="border border-border p-6">
                  <p className="section-label">Notes</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{order.notes as string}</p>
                </div>
              )}
              {order.confirmedAt && (
                <div className="border border-border p-6">
                  <p className="section-label">Timeline</p>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p>Confirmed: {new Date(order.confirmedAt as string).toLocaleString("en-IN")}</p>
                    {order.completedAt && <p>Completed: {new Date(order.completedAt as string).toLocaleString("en-IN")}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
