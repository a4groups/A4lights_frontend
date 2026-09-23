"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Plus,
  MapPin,
  Clock,
  PackageCheck,
  Copy,
  Check,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import api from "@/lib/api";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "@/lib/toast";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  product?: string;
}

interface PlacedOrderData {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  totalAmount: number;
  notes?: string;
  status: string;
  createdAt: string;
}

const EMPTY_ADDR = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { user } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState(EMPTY_ADDR);
  const [savingAddr, setSavingAddr] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrderData | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch saved addresses from profile on mount
  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/users/profile");
      const addrs: Address[] =
        data.data?.addresses ??
        data.data?.user?.addresses ??
        [];
      setAddresses(addrs);
      if (addrs.length > 0) {
        setSelectedAddress((prev) => {
          if (prev && addrs.some((a) => a._id === prev)) return prev;
          const def = addrs.find((a) => a.isDefault) ?? addrs[0];
          return def ? def._id : "";
        });
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const subtotal = items.reduce(
    (s, i) => s + i.priceAtAddition * i.quantity,
    0
  );

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddr(true);
    try {
      const { data } = await api.post("/api/users/addresses", newAddr);
      const addrs: Address[] =
        data.data?.addresses ??
        data.data?.user?.addresses ??
        [];
      setAddresses(addrs);
      const newest = addrs[addrs.length - 1];
      if (newest) setSelectedAddress(newest._id);
      setShowAddForm(false);
      setNewAddr(EMPTY_ADDR);
      toast.success("Delivery address saved successfully.");
    } catch {
      toast.error("Could not save address. Please fill all required fields.");
    } finally {
      setSavingAddr(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.warn("Please select a delivery address.");
      return;
    }
    if (items.length === 0) {
      toast.warn("Your cart is empty. Add products before checking out.");
      return;
    }
    setPlacing(true);
    try {
      const { data } = await api.post("/api/orders", {
        addressId: selectedAddress,
        notes,
      });

      const orderData: PlacedOrderData = data.data?.order ?? data.data;
      setPlacedOrder(orderData);

      await clearCart();
      toast.success(
        `Order ${orderData?.orderNumber || "placed"} successfully!`,
        { autoClose: 4000 }
      );
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Could not place order.";
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  const copyOrderNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    toast.info("Order number copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Order placed success screen ──
  if (placedOrder) {
    const shipping = placedOrder.shippingAddress;
    return (
      <div className="min-h-screen bg-background">
        <section className="bg-charcoal px-5 pb-16 pt-36 md:px-10 lg:px-16">
          <div className="mx-auto max-w-[1100px] text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-gold/15 text-gold border border-gold/30 shadow-[0_0_30px_rgba(197,168,128,0.2)]"
            >
              <CheckCircle2 size={36} />
            </motion.div>
            <p className="section-label text-champagne">Order Confirmed</p>
            <h1 className="font-serif text-4xl md:text-5xl text-ivory">
              Thank You, <em>{user?.name?.split(" ")[0] || "Valued Customer"}.</em>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-ivory/60 max-w-xl mx-auto">
              Your order has been received and registered in our system. A confirmation notification has been sent to your registered account.
            </p>

            <div className="mt-6 inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-sm">
              <span className="text-xs uppercase tracking-wider text-ivory/60">Order Number:</span>
              <span className="font-mono text-sm font-semibold text-champagne">{placedOrder.orderNumber}</span>
              <button
                onClick={() => copyOrderNumber(placedOrder.orderNumber)}
                className="text-ivory/50 hover:text-champagne transition-colors p-1"
                title="Copy order number"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1100px] px-5 py-14 md:px-10 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Items Summary (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-border p-6 md:p-8 bg-card/40">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <PackageCheck size={16} className="text-gold" />
                    Items Ordered ({placedOrder.items?.length || 0})
                  </h2>
                  <span className="text-xs text-muted-foreground">Status: <strong className="text-foreground capitalize">{placedOrder.status}</strong></span>
                </div>

                <div className="divide-y divide-border/60">
                  {placedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-4">
                      {item.image ? (
                        <div className="h-16 w-16 shrink-0 overflow-hidden bg-muted rounded-sm border border-border">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-muted rounded-sm text-muted-foreground">
                          <ShoppingBag size={20} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-base text-foreground truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Quantity: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-foreground">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {placedOrder.notes && (
                  <div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                    <strong className="text-foreground">Special Instructions:</strong> {placedOrder.notes}
                  </div>
                )}

                <div className="mt-6 border-t border-border pt-6 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{placedOrder.totalAmount?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping & Handling</span>
                    <span className="text-gold font-medium uppercase tracking-wider text-xs">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-foreground pt-2 border-t border-border/60">
                    <span>Total Amount</span>
                    <span className="font-serif text-2xl text-gold">₹{placedOrder.totalAmount?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info & Actions (1 col) */}
            <div className="space-y-6">
              <div className="border border-border p-6 md:p-8 bg-card/40">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground flex items-center gap-2 border-b border-border pb-4">
                  <MapPin size={16} className="text-gold" />
                  Delivery Details
                </h2>

                {shipping && (
                  <div className="mt-4 space-y-1.5 text-sm">
                    <p className="font-semibold text-foreground">{shipping.fullName}</p>
                    <p className="text-muted-foreground">{shipping.street}</p>
                    <p className="text-muted-foreground">{shipping.city}, {shipping.state} — {shipping.pincode}</p>
                    <p className="text-muted-foreground">{shipping.country}</p>
                    <p className="pt-2 text-xs font-mono text-muted-foreground">Contact: {shipping.phone}</p>
                  </div>
                )}

                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Clock size={12} className="text-gold" /> Estimated Delivery
                  </p>
                  <p className="mt-1 text-xs text-foreground">
                    Standard Dispatch: 3–5 business days with direct white-glove transport.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {placedOrder._id && (
                  <Link
                    href={`/orders/${placedOrder._id}`}
                    className="flex w-full items-center justify-center gap-2 bg-foreground py-3.5 text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:bg-gold"
                  >
                    <span>View Order Details</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
                <Link
                  href="/orders"
                  className="flex w-full items-center justify-center gap-2 border border-border py-3.5 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-muted"
                >
                  All Orders
                </Link>
                <Link
                  href="/products"
                  className="flex w-full items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <section className="bg-charcoal px-5 pb-16 pt-36 md:px-10 lg:px-16">
          <div className="mx-auto max-w-[1480px]">
            <p className="section-label text-champagne">Final Step</p>
            <h1 className="section-title text-ivory">Checkout.</h1>
          </div>
        </section>

        <div className="mx-auto max-w-[1480px] px-5 py-14 md:px-10 lg:px-16">
          <div className="grid gap-14 lg:grid-cols-[1fr_360px]">
            {/* Left — Delivery Address */}
            <div>
              <p className="section-label">Delivery Address</p>

              {loading ? (
                <div className="mt-6 space-y-4">
                  {[0, 1].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {addresses.length === 0 && (
                    <p className="text-sm text-muted-foreground mb-4">
                      No saved address found. Please add a delivery address to proceed.
                    </p>
                  )}

                  {addresses.map((addr, idx) => (
                    <label
                      key={addr._id || `addr-${idx}`}
                      className={`flex cursor-pointer gap-4 border p-5 transition-colors ${
                        selectedAddress === addr._id
                          ? "border-foreground bg-muted/20"
                          : "border-border hover:border-foreground/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr._id}
                        checked={selectedAddress === addr._id}
                        onChange={() => setSelectedAddress(addr._id)}
                        className="mt-1 accent-foreground shrink-0"
                      />
                      <div className="text-sm">
                        <p className="font-semibold text-foreground">
                          {addr.fullName}{" "}
                          {addr.isDefault && (
                            <span className="ml-2 bg-gold/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-foreground">
                              Default
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-muted-foreground">
                          {addr.street}, {addr.city}
                        </p>
                        <p className="text-muted-foreground">
                          {addr.state} — {addr.pincode}
                        </p>
                        <p className="text-muted-foreground">{addr.phone}</p>
                      </div>
                    </label>
                  ))}

                  {/* Add new address button */}
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 border border-dashed border-border w-full p-5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    <Plus size={14} />
                    <MapPin size={14} /> Add New Address
                  </button>

                  <AnimatePresence>
                    {showAddForm && (
                      <motion.form
                        onSubmit={handleSaveAddress}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border border-border p-6 space-y-4 bg-card/30"
                      >
                        <div className="grid gap-4 sm:grid-cols-2">
                          {(
                            [
                              "fullName",
                              "phone",
                              "street",
                              "city",
                              "state",
                              "pincode",
                            ] as const
                          ).map((field) => (
                            <div
                              key={field}
                              className={
                                field === "street" ? "sm:col-span-2" : ""
                              }
                            >
                              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground capitalize">
                                {field.replace(/([A-Z])/g, " $1")} *
                              </label>
                              <input
                                type="text"
                                required
                                value={newAddr[field]}
                                onChange={(e) =>
                                  setNewAddr((p) => ({
                                    ...p,
                                    [field]: e.target.value,
                                  }))
                                }
                                className="mt-1.5 w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-gold"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            type="submit"
                            disabled={savingAddr}
                            className="bg-foreground px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background transition-colors hover:bg-gold disabled:opacity-60"
                          >
                            {savingAddr ? "Saving…" : "Save Address"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="border border-border px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-muted"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Notes */}
              <div className="mt-10">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Order Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special delivery instructions or project notes…"
                  className="mt-2 w-full resize-none border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-gold"
                />
              </div>
            </div>

            {/* Right — Summary */}
            <div>
              <div className="sticky top-28 border border-border p-8 bg-card/30">
                <p className="section-label">Order Review</p>
                <div className="mt-6 space-y-3 border-b border-border pb-6">
                  {items.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Your cart is empty.</p>
                  ) : (
                    items.map((item, idx) => {
                      const itemKey =
                        (item as { _id?: string })._id ||
                        item.product?._id ||
                        item.product?.id ||
                        `checkout-item-${idx}`;
                      return (
                        <div
                          key={itemKey}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {item.product?.name ?? "Product"} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            ₹
                            {(
                              item.priceAtAddition * item.quantity
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="mt-4 flex justify-between">
                  <span className="text-sm font-semibold uppercase tracking-wider">
                    Total
                  </span>
                  <span className="font-serif text-2xl">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing || items.length === 0}
                  className="group mt-8 flex w-full items-center justify-center gap-3 bg-foreground py-4 text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:bg-gold disabled:opacity-50"
                >
                  <span>{placing ? "Placing Order…" : "Place Order"}</span>
                  {!placing && (
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  )}
                </button>
                <Link
                  href="/cart"
                  className="mt-4 flex items-center justify-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
