"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { submitWishAction, type PublicActionState } from "@/app/actions/public";
import type { InvitationWish } from "../types";

type Variant = "panel" | "bare";

/** Shared guestbook: form + list. Section chrome around it is per-template. */
export function WishForm({
  slug,
  wishes,
  variant = "panel",
}: {
  slug: string;
  wishes: InvitationWish[];
  variant?: Variant;
}) {
  const boundAction = submitWishAction.bind(null, slug);
  const [state, formAction, pending] = useActionState<PublicActionState, FormData>(boundAction, {});

  const field =
    variant === "bare"
      ? "w-full bg-transparent border-b border-cream/25 px-1 py-2.5 text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none transition-colors"
      : "w-full rounded-xl bg-night/60 border border-cream/15 px-5 py-3.5 text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none transition-colors";
  const label = "block text-[0.65rem] uppercase tracking-[0.2em] text-cream/50 mb-2";
  const wrap =
    variant === "bare"
      ? "space-y-5 mb-14"
      : "rounded-3xl border border-gold/20 bg-cream/[0.04] backdrop-blur-sm p-8 space-y-5 mb-14";

  return (
    <div>
      {state.success ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-gold/30 bg-gold/10 p-6 text-center text-gold-light font-serif text-lg mb-12"
        >
          Thank you — your wish means the world to us ✦
        </motion.p>
      ) : (
        <form action={formAction} className={wrap}>
          <div>
            <label htmlFor="wish-name" className={label}>Your Name</label>
            <input id="wish-name" name="name" required className={field} placeholder="Full name" />
          </div>
          <div>
            <label htmlFor="wish-message" className={label}>Your Wish</label>
            <textarea
              id="wish-message"
              name="message"
              rows={3}
              required
              maxLength={500}
              className={field}
              placeholder="Share your blessing for the couple…"
            />
          </div>
          {state.error && (
            <p className="text-red-300 text-sm rounded-xl bg-red-950/40 border border-red-500/20 px-4 py-3">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full border border-gold/60 px-8 py-3 text-gold text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-[color:var(--inv-onaccent)] transition-colors disabled:opacity-60"
          >
            {pending ? "Sending…" : "Leave a Wish"}
          </button>
        </form>
      )}

      {wishes.length > 0 && (
        <div className="space-y-4">
          {wishes.map((wish, i) => (
            <motion.blockquote
              key={wish.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.6, delay: Math.min(i * 0.05, 0.35) }}
              className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-6"
            >
              <p className="text-cream/75 text-sm leading-relaxed italic">“{wish.message}”</p>
              <footer className="mt-3 text-gold-light font-serif">— {wish.name}</footer>
            </motion.blockquote>
          ))}
        </div>
      )}
    </div>
  );
}
