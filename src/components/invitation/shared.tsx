"use client";

import { motion } from "framer-motion";

export const easeLuxe = [0.22, 1, 0.36, 1] as const;

/** Scroll-reveal wrapper used across invitation sections. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: easeLuxe }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="text-center mb-14">
      <p className="text-gold uppercase tracking-[0.35em] text-[0.65rem] sm:text-xs mb-4">
        {eyebrow}
      </p>
      <h2 className="font-serif text-4xl sm:text-5xl text-cream">{title}</h2>
      <div className="gold-divider max-w-[200px] mx-auto mt-6">
        <span className="text-sm">✦</span>
      </div>
    </Reveal>
  );
}
