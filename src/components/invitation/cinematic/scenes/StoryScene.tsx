"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { InvitationData } from "../../types";
import { ParallaxLayer } from "../core/ParallaxLayer";
import { TextReveal } from "../core/TextReveal";
import { easeLuxe } from "../../shared";

/**
 * Free-flowing scene: story paragraphs interleave with photos drifting in
 * layers from alternating sides, each at a different parallax depth.
 */
export function StoryScene({ data }: { data: InvitationData }) {
  if (!data.story && data.gallery.length === 0) return null;

  const paragraphs = (data.story ?? "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  // Weave photos between paragraphs; keep the rest for the gallery scene.
  const storyPhotos = data.gallery.slice(0, Math.min(3, data.gallery.length));

  const beats = paragraphs.length
    ? paragraphs
    : ["Two hearts, one journey — and a story still being written."];

  return (
    <section className="relative py-32 px-6 bg-gradient-to-b from-night via-night-soft to-night overflow-hidden">
      {/* Drifting floral glow layers */}
      <ParallaxLayer depth={0.6} className="pointer-events-none absolute -top-20 -left-24 h-96 w-96 rounded-full bg-gold/[0.06] blur-3xl" >
        <span />
      </ParallaxLayer>
      <ParallaxLayer depth={-0.4} className="pointer-events-none absolute bottom-0 -right-24 h-[28rem] w-[28rem] rounded-full bg-gold/[0.05] blur-3xl">
        <span />
      </ParallaxLayer>

      <div className="relative mx-auto max-w-4xl">
        <div className="text-center mb-24">
          <TextReveal
            text="Our Story"
            as="h2"
            className="font-serif text-5xl sm:text-6xl text-cream"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: easeLuxe }}
            className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-gold/70 to-transparent"
          />
        </div>

        <div className="space-y-28 sm:space-y-36">
          {beats.map((paragraph, i) => {
            const photo = storyPhotos[i % Math.max(storyPhotos.length, 1)];
            const fromLeft = i % 2 === 0;
            return (
              <div
                key={i}
                className={`flex flex-col gap-10 sm:gap-16 items-center ${
                  fromLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                {photo && (
                  <ParallaxLayer depth={fromLeft ? 0.35 : -0.35} className="w-full sm:w-1/2">
                    <motion.div
                      initial={{ opacity: 0, x: fromLeft ? -70 : 70, rotate: fromLeft ? -2 : 2 }}
                      whileInView={{ opacity: 1, x: 0, rotate: fromLeft ? -1 : 1 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 1.1, ease: easeLuxe }}
                      className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-gold/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
                    >
                      <Image
                        src={photo.imageUrl}
                        alt={photo.caption ?? "Couple photo"}
                        fill
                        sizes="(max-width: 640px) 90vw, 45vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-transparent" />
                    </motion.div>
                  </ParallaxLayer>
                )}
                <div className="w-full sm:w-1/2">
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="block font-signature text-3xl text-gold/60 mb-4"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </motion.span>
                  <TextReveal
                    text={paragraph}
                    className="text-cream/75 leading-loose text-base sm:text-lg font-light"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
