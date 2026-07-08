"use client";

import { useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitRsvpAction, type PublicActionState } from "@/app/actions/public";
import { TextReveal } from "../core/TextReveal";
import { easeLuxe } from "../../shared";

const inputClass =
  "w-full rounded-xl bg-night/70 border border-cream/15 px-5 py-3.5 text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none transition-colors";
const labelClass = "block text-[0.65rem] uppercase tracking-[0.2em] text-cream/50 mb-2";

const fieldVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeLuxe } },
};

/**
 * The journey lands on the RSVP: fields rise into place one after another
 * as the form scrolls into view, ending on a soft success glow.
 */
export function RsvpScene({ slug }: { slug: string }) {
  const boundAction = submitRsvpAction.bind(null, slug);
  const [state, formAction, pending] = useActionState<PublicActionState, FormData>(boundAction, {});

  return (
    <section className="relative py-32 px-6 bg-gradient-to-b from-night to-night-soft overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,75,0.07),transparent_55%)]" />

      <div className="relative mx-auto max-w-xl">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="uppercase tracking-[0.4em] text-gold text-[0.6rem] sm:text-xs mb-5"
          >
            Kindly respond
          </motion.p>
          <TextReveal text="Will you join us?" as="h2" className="font-serif text-5xl sm:text-6xl text-cream" />
        </div>

        <AnimatePresence mode="wait">
          {state.success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: easeLuxe }}
              className="rounded-3xl border border-gold/40 bg-gold/10 p-14 text-center shadow-[0_0_120px_-30px_rgba(201,162,75,0.5)]"
            >
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 200, damping: 14 }}
                className="text-5xl mb-6"
              >
                ✦
              </motion.p>
              <h3 className="font-serif text-3xl text-gold-light mb-3">Thank you!</h3>
              <p className="text-cream/70 leading-relaxed">
                Your response has been received. We can&apos;t wait to celebrate with you.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              action={formAction}
              exit={{ opacity: 0 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ staggerChildren: 0.12 }}
              className="rounded-3xl border border-gold/20 bg-white/[0.04] backdrop-blur-sm p-8 sm:p-10 space-y-6"
            >
              <motion.div variants={fieldVariants}>
                <label htmlFor="rsvp-name" className={labelClass}>
                  Your Name
                </label>
                <input id="rsvp-name" name="name" required className={inputClass} placeholder="Full name" />
              </motion.div>

              <motion.div variants={fieldVariants}>
                <label htmlFor="rsvp-phone" className={labelClass}>
                  Phone Number <span className="text-cream/30">(optional)</span>
                </label>
                <input id="rsvp-phone" name="phone" className={inputClass} placeholder="+60 12-345 6789" />
              </motion.div>

              <motion.div variants={fieldVariants}>
                <span className={labelClass}>Will you attend?</span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "ATTENDING", label: "Joyfully attending" },
                    { value: "NOT_ATTENDING", label: "Regretfully cannot" },
                    { value: "MAYBE", label: "Not sure yet" },
                  ].map((option, i) => (
                    <label
                      key={option.value}
                      className="relative cursor-pointer rounded-xl border border-cream/15 p-4 text-center text-xs text-cream/70 transition-all has-[:checked]:border-gold has-[:checked]:bg-gold/10 has-[:checked]:text-gold-light hover:border-cream/30"
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value={option.value}
                        defaultChecked={i === 0}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fieldVariants} className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="rsvp-pax" className={labelClass}>
                    Number of Guests
                  </label>
                  <input
                    id="rsvp-pax"
                    name="paxCount"
                    type="number"
                    min={1}
                    max={20}
                    defaultValue={1}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="rsvp-meal" className={labelClass}>
                    Meal Preference
                  </label>
                  <input id="rsvp-meal" name="mealPreference" className={inputClass} placeholder="e.g. Vegetarian" />
                </div>
              </motion.div>

              <motion.div variants={fieldVariants}>
                <label htmlFor="rsvp-message" className={labelClass}>
                  Message to the Couple <span className="text-cream/30">(optional)</span>
                </label>
                <textarea
                  id="rsvp-message"
                  name="message"
                  rows={3}
                  maxLength={500}
                  className={inputClass}
                  placeholder="A note for the happy couple…"
                />
              </motion.div>

              {state.error && (
                <p className="text-red-300 text-sm rounded-xl bg-red-950/40 border border-red-500/20 px-4 py-3">
                  {state.error}
                </p>
              )}

              <motion.button
                variants={fieldVariants}
                type="submit"
                disabled={pending}
                className="w-full rounded-full bg-gold text-night py-4 font-medium tracking-[0.15em] uppercase text-sm hover:bg-gold-light transition-colors disabled:opacity-60"
              >
                {pending ? "Sending…" : "Send RSVP"}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
