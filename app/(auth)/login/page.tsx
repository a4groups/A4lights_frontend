"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { GuestGuard } from "@/components/auth/AuthGuard";
import toast from "react-hot-toast";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Invalid email or password.";
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
            <p className="section-label text-champagne">Member Portal</p>
            <h1 className="section-title text-ivory max-w-xs">
              Welcome <em>Back.</em>
            </h1>
            <p className="mt-6 max-w-xs text-sm leading-7 text-ivory/55">
              Access your orders, saved addresses, and project history in one place.
            </p>
          </div>
          <p className="relative text-[11px] text-ivory/30">© 2026 A4LIGHTS. All rights reserved.</p>
        </div>

        {/* Right — form */}
        <div className="flex flex-1 flex-col items-center justify-center bg-background px-5 py-16 md:px-10">
          {/* Mobile logo */}
          <Link href="/" className="mb-10 lg:hidden">
            <img src="/assets/a4lights-logo.png" alt="A4LIGHTS" className="h-9 w-auto" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="w-full max-w-md"
          >
            <p className="section-label">Sign In</p>
            <h2 className="font-serif text-4xl text-foreground">
              Your <em>Account.</em>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-foreground underline underline-offset-4 hover:text-gold transition-colors">
                Sign up free
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-2 w-full border-b border-border bg-transparent py-2.5 pr-10 text-sm text-foreground outline-none transition-colors focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-0 top-3 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <Link href="/forgot-password" className="text-[11px] uppercase tracking-wider text-muted-foreground hover:text-gold transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 bg-foreground py-4 text-xs font-semibold uppercase tracking-widest text-background transition-colors duration-300 hover:bg-gold disabled:opacity-60"
              >
                <span>{loading ? "Signing in…" : "Sign In"}</span>
                {!loading && <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </GuestGuard>
  );
}
