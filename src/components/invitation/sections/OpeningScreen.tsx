"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { InvitationData } from "../types";
import { easeLuxe } from "../shared";
import { BotanicalDepthScene } from "../three/BotanicalDepthScene";

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

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-night"
      exit={{ opacity: 0 }}
    >
      <BotanicalDepthScene />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(38,91,68,0.3),transparent_38%),radial-gradient(circle_at_50%_18%,rgba(201,162,75,0.1),transparent_26%),linear-gradient(to_bottom,rgba(12,10,9,.3),rgba(12,10,9,.86))]" />
      <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-gold/10 sm:inset-8" />
      <div className="pointer-events-none absolute inset-7 rounded-[1.5rem] border border-gold/[0.06] sm:inset-11" />

      <div className="relative z-10 w-full max-w-2xl px-6 text-center [perspective:1400px]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: easeLuxe }}
          className="mb-3 uppercase tracking-[0.45em] text-gold text-[0.6rem] sm:text-xs"
        >
          Walimatul Urus
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="mb-7 font-serif text-sm italic tracking-wide text-cream/55 sm:text-base"
        >
          Dengan penuh rasa kesyukuran, kami menjemput anda
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: easeLuxe }}
          className="relative mx-auto aspect-[1.52/1] w-full max-w-lg [transform-style:preserve-3d]"
        >
          <motion.div
            animate={opening ? { y: -120, scale: 1.03 } : { y: 42, scale: 0.9 }}
            transition={{ duration: 1.05, delay: opening ? 0.25 : 0, ease: easeLuxe }}
            className="absolute inset-x-[8%] top-[2%] bottom-[10%] rounded-sm border border-gold/35 bg-[#f4ead5] px-5 py-9 text-night shadow-2xl"
          >
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.3em] text-gold-dark">Walimatul Urus</p>
            <p className="mt-5 font-signature text-4xl sm:text-5xl leading-tight text-[#18372d]">{data.groomName} <span className="text-gold-dark">&amp;</span> {data.brideName}</p>
            <p className="mt-5 font-serif text-xs tracking-[0.15em] text-night/65">{dateFmt.format(new Date(data.weddingDateISO))}</p>
            <div className="absolute inset-2 border border-gold-dark/20" />
          </motion.div>

          <div className="absolute inset-x-0 bottom-0 h-[72%] overflow-hidden rounded-b-2xl border border-gold/35 bg-[#153a2e] shadow-[0_35px_100px_-25px_rgba(0,0,0,.95)]">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,transparent_49.7%,rgba(201,162,75,.28)_50%,transparent_50.3%),linear-gradient(215deg,transparent_49.7%,rgba(201,162,75,.2)_50%,transparent_50.3%)]" />
            <span className="absolute bottom-5 left-6 font-serif text-5xl text-gold/[0.12]" aria-hidden="true">❦</span>
            <span className="absolute bottom-5 right-6 rotate-180 font-serif text-5xl text-gold/[0.12]" aria-hidden="true">❦</span>
            <div className="absolute inset-x-0 bottom-5 text-center">
              <p className="font-signature text-3xl text-gold-light/90 sm:text-4xl">{data.groomName} &amp; {data.brideName}</p>
              <p className="mt-1 text-[0.5rem] uppercase tracking-[0.28em] text-cream/45">{dateFmt.format(new Date(data.weddingDateISO))}</p>
            </div>
          </div>
          <motion.div
            animate={{ rotateX: opening ? -178 : 0 }}
            transition={{ duration: 0.9, ease: easeLuxe }}
            style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
            className="absolute inset-x-0 top-[28%] h-[45%] rounded-t-2xl border border-gold/30 bg-[#194536] [clip-path:polygon(0_0,100%_0,50%_100%)]"
          />
          <motion.button
            type="button"
            onClick={openEnvelope}
            aria-label="Buka jemputan Zahir dan Nisa"
            animate={opening ? { opacity: 0, scale: 1.4 } : { opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-1/2 top-[54%] z-20 flex h-[4.5rem] w-[4.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold-light/70 bg-[#9c3430] font-serif text-xl text-[#f5d894] shadow-[0_10px_35px_rgba(0,0,0,.55)] before:absolute before:inset-1 before:rounded-full before:border before:border-gold-light/25"
          >
            ZN
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
          className="mt-9 rounded-full border border-gold/60 bg-night/25 px-10 py-4 text-gold uppercase tracking-[0.25em] text-xs shadow-[0_12px_40px_-15px_rgba(201,162,75,.5)] backdrop-blur-sm hover:bg-gold hover:text-night transition-colors disabled:opacity-40"
        >
          {opening ? "Membuka…" : "Buka Jemputan"}
        </motion.button>
      </div>
    </motion.div>
  );
}
