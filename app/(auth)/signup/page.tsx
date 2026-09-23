"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";
import { GuestGuard } from "@/components/auth/AuthGuard";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { toast } from "@/lib/toast";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/auth/signup", form);
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Signup failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestGuard>
      <div className="flex min-h-screen">
        {/* Left — dark brand panel */}
        <div className="relative hidden w-[45%] flex-col justify-between bg-charcoal px-14 py-16 lg:flex">
          <div className="light-sweep absolute inset-0 pointer-events-none" />
          <Link href="/" className="relative">
            <img src="/assets/a4lights-logo-light.png" alt="A4LIGHTS" className="h-10 w-auto" />
          </Link>
          <div className="relative">
            <p className="section-label text-champagne">Create Account</p>
            <h1 className="section-title text-ivory max-w-xs">
              Join <em>A4LIGHTS.</em>
            </h1>
            <p className="mt-6 max-w-xs text-sm leading-7 text-ivory/55">
              Browse our full product range, track orders and get professional installation support.
            </p>
          </div>
          <p className="relative text-[11px] text-ivory/30">© 2026 A4LIGHTS. All rights reserved.</p>
        </div>

        {/* Right — form */}
        <div className="flex flex-1 flex-col items-center justify-center bg-background px-5 py-16 md:px-10">
          <Link href="/" className="mb-10 lg:hidden">
            <img src="/assets/a4lights-logo.png" alt="A4LIGHTS" className="h-9 w-auto" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="w-full max-w-md"
          >
            <p className="section-label">Create Account</p>
            <h2 className="font-serif text-4xl text-foreground">
              Get <em>Started.</em>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-foreground underline underline-offset-4 hover:text-gold transition-colors">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Full Name *</label>
                  <input type="text" required value={form.name} onChange={set("name")} placeholder="e.g. Arjun Mehta"
                    className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Phone *</label>
                  <input type="tel" required value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210"
                    className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email Address *</label>
                <input type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com"
                  className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold" />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Password *</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} required value={form.password} onChange={set("password")} placeholder="Min. 8 chars, mixed case + special"
                    className="mt-2 w-full border-b border-border bg-transparent py-2.5 pr-10 text-sm text-foreground outline-none transition-colors focus:border-gold" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-0 top-3 p-1 text-muted-foreground hover:text-foreground transition-colors" aria-label="Toggle password">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Confirm Password *</label>
                <input type="password" required value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Re-enter your password"
                  className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold" />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-destructive">Passwords do not match</p>
                )}
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 bg-foreground py-4 text-xs font-semibold uppercase tracking-widest text-background transition-colors duration-300 hover:bg-gold disabled:opacity-60">
                  <span>{loading ? "Creating account…" : "Create Account"}</span>
                  {!loading && <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </GuestGuard>
  );
}
