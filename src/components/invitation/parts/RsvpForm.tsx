"use client";

import { useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitRsvpAction, type PublicActionState } from "@/app/actions/public";

type Variant = "panel" | "bare";

const ATTEND = [
  { value: "ATTENDING", label: "Joyfully attending" },
  { value: "NOT_ATTENDING", label: "Regretfully cannot" },
  { value: "MAYBE", label: "Not sure yet" },
];

/**
 * Shared RSVP form. Structure is the same everywhere (a form is a form); the
 * `variant` and the surrounding section chrome give each template its look.
 * Colours come from the active theme's CSS custom properties.
 */
export function RsvpForm({ slug, variant = "panel" }: { slug: string; variant?: Variant }) {
  const boundAction = submitRsvpAction.bind(null, slug);
  const [state, formAction, pending] = useActionState<PublicActionState, FormData>(boundAction, {});

  const field =
    variant === "bare"
      ? "w-full bg-transparent border-b border-cream/25 px-1 py-2.5 text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none transition-colors"
      : "w-full rounded-xl bg-night/60 border border-cream/15 px-5 py-3.5 text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none transition-colors";
  const label = "block text-[0.65rem] uppercase tracking-[0.2em] text-cream/50 mb-2";
  const wrap =
    variant === "bare"
      ? "space-y-6"
      : "rounded-3xl border border-gold/20 bg-cream/[0.04] backdrop-blur-sm p-8 sm:p-10 space-y-6";

  return (
    <AnimatePresence mode="wait">
      {state.success ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-gold/30 bg-gold/10 p-12 text-center"
        >
          <p className="text-4xl mb-4 text-gold-light">✦</p>
          <h3 className="font-serif text-3xl text-gold-light mb-3">Thank you!</h3>
          <p className="text-cream/70 leading-relaxed">
            Your response has been received. We can&apos;t wait to celebrate with you.
          </p>
        </motion.div>
      ) : (
        <motion.form key="form" action={formAction} exit={{ opacity: 0 }} className={wrap}>
          <div>
            <label htmlFor="rsvp-name" className={label}>Your Name</label>
            <input id="rsvp-name" name="name" required className={field} placeholder="Full name" />
          </div>
          <div>
            <label htmlFor="rsvp-phone" className={label}>
              Phone Number <span className="text-cream/30 normal-case">(optional)</span>
            </label>
            <input id="rsvp-phone" name="phone" className={field} placeholder="+60 12-345 6789" />
          </div>
          <div>
            <span className={label}>Will you attend?</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ATTEND.map((o, i) => (
                <label
                  key={o.value}
                  className="relative cursor-pointer rounded-xl border border-cream/15 p-4 text-center text-xs text-cream/70 transition-all has-[:checked]:border-gold has-[:checked]:bg-gold/10 has-[:checked]:text-gold-light hover:border-cream/30"
                >
                  <input type="radio" name="attendance" value={o.value} defaultChecked={i === 0} className="sr-only" />
                  {o.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="rsvp-pax" className={label}>Number of Guests</label>
            <input id="rsvp-pax" name="paxCount" type="number" min={1} max={20} defaultValue={1} required className={field} />
          </div>
          <div>
            <label htmlFor="rsvp-message" className={label}>
              Message to the Couple <span className="text-cream/30 normal-case">(optional)</span>
            </label>
            <textarea id="rsvp-message" name="message" rows={3} maxLength={500} className={field} placeholder="A note for the happy couple…" />
          </div>
          {state.error && (
            <p className="text-red-300 text-sm rounded-xl bg-red-950/40 border border-red-500/20 px-4 py-3">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-gold text-[color:var(--inv-onaccent)] py-4 font-medium tracking-[0.15em] uppercase text-sm hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send RSVP"}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
