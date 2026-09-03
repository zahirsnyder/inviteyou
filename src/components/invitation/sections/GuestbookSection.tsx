"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { submitWishAction, type PublicActionState } from "@/app/actions/public";
import type { InvitationWish } from "../types";
import { SectionHeading, easeLuxe } from "../shared";

const inputClass =
  "w-full rounded-xl bg-night/70 border border-cream/15 px-5 py-3.5 text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none transition-colors";
const labelClass = "block text-[0.65rem] uppercase tracking-[0.2em] text-cream/50 mb-2";

export function GuestbookSection({
  slug,
  wishes,
}: {
  slug: string;
  wishes: InvitationWish[];
}) {
  const boundAction = submitWishAction.bind(null, slug);
  const [state, formAction, pending] = useActionState<PublicActionState, FormData>(boundAction, {});

  return (
    <section className="py-28 px-6 bg-gradient-to-b from-night to-night-soft">
      <div className="mx-auto max-w-2xl">
        <SectionHeading eyebrow="Words of love" title="Guestbook" />

        {state.success ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-gold/30 bg-gold/10 p-6 text-center text-gold-light font-serif text-lg mb-12"
          >
            Thank you — your wish means the world to us ✦
          </motion.p>
        ) : (
          <form
            action={formAction}
            className="rounded-3xl border border-gold/20 bg-white/[0.04] backdrop-blur-sm p-8 space-y-5 mb-12"
          >
            <div>
              <label htmlFor="wish-name" className={labelClass}>
                Your Name
              </label>
              <input id="wish-name" name="name" required className={inputClass} placeholder="Full name" />
            </div>
            <div>
              <label htmlFor="wish-message" className={labelClass}>
                Your Wish
              </label>
              <textarea
                id="wish-message"
                name="message"
                rows={3}
                required
                maxLength={500}
                className={inputClass}
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
                transition={{ duration: 0.7, delay: Math.min(i * 0.06, 0.4), ease: easeLuxe }}
                className="rounded-2xl border border-cream/10 bg-white/[0.03] p-6"
              >
                <p className="text-cream/75 text-sm leading-relaxed italic">“{wish.message}”</p>
                <footer className="mt-3 text-gold-light font-serif">— {wish.name}</footer>
              </motion.blockquote>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
