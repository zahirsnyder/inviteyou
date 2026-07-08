"use client";

import Image from "next/image";
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
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-night"
      exit={{ opacity: 0 }}
    >
      {data.coverImageUrl && (
        <Image
          src={data.coverImageUrl}
          alt=""
          fill
          priority
          className="object-cover opacity-25"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/50 to-night/90" />

      <div className="relative z-10 text-center px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: easeLuxe }}
          className="uppercase tracking-[0.4em] text-gold text-[0.65rem] sm:text-xs mb-8"
        >
          The Wedding Of
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: easeLuxe }}
          className="font-signature text-6xl sm:text-8xl text-cream leading-snug"
        >
          {data.groomName} <span className="text-gold-light">&amp;</span> {data.brideName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-8 font-serif text-lg text-cream/70 tracking-widest"
        >
          {dateFmt.format(new Date(data.weddingDateISO))}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: easeLuxe }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          className="mt-14 rounded-full border border-gold/60 px-12 py-4 text-gold uppercase tracking-[0.25em] text-xs hover:bg-gold hover:text-night transition-colors"
        >
          Open Invitation
        </motion.button>
      </div>
    </motion.div>
  );
}
