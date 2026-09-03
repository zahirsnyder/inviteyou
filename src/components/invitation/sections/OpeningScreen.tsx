"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { InvitationData } from "../types";
import { easeLuxe } from "../shared";

const dateFmt = new Intl.DateTimeFormat("en-MY", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function OpeningScreen({
  data,
  onOpen,
}: {
  data: InvitationData;
  onOpen: () => void;
}) {
  const [opening, setOpening] = useState(false);

  const openEnvelope = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpen, 1350);
  };

  const initials = `${data.groomName[0] ?? ""}${data.brideName[0] ?? ""}`.toUpperCase();
  const dateText = dateFmt.format(new Date(data.weddingDateISO));

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-night text-cream"
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,color-mix(in_srgb,var(--gold)_14%,transparent),transparent_45%),radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--night-soft)_80%,transparent),var(--night)_75%)]" />
      <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-gold/10 sm:inset-8" />
      <div className="pointer-events-none absolute inset-7 rounded-[1.5rem] border border-gold/[0.06] sm:inset-11" />

      <div className="relative z-10 w-full max-w-2xl px-6 text-center [perspective:1400px]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: easeLuxe }}
          className="mb-3 uppercase tracking-[0.45em] text-gold text-[0.6rem] sm:text-xs"
        >
          You&apos;re Invited
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="mb-7 font-serif text-sm italic tracking-wide text-cream/60 sm:text-base"
        >
          With joy in our hearts, we invite you to celebrate
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: easeLuxe }}
          className="relative mx-auto aspect-[1.52/1] w-full max-w-lg [transform-style:preserve-3d]"
        >
          {/* Letter that rises out of the envelope */}
          <motion.div
            animate={opening ? { y: -120, scale: 1.03 } : { y: 42, scale: 0.9 }}
            transition={{ duration: 1.05, delay: opening ? 0.25 : 0, ease: easeLuxe }}
            className="absolute inset-x-[8%] top-[2%] bottom-[10%] rounded-sm border border-gold/35 bg-night-soft px-5 py-9 shadow-2xl"
          >
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.3em] text-gold-dark">The Wedding Of</p>
            <p className="mt-5 font-signature text-4xl sm:text-5xl leading-tight text-cream">
              {data.groomName} <span className="text-gold">&amp;</span> {data.brideName}
            </p>
            <p className="mt-5 font-serif text-xs tracking-[0.15em] text-cream/65">{dateText}</p>
            <div className="absolute inset-2 border border-gold-dark/25" />
          </motion.div>

          {/* Envelope body */}
          <div className="absolute inset-x-0 bottom-0 h-[72%] overflow-hidden rounded-b-2xl border border-gold/35 bg-night-soft shadow-[0_35px_100px_-25px_rgba(0,0,0,.85)]">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,transparent_49.7%,color-mix(in_srgb,var(--gold)_24%,transparent)_50%,transparent_50.3%),linear-gradient(215deg,transparent_49.7%,color-mix(in_srgb,var(--gold)_18%,transparent)_50%,transparent_50.3%)]" />
            <span className="absolute bottom-5 left-6 font-serif text-5xl text-gold/[0.14]" aria-hidden="true">❦</span>
            <span className="absolute bottom-5 right-6 rotate-180 font-serif text-5xl text-gold/[0.14]" aria-hidden="true">❦</span>
            <div className="absolute inset-x-0 bottom-5 text-center">
              <p className="font-signature text-3xl text-gold-light/90 sm:text-4xl">{data.groomName} &amp; {data.brideName}</p>
              <p className="mt-1 text-[0.5rem] uppercase tracking-[0.28em] text-cream/45">{dateText}</p>
            </div>
          </div>

          {/* Envelope flap */}
          <motion.div
            animate={{ rotateX: opening ? -178 : 0 }}
            transition={{ duration: 0.9, ease: easeLuxe }}
            style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
            className="absolute inset-x-0 top-[28%] h-[45%] rounded-t-2xl border border-gold/30 bg-night-soft [clip-path:polygon(0_0,100%_0,50%_100%)]"
          />

          {/* Wax seal / open button */}
          <motion.button
            type="button"
            onClick={openEnvelope}
            aria-label={`Open the invitation of ${data.groomName} and ${data.brideName}`}
            animate={opening ? { opacity: 0, scale: 1.4 } : { opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-1/2 top-[54%] z-20 flex h-[4.5rem] w-[4.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold-light/70 bg-gold font-serif text-xl text-[color:var(--inv-onaccent)] shadow-[0_10px_35px_rgba(0,0,0,.45)] before:absolute before:inset-1 before:rounded-full before:border before:border-gold-light/25"
          >
            {initials}
          </motion.button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: easeLuxe }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={openEnvelope}
          disabled={opening}
          className="mt-9 rounded-full border border-gold/60 bg-night/25 px-10 py-4 text-gold uppercase tracking-[0.25em] text-xs shadow-[0_12px_40px_-15px_color-mix(in_srgb,var(--gold)_50%,transparent)] backdrop-blur-sm hover:bg-gold hover:text-[color:var(--inv-onaccent)] transition-colors disabled:opacity-40"
        >
          {opening ? "Opening…" : "Open Invitation"}
        </motion.button>
      </div>
    </motion.div>
  );
}
