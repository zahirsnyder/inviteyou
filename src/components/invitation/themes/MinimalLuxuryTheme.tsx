"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { InvitationData } from "../types";
import { getPreset, presetCssVars } from "./presets";
import { useCountdown } from "../parts/useCountdown";
import { useInvitationShell } from "../parts/useInvitationShell";
import { ParticleField } from "../three/ParticleField";
import { RsvpForm } from "../parts/RsvpForm";
import { WishForm } from "../parts/WishForm";
import { GiftContact } from "../parts/GiftContact";
import { MapButtons } from "../parts/MapButtons";

const numDate = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
const wordDate = new Intl.DateTimeFormat("en-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-10 flex items-baseline gap-4 border-b border-cream/15 pb-3">
      <span className="text-xs tabular-nums text-gold">{n}</span>
      <h2 className="text-xs uppercase tracking-[0.35em] text-cream/60">{title}</h2>
    </div>
  );
}

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 },
};

/**
 * Minimal Luxury White — editorial. Left-aligned, hairline rules, numbered
 * sections, huge whitespace, a split hero. No cards, no ornament: type on paper.
 */
export function MinimalLuxuryTheme({ data }: { data: InvitationData }) {
  const preset = getPreset("minimal-luxury-white");
  const { audioRef, musicPlaying, toggleMusic } = useInvitationShell(data.musicUrl);
  const { timeLeft, mounted } = useCountdown(data.weddingDateISO);
  const date = new Date(data.weddingDateISO);

  return (
    <div
      style={presetCssVars(preset)}
      data-scheme={preset.scheme}
      className="bg-night text-cream min-h-screen invitation-scroll"
    >
      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop preload="none" />}

      {/* A whisper of drifting motes — barely there, in keeping with the restraint */}
      <ParticleField
        mode="drift"
        blend="normal"
        color={preset.accent}
        count={34}
        size={0.05}
        opacity={0.16}
        speed={0.35}
      />

      {data.musicUrl && (
        <button
          onClick={toggleMusic}
          aria-label={musicPlaying ? "Pause music" : "Play music"}
          className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full border border-cream/25 bg-night/70 backdrop-blur-sm text-cream/70 hover:border-gold hover:text-gold transition-all"
        >
          {musicPlaying ? "❚❚" : "♪"}
        </button>
      )}

      {/* Hero — split */}
      <section className="relative z-10 grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col justify-between px-8 py-14 sm:px-16 lg:py-20">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">The Wedding Of</p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-6xl leading-[1.05] sm:text-7xl"
          >
            {data.groomName}
            <span className="mt-2 block font-signature text-4xl text-gold sm:text-5xl">and</span>
            {data.brideName}
          </motion.h1>
          <div className="space-y-1">
            <p className="font-serif text-3xl tabular-nums sm:text-4xl">{numDate.format(date)}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
              {wordDate.format(date)}
            </p>
          </div>
        </div>
        <div className="relative min-h-[50vh] lg:min-h-full">
          {data.coverImageUrl && (
            <Image src={data.coverImageUrl} alt={`${data.groomName} & ${data.brideName}`} fill className="object-cover" />
          )}
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-3xl px-8 sm:px-10">
        {/* Quote */}
        {data.quote && (
          <motion.blockquote {...fade} className="border-l border-gold/50 py-20 pl-8">
            <p className="font-serif text-2xl italic leading-relaxed text-cream/80">{data.quote}</p>
          </motion.blockquote>
        )}

        {/* Story */}
        {data.story && (
          <motion.section {...fade} className="py-20">
            <SectionLabel n="01" title="Our Story" />
            <p className="columns-1 gap-10 whitespace-pre-line font-serif text-lg leading-loose text-cream/75 sm:columns-2">
              {data.story}
            </p>
          </motion.section>
        )}

        {/* Countdown — one quiet line */}
        <motion.section {...fade} className="border-y border-cream/15 py-10 text-center">
          {mounted && timeLeft ? (
            <p className="text-sm uppercase tracking-[0.3em] text-cream/60">
              <span className="text-gold tabular-nums">{timeLeft.days}</span> days ·{" "}
              <span className="text-gold tabular-nums">{String(timeLeft.hours).padStart(2, "0")}</span> hrs ·{" "}
              <span className="text-gold tabular-nums">{String(timeLeft.minutes).padStart(2, "0")}</span> min
              <span className="ml-2 text-cream/40">until the day</span>
            </p>
          ) : (
            <p className="text-sm uppercase tracking-[0.3em] text-gold">The day has arrived</p>
          )}
        </motion.section>

        {/* Events — numbered list */}
        {data.events.length > 0 && (
          <motion.section {...fade} className="py-20">
            <SectionLabel n="02" title="Schedule" />
            <div className="divide-y divide-cream/12">
              {data.events.map((e, i) => (
                <div key={e.id} className="grid gap-2 py-8 sm:grid-cols-[3rem_1fr]">
                  <span className="font-serif text-xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-serif text-2xl">{e.title}</h3>
                    <dl className="mt-3 space-y-1 text-sm text-cream/60">
                      <div className="flex gap-3">
                        <dt className="w-16 shrink-0 uppercase tracking-[0.2em] text-cream/40 text-[0.65rem] pt-0.5">Date</dt>
                        <dd>{wordDate.format(new Date(e.eventDateISO))}</dd>
                      </div>
                      {(e.startTime || e.endTime) && (
                        <div className="flex gap-3">
                          <dt className="w-16 shrink-0 uppercase tracking-[0.2em] text-cream/40 text-[0.65rem] pt-0.5">Time</dt>
                          <dd>{e.startTime}{e.endTime && ` – ${e.endTime}`}</dd>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <dt className="w-16 shrink-0 uppercase tracking-[0.2em] text-cream/40 text-[0.65rem] pt-0.5">Venue</dt>
                        <dd>
                          {e.venueName}
                          <span className="block text-cream/40">{e.address}</span>
                          <MapButtons
                            mapUrl={e.mapUrl}
                            wazeUrl={e.wazeUrl}
                            wrapClass="mt-1 flex flex-wrap gap-4"
                            linkClass="inline-block text-gold hover:underline"
                          />
                        </dd>
                      </div>
                    </dl>
                    {e.description && <p className="mt-3 text-sm italic text-cream/50">{e.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Gallery — asymmetric */}
        {data.features.gallery && data.gallery.length > 0 && (
          <motion.section {...fade} className="py-20">
            <SectionLabel n="03" title="Photographs" />
            <div className="space-y-16">
              {data.gallery.map((g, i) => (
                <figure key={g.id} className={i % 3 === 0 ? "" : "sm:w-2/3" + (i % 3 === 2 ? " sm:ml-auto" : "")}>
                  <Image
                    src={g.imageUrl}
                    alt={g.caption ?? "Photograph"}
                    width={900}
                    height={1100}
                    className="w-full object-cover"
                  />
                  {g.caption && (
                    <figcaption className="mt-2 text-xs uppercase tracking-[0.25em] text-cream/40">{g.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </motion.section>
        )}

        {/* RSVP */}
        <motion.section {...fade} className="py-20">
          <SectionLabel n="04" title="RSVP" />
          <RsvpForm slug={data.slug} variant="bare" />
        </motion.section>

        {/* Guestbook */}
        <motion.section {...fade} className="py-20">
          <SectionLabel n="05" title="Guestbook" />
          <WishForm slug={data.slug} wishes={data.wishes} variant="bare" />
        </motion.section>

        {/* Gift & contact */}
        <motion.section {...fade} className="py-20">
          <SectionLabel n="06" title="Gifts & Contact" />
          <GiftContact data={data} variant="bare" />
        </motion.section>
      </div>

      {/* Closing */}
      <motion.section {...fade} className="relative z-10 px-8 py-32 sm:px-16">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">With thanks</p>
        <p className="mt-6 max-w-xl font-serif text-3xl leading-snug">Thank you for celebrating with us.</p>
        <p className="mt-8 font-signature text-5xl text-gold">
          {data.groomName} &amp; {data.brideName}
        </p>
        <p className="mt-16 text-[0.65rem] uppercase tracking-[0.3em] text-cream/30">
          Made with InviteYou
        </p>
      </motion.section>
    </div>
  );
}
