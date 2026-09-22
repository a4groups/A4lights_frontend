"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Plus, Trash2, Edit2, Check, X, Star } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Skeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";

const EASE = [0.22, 1, 0.36, 1] as const;
const TABS = ["Profile", "Addresses"] as const;
type Tab = typeof TABS[number];

interface Address { _id: string; fullName: string; phone: string; street: string; city: string; state: string; pincode: string; country: string; isDefault: boolean; }

const EMPTY_ADDR = { fullName: "", phone: "", street: "", city: "", state: "", pincode: "", country: "India" };

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [tab, setTab] = useState<Tab>("Profile");

  // Profile state
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState(EMPTY_ADDR);
  const [savingAddr, setSavingAddr] = useState(false);

  useEffect(() => {
    if (user) { setName(user.name); setPhone(user.phone); }
  }, [user]);

  useEffect(() => {
    setAddrLoading(true);
    api.get("/api/users/profile")
      .then(({ data }) => setAddresses(data.data?.addresses ?? []))
      .finally(() => setAddrLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.put("/api/users/profile", { name, phone });
      await refreshUser();
      setEditingProfile(false);
      toast.success("Profile updated.");
    } catch { toast.error("Could not update profile."); }
    finally { setSavingProfile(false); }
  };

  const fetchAddresses = async () => {
    const { data } = await api.get("/api/users/profile");
    setAddresses(data.data?.addresses ?? []);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddr(true);
    try {
      if (editingAddr) {
        await api.put(`/api/users/addresses/${editingAddr}`, addrForm);
        toast.success("Address updated.");
      } else {
        await api.post("/api/users/addresses", addrForm);
        toast.success("Address added.");
      }
      await fetchAddresses();
      setShowAddForm(false);
      setEditingAddr(null);
      setAddrForm(EMPTY_ADDR);
    } catch { toast.error("Could not save address."); }
    finally { setSavingAddr(false); }
  };

  const handleDeleteAddr = async (id: string) => {
    try {
      await api.delete(`/api/users/addresses/${id}`);
      toast.success("Address removed.");
      fetchAddresses();
    } catch { toast.error("Could not delete address."); }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.patch(`/api/users/addresses/${id}/default`);
      fetchAddresses();
    } catch { toast.error("Could not set default."); }
  };

  const startEdit = (addr: Address) => {
    setAddrForm({ fullName: addr.fullName, phone: addr.phone, street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode, country: addr.country });
    setEditingAddr(addr._id);
    setShowAddForm(true);
  };

  const ADDRESS_FIELDS: (keyof typeof EMPTY_ADDR)[] = ["fullName", "phone", "street", "city", "state", "pincode"];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-charcoal px-5 pb-16 pt-36 md:px-10 lg:px-16">
          <div className="mx-auto max-w-[1480px]">
            <p className="section-label text-champagne">Account</p>
            <h1 className="section-title text-ivory">My <em>Profile.</em></h1>
          </div>
        </section>

        <div className="mx-auto max-w-[1480px] px-5 py-14 md:px-10 lg:px-16">
          {/* Tabs */}
          <div className="mb-10 flex gap-0 border-b border-border">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider transition-colors ${tab === t ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {t}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE }}>

              {/* ── Profile Tab ── */}
              {tab === "Profile" && (
                <div className="max-w-lg">
                  {!editingProfile ? (
                    <div className="border border-border p-8 space-y-6">
                      <div className="flex items-start justify-between">
                        <p className="section-label">Personal Details</p>
                        <button onClick={() => setEditingProfile(true)}
                          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                          <Edit2 size={13} /> Edit
                        </button>
                      </div>
                      <div className="space-y-5">
                        {[
                          { label: "Full Name", value: user?.name },
                          { label: "Email Address", value: user?.email },
                          { label: "Phone", value: user?.phone },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                            <p className="mt-1 text-sm text-foreground">{value ?? "—"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="border border-foreground p-8 space-y-6">
                      <p className="section-label">Edit Profile</p>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Full Name *</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} required
                          className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                        <input value={user?.email ?? ""} disabled
                          className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm text-muted-foreground outline-none cursor-not-allowed" />
                        <p className="mt-1 text-[11px] text-muted-foreground">Email cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Phone *</label>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} required
                          className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground outline-none focus:border-gold" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={savingProfile}
                          className="flex items-center gap-2 bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-wider text-background transition-colors hover:bg-gold disabled:opacity-60">
                          <Check size={13} /> {savingProfile ? "Saving…" : "Save Changes"}
                        </button>
                        <button type="button" onClick={() => { setEditingProfile(false); setName(user?.name ?? ""); setPhone(user?.phone ?? ""); }}
                          className="flex items-center gap-2 border border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-muted">
                          <X size={13} /> Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ── Addresses Tab ── */}
              {tab === "Addresses" && (
                <div className="max-w-2xl">
                  {addrLoading ? (
                    <div className="space-y-4">{[0,1].map(i => <Skeleton key={i} className="h-28 w-full" />)}</div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((addr) => (
                        <motion.div key={addr._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}
                          className={`border p-6 transition-colors ${addr.isDefault ? "border-foreground" : "border-border"}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="text-sm leading-7">
                              <p className="font-semibold text-foreground">{addr.fullName}
                                {addr.isDefault && <span className="ml-3 bg-gold/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-foreground">Default</span>}
                              </p>
                              <p className="text-muted-foreground">{addr.phone}</p>
                              <p className="text-muted-foreground">{addr.street}</p>
                              <p className="text-muted-foreground">{addr.city}, {addr.state} — {addr.pincode}</p>
                            </div>
                            <div className="flex shrink-0 flex-col gap-2 items-end">
                              {!addr.isDefault && (
                                <button onClick={() => handleSetDefault(addr._id)}
                                  className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-gold transition-colors uppercase tracking-wider">
                                  <Star size={11} /> Set Default
                                </button>
                              )}
                              <button onClick={() => startEdit(addr)}
                                className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
                                <Edit2 size={11} /> Edit
                              </button>
                              <button onClick={() => handleDeleteAddr(addr._id)}
                                className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-destructive transition-colors uppercase tracking-wider">
                                <Trash2 size={11} /> Remove
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Add address button */}
                      {!showAddForm && (
                        <button onClick={() => { setShowAddForm(true); setEditingAddr(null); setAddrForm(EMPTY_ADDR); }}
                          className="flex w-full items-center justify-center gap-3 border border-dashed border-border py-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">
                          <Plus size={14} /> Add New Address
                        </button>
                      )}

                      {/* Add/Edit form */}
                      <AnimatePresence>
                        {showAddForm && (
                          <motion.form onSubmit={handleSaveAddress} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden border border-foreground p-6 space-y-4">
                            <p className="section-label">{editingAddr ? "Edit Address" : "New Address"}</p>
                            <div className="grid gap-4 sm:grid-cols-2">
                              {ADDRESS_FIELDS.map((field) => (
                                <div key={field} className={field === "street" ? "sm:col-span-2" : ""}>
                                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground capitalize">
                                    {field.replace(/([A-Z])/g, " $1")} *
                                  </label>
                                  <input type="text" required value={addrForm[field]}
                                    onChange={(e) => setAddrForm(p => ({ ...p, [field]: e.target.value }))}
                                    className="mt-1.5 w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-gold" />
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-3 pt-2">
                              <button type="submit" disabled={savingAddr}
                                className="flex items-center gap-2 bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-wider text-background transition-colors hover:bg-gold disabled:opacity-60">
                                <Check size={13} /> {savingAddr ? "Saving…" : editingAddr ? "Update Address" : "Save Address"}
                              </button>
                              <button type="button" onClick={() => { setShowAddForm(false); setEditingAddr(null); setAddrForm(EMPTY_ADDR); }}
                                className="flex items-center gap-2 border border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-muted">
                                <X size={13} /> Cancel
                              </button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AuthGuard>
  );
}
