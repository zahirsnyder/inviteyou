"use client";

import Link from "next/link";
import { useActionState } from "react";
import { motion } from "framer-motion";
import { loginAction, registerAction, type AuthState } from "@/app/actions/auth";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, {});
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className="min-h-screen bg-night text-cream flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Link href="/" className="block text-center font-serif text-3xl mb-10">
          Invite<span className="text-gold">You</span>
        </Link>

        <div className="rounded-2xl border border-gold/20 bg-white/[0.04] backdrop-blur-sm p-8 sm:p-10">
          <h1 className="font-serif text-3xl text-center mb-2">
            {mode === "login" ? "Welcome back" : "Begin your story"}
          </h1>
          <p className="text-center text-cream/50 text-sm mb-8">
            {mode === "login"
              ? "Log in to manage your wedding invitation"
              : "Create an account to craft your invitation"}
          </p>

          <form action={formAction} className="space-y-5">
            {next && <input type="hidden" name="next" value={next} />}
            {mode === "register" && (
              <div>
                <label htmlFor="name" className="block text-xs uppercase tracking-widest text-cream/60 mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-lg bg-night/60 border border-cream/15 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none transition-colors"
                  placeholder="Amir Hakim"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-widest text-cream/60 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg bg-night/60 border border-cream/15 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-widest text-cream/60 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={mode === "register" ? 8 : 1}
                className="w-full rounded-lg bg-night/60 border border-cream/15 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none transition-colors"
                placeholder={mode === "register" ? "At least 8 characters" : "Your password"}
              />
            </div>

            {state.error && (
              <p className="text-red-400 text-sm rounded-lg bg-red-950/40 border border-red-500/20 px-4 py-3">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-gold text-night py-3.5 font-medium tracking-wide hover:bg-gold-light transition-colors disabled:opacity-60"
            >
              {pending ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-cream/50">
            {mode === "login" ? (
              <>
                New to InviteYou?{" "}
                <Link href={`/register${nextQuery}`} className="text-gold hover:text-gold-light">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href={`/login${nextQuery}`} className="text-gold hover:text-gold-light">
                  Log in
                </Link>
              </>
            )}
          </p>
        </div>

        {mode === "login" && (
          <p className="mt-6 text-center text-xs text-cream/35">
            Demo account: demo@inviteyou.com / demo1234
          </p>
        )}
      </motion.div>
    </div>
  );
}
