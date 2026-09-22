"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import api from "@/lib/api";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderRowSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";

const EASE = [0.22, 1, 0.36, 1] as const;
const LIMIT = 10;

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: { name: string; quantity: number }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/orders?page=${page}&limit=${LIMIT}`)
      .then(({ data }) => {
        const list = data?.data?.orders ?? (Array.isArray(data?.data) ? data.data : []);
        setOrders(Array.isArray(list) ? list : []);
        setTotalPages(data?.data?.totalPages ?? 1);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <section className="bg-charcoal px-5 pb-16 pt-36 md:px-10 lg:px-16">
          <div className="mx-auto max-w-[1480px]">
            <p className="section-label text-champagne">History</p>
            <h1 className="section-title text-ivory">My <em>Orders.</em></h1>
          </div>
        </section>

        <div className="mx-auto max-w-[1480px] px-5 py-14 md:px-10 lg:px-16">
          {loading ? (
            <div>{Array.from({ length: 5 }).map((_, i) => <OrderRowSkeleton key={i} />)}</div>
          ) : orders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              description="Once you place an order it will appear here."
              action={
                <Link href="/products" className="flex items-center gap-3 bg-foreground px-8 py-4 text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:bg-gold">
                  Browse Products <ArrowUpRight size={14} />
                </Link>
              }
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Order #", "Date", "Items", "Total", "Status", ""].map((h) => (
                        <th key={h} className="pb-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, i) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.4, ease: EASE }}
                        className="border-b border-border hover:bg-muted/40 transition-colors"
                      >
                        <td className="py-5 pr-6 font-mono text-xs font-semibold text-foreground">{order.orderNumber}</td>
                        <td className="py-5 pr-6 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td className="py-5 pr-6 text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</td>
                        <td className="py-5 pr-6 font-semibold text-foreground">₹{order.totalAmount.toLocaleString("en-IN")}</td>
                        <td className="py-5 pr-6"><OrderStatusBadge status={order.status} /></td>
                        <td className="py-5">
                          <Link href={`/orders/${order._id}`} className="inline-flex items-center gap-1.5 text-xs text-foreground/60 hover:text-gold transition-colors">
                            View <ArrowUpRight size={12} />
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-4 md:hidden">
                {orders.map((order) => (
                  <Link key={order._id} href={`/orders/${order._id}`} className="block border border-border p-5 transition-colors hover:border-foreground">
                    <div className="flex items-start justify-between">
                      <p className="font-mono text-xs font-semibold text-foreground">{order.orderNumber}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? "s" : ""} · ₹{order.totalAmount.toLocaleString("en-IN")}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </Link>
                ))}
              </div>

              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
