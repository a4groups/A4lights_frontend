"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { GuestGuard } from "@/components/auth/AuthGuard";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import toast from "react-hot-toast";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "done">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (countdown === 0) return;
    const t = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      toast.success("OTP sent to your email.");
      setStep("otp");
      setCountdown(60);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match."); return; }
    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", {
        email,
        otp: otp.join(""),
        newPassword,
        confirmPassword,
      });
      setStep("done");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Reset failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    try {
      await api.post("/api/auth/forgot-password", { email });
      toast.success("New OTP sent.");
      setCountdown(60);
    } catch {
      toast.error("Could not resend OTP.");
    }
  };

  return (
    <GuestGuard>
      <div className="flex min-h-screen">
        <div className="relative hidden w-[45%] flex-col justify-between bg-charcoal px-14 py-16 lg:flex">
          <div className="light-sweep absolute inset-0 pointer-events-none" />
          <Link href="/" className="relative">
            <img src="/assets/a4lights-logo-light.png" alt="A4LIGHTS" className="h-10 w-auto" />
          </Link>
          <div className="relative">
            <p className="section-label text-champagne">Account Recovery</p>
            <h1 className="section-title text-ivory max-w-xs">Reset Your <em>Password.</em></h1>
            <p className="mt-6 max-w-xs text-sm leading-7 text-ivory/55">
              We'll send a one-time code to your registered email address.
            </p>
          </div>
          <p className="relative text-[11px] text-ivory/30">© 2026 A4LIGHTS. All rights reserved.</p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center bg-background px-5 py-16 md:px-10">
          <Link href="/" className="mb-10 lg:hidden">
            <img src="/assets/a4lights-logo.png" alt="A4LIGHTS" className="h-9 w-auto" />
          </Link>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="w-full max-w-md"
          >
            {step === "email" && (
              <>
                <p className="section-label">Password Reset</p>
                <h2 className="font-serif text-4xl text-foreground">Forgot <em>Password?</em></h2>
                <p className="mt-3 text-sm text-muted-foreground">Enter your account email and we'll send you a 6-digit OTP.</p>
                <form onSubmit={handleEmailSubmit} className="mt-10 space-y-6">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email Address *</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                      className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="group flex w-full items-center justify-center gap-3 bg-foreground py-4 text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:bg-gold disabled:opacity-60">
                    <span>{loading ? "Sending…" : "Send OTP"}</span>
                    {!loading && <ArrowUpRight size={15} />}
                  </button>
                  <p className="text-center text-sm"><Link href="/login" className="text-foreground/60 hover:text-gold transition-colors">← Back to sign in</Link></p>
                </form>
              </>
            )}

            {step === "otp" && (
              <>
                <p className="section-label">Verify & Reset</p>
                <h2 className="font-serif text-4xl text-foreground">Enter <em>OTP.</em></h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  We sent a 6-digit code to <strong className="text-foreground">{email}</strong>
                </p>
                <form onSubmit={handleReset} className="mt-10 space-y-6">
                  {/* 6 OTP boxes */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">6-Digit OTP *</label>
                    <div className="mt-3 flex gap-2">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-${i}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="h-12 w-full border border-border bg-transparent text-center text-lg font-semibold text-foreground outline-none transition-colors focus:border-gold"
                        />
                      ))}
                    </div>
                    <button type="button" onClick={resendOtp} disabled={countdown > 0}
                      className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-gold disabled:pointer-events-none disabled:opacity-50">
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">New Password *</label>
                    <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold" />
                    <PasswordStrength password={newPassword} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Confirm Password *</label>
                    <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold" />
                  </div>
                  <button type="submit" disabled={loading || otp.join("").length < 6}
                    className="group flex w-full items-center justify-center gap-3 bg-foreground py-4 text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:bg-gold disabled:opacity-60">
                    <span>{loading ? "Resetting…" : "Reset Password"}</span>
                    {!loading && <ArrowUpRight size={15} />}
                  </button>
                </form>
              </>
            )}

            {step === "done" && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-6 flex size-16 items-center justify-center bg-gold/10 text-gold">
                  <CheckCircle2 size={36} />
                </div>
                <p className="section-label">Success</p>
                <h2 className="font-serif text-4xl text-foreground">Password <em>Reset.</em></h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">Your password has been updated. Please sign in with your new credentials.</p>
                <button onClick={() => router.push("/login")}
                  className="mt-8 flex items-center gap-3 mx-auto bg-foreground px-8 py-4 text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:bg-gold">
                  <span>Sign In</span><ArrowUpRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </GuestGuard>
  );
}
