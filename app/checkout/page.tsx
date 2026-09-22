"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Plus, MapPin } from "lucide-react";
import api from "@/lib/api";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Skeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Address { _id: string; fullName: string; phone: string; street: string; city: string; state: string; pincode: string; country: string; isDefault: boolean; }

const EMPTY_ADDR = { fullName: "", phone: "", street: "", city: "", state: "", pincode: "", country: "India" };

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
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    api.get("/api/users/profile").then(({ data }) => {
      const addrs: Address[] = data.data?.addresses ?? [];
      setAddresses(addrs);
      const def = addrs.find((a) => a.isDefault) ?? addrs[0];
      if (def) setSelectedAddress(def._id);
    }).finally(() => setLoading(false));
  }, []);

  const subtotal = items.reduce((s, i) => s + i.priceAtAddition * i.quantity, 0);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddr(true);
    try {
      const { data } = await api.post("/api/users/addresses", newAddr);
      const addrs: Address[] = data.data?.addresses ?? [];
      setAddresses(addrs);
      const newest = addrs[addrs.length - 1];
      if (newest) setSelectedAddress(newest._id);
      setShowAddForm(false);
      setNewAddr(EMPTY_ADDR);
      toast.success("Address saved.");
    } catch { toast.error("Could not save address."); }
    finally { setSavingAddr(false); }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error("Please select a delivery address."); return; }
    setPlacing(true);
    try {
      const { data } = await api.post("/api/orders", { addressId: selectedAddress, notes });
      await clearCart();
      setOrderId(data.data?._id ?? data.data?.orderNumber ?? "");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Could not place order.");
    } finally { setPlacing(false); }
  };

  // ── Order placed success screen ──
  if (orderId) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-20 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }} className="max-w-md">
        <div className="mx-auto mb-8 flex size-20 items-center justify-center bg-gold/10 text-gold">
          <CheckCircle2 size={44} />
        </div>
        <p className="section-label">Order Placed</p>
        <h1 className="font-serif text-5xl text-foreground">Thank You, <em>{user?.name?.split(" ")[0]}.</em></h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          Your order has been received and is now <strong className="text-foreground">pending confirmation</strong>. We'll send you an email once it's been confirmed.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/orders" className="flex items-center justify-center gap-3 bg-foreground px-8 py-4 text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:bg-gold">
            View My Orders <ArrowUpRight size={14} />
          </Link>
          <Link href="/products" className="flex items-center justify-center gap-3 border border-foreground px-8 py-4 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );

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
                  {[0,1].map(i => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {addresses.map((addr) => (
                    <label key={addr._id} className={`flex cursor-pointer gap-4 border p-5 transition-colors ${selectedAddress === addr._id ? "border-foreground" : "border-border hover:border-foreground/40"}`}>
                      <input type="radio" name="address" value={addr._id} checked={selectedAddress === addr._id}
                        onChange={() => setSelectedAddress(addr._id)} className="mt-1 accent-foreground shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold text-foreground">{addr.fullName} {addr.isDefault && <span className="ml-2 bg-gold/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-foreground">Default</span>}</p>
                        <p className="mt-1 text-muted-foreground">{addr.street}, {addr.city}</p>
                        <p className="text-muted-foreground">{addr.state} — {addr.pincode}</p>
                        <p className="text-muted-foreground">{addr.phone}</p>
                      </div>
                    </label>
                  ))}

                  {/* Add new address */}
                  <button onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 border border-dashed border-border w-full p-5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">
                    <Plus size={14} /><MapPin size={14} /> Add New Address
                  </button>

                  <AnimatePresence>
                    {showAddForm && (
                      <motion.form onSubmit={handleSaveAddress} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border border-border p-6 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          {(["fullName", "phone", "street", "city", "state", "pincode"] as const).map((field) => (
                            <div key={field} className={field === "street" ? "sm:col-span-2" : ""}>
                              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground capitalize">{field.replace(/([A-Z])/g, " $1")} *</label>
                              <input type="text" required value={newAddr[field]} onChange={(e) => setNewAddr(p => ({ ...p, [field]: e.target.value }))}
                                className="mt-1.5 w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-gold" />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button type="submit" disabled={savingAddr}
                            className="bg-foreground px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background transition-colors hover:bg-gold disabled:opacity-60">
                            {savingAddr ? "Saving…" : "Save Address"}
                          </button>
                          <button type="button" onClick={() => setShowAddForm(false)}
                            className="border border-border px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-muted">
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
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Order Notes (optional)</label>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions…"
                  className="mt-2 w-full resize-none border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-gold" />
              </div>
            </div>

            {/* Right — Summary */}
            <div>
              <div className="sticky top-28 border border-border p-8">
                <p className="section-label">Order Review</p>
                <div className="mt-6 space-y-3 border-b border-border pb-6">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.product.name} × {item.quantity}</span>
                      <span className="font-medium">₹{(item.priceAtAddition * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between">
                  <span className="text-sm font-semibold uppercase tracking-wider">Total</span>
                  <span className="font-serif text-2xl">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <button onClick={handlePlaceOrder} disabled={placing || items.length === 0}
                  className="group mt-8 flex w-full items-center justify-center gap-3 bg-foreground py-4 text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:bg-gold disabled:opacity-50">
                  <span>{placing ? "Placing Order…" : "Place Order"}</span>
                  {!placing && <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
                </button>
                <Link href="/cart" className="mt-4 flex items-center justify-center text-xs text-muted-foreground hover:text-foreground transition-colors">← Back to Cart</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
