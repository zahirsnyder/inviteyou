"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import type { InvitationData } from "../../types";
import { TextReveal } from "../core/TextReveal";
import { useCinematic } from "../core/CinematicProvider";
import { easeLuxe } from "../../shared";

const dateFmt = new Intl.DateTimeFormat("en-MY", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * The venue slowly zooms behind glass event cards that float up with depth,
 * one per beat of the day (akad, reception, dinner…).
 */
export function EventsScene({ data }: { data: InvitationData }) {
  const { reduced } = useCinematic();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.25, 1.05]);
  const bgY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-6%", "6%"]);

  if (data.events.length === 0) return null;

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
      {data.coverImageUrl && (
        <motion.div style={{ scale: bgScale, y: bgY }} className="absolute inset-0 will-change-transform">
          <Image src={data.coverImageUrl} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-night via-night/80 to-night" />

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="uppercase tracking-[0.4em] text-gold text-[0.6rem] sm:text-xs mb-5"
          >
            When &amp; Where
          </motion.p>
          <TextReveal
            text="The Celebration"
            as="h2"
            className="font-serif text-5xl sm:text-6xl text-cream"
          />
        </div>

        <div className="space-y-12">
          {data.events.map((event, i) => (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, y: 90, rotateX: 12, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.1, delay: i * 0.08, ease: easeLuxe }}
              style={{ transformPerspective: 1000 }}
              className="rounded-3xl border border-gold/25 bg-night/60 backdrop-blur-xl p-10 sm:p-14 text-center shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] will-change-transform"
            >
              <p className="uppercase tracking-[0.3em] text-gold text-[0.6rem] sm:text-xs mb-4">
                {dateFmt.format(new Date(event.eventDateISO))}
              </p>
              <h3 className="font-serif text-3xl sm:text-4xl text-cream mb-3">{event.title}</h3>
              {(event.startTime || event.endTime) && (
                <p className="text-gold-light font-serif text-lg mb-5">
                  {event.startTime}
                  {event.endTime && ` — ${event.endTime}`}
                </p>
              )}
              {event.description && (
                <p className="text-cream/60 text-sm leading-relaxed max-w-md mx-auto mb-6">
                  {event.description}
                </p>
              )}
              <div className="gold-divider max-w-[110px] mx-auto mb-6">
                <span className="text-xs">✦</span>
              </div>
              <p className="font-serif text-xl text-cream/90">{event.venueName}</p>
              <p className="text-cream/50 text-sm mt-1">{event.address}</p>
              {event.mapUrl && (
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-block rounded-full border border-gold/50 px-8 py-3 text-gold text-[0.65rem] uppercase tracking-[0.25em] hover:bg-gold hover:text-night transition-colors"
                >
                  Open Map
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
