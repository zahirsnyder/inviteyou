"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import type { InvitationData } from "../types";
import { easeLuxe } from "../shared";

const dateFmt = new Intl.DateTimeFormat("en-MY", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function HeroSection({ data }: { data: InvitationData }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {data.coverImageUrl && (
        <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
          <Image
            src={data.coverImageUrl}
            alt={`${data.groomName} and ${data.brideName}`}
            fill
            priority
            className="object-cover opacity-40"
          />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-transparent to-night" />

      <motion.div style={{ opacity: textOpacity }} className="relative z-10 text-center px-6 py-32">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: easeLuxe }}
          className="uppercase tracking-[0.4em] text-gold text-[0.65rem] sm:text-xs mb-10"
        >
          Together with their families
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: easeLuxe }}
          className="font-serif text-6xl sm:text-8xl leading-tight text-cream"
        >
          {data.groomName}
          <span className="block font-signature text-4xl sm:text-6xl text-gold-light my-4">&amp;</span>
          {data.brideName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-10"
        >
          <p className="text-cream/70 tracking-[0.2em] uppercase text-xs sm:text-sm">
            {dateFmt.format(new Date(data.weddingDateISO))}
          </p>
          <p className="mt-6 font-serif italic text-lg text-cream/60 max-w-md mx-auto">
            We invite you to celebrate our wedding
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/60"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="block text-2xl"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
