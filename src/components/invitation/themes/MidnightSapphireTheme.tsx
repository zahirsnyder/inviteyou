"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { InvitationData } from "../types";
import { Reveal } from "../shared";
import { getPreset, presetCssVars } from "./presets";
import { useCountdown, COUNTDOWN_UNITS } from "../parts/useCountdown";
import { useInvitationShell } from "../parts/useInvitationShell";
import { ParticleField } from "../three/ParticleField";
import { RsvpForm } from "../parts/RsvpForm";
import { WishForm } from "../parts/WishForm";
import { GiftContact } from "../parts/GiftContact";
import { MapButtons } from "../parts/MapButtons";

const longDate = new Intl.DateTimeFormat("en-MY", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

// Deterministic star field (same output on server and client — no hydration gap).
const STARS = (() => {
  let seed = 20261017;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: 70 }, () => ({
    top: rand() * 100,
    left: rand() * 100,
    size: 1 + rand() * 2,
    delay: rand() * 4,
    dur: 2.5 + rand() * 3,
  }));
})();

function StarField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-cream"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animation: `iy-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes iy-twinkle{0%,100%{opacity:.15}50%{opacity:.9}}`}</style>
    </div>
  );
}

function Diamond() {
  return <span aria-hidden className="mx-4 inline-block h-1.5 w-1.5 rotate-45 bg-gold align-middle" />;
}

/**
 * Midnight Sapphire — celestial and nocturnal. Star field, thin geometric
 * rules, a crescent motif, and a vertical timeline for the schedule.
 */
export function MidnightSapphireTheme({ data }: { data: InvitationData }) {
  const preset = getPreset("midnight-sapphire");
  const { opened, open, audioRef, musicPlaying, toggleMusic } = useInvitationShell(data.musicUrl);
  const { timeLeft, mounted } = useCountdown(data.weddingDateISO);
  const monogram = `${data.groomName[0] ?? ""}${data.brideName[0] ?? ""}`.toUpperCase();

  return (
    <div
      style={presetCssVars(preset)}
      data-scheme={preset.scheme}
      className="relative bg-night text-cream min-h-screen invitation-scroll"
    >
      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop preload="none" />}

      {/* 3D parallax star field with the occasional shooting star */}
      <ParticleField
        mode="stars"
        color="#e4e9f3"
        color2={preset.accent}
        count={90}
        size={0.06}
        opacity={0.9}
      />

      {/* Open gate */}
      {!opened && (
        <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-night px-6 text-center" exit={{ opacity: 0 }}>
          <StarField />
          <div className="relative">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-gold/40 font-serif text-2xl tracking-[0.15em] text-gold">
              {monogram}
            </div>
            <p className="mt-8 text-[0.6rem] uppercase tracking-[0.5em] text-gold">Under the Same Sky</p>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
              {data.groomName} &amp; {data.brideName}
            </h1>
            <p className="mt-4 text-sm tracking-[0.25em] text-cream/55">
              {longDate.format(new Date(data.weddingDateISO))}
            </p>
            <button
              onClick={open}
              className="mt-9 border border-gold/50 px-12 py-3.5 text-[0.65rem] uppercase tracking-[0.3em] text-gold hover:bg-gold hover:text-[color:var(--inv-onaccent)] transition-colors"
            >
              Enter
            </button>
          </div>
        </motion.div>
      )}

      {opened && (
        <>
          {data.musicUrl && (
            <button
              onClick={toggleMusic}
              aria-label={musicPlaying ? "Pause music" : "Play music"}
              className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border border-gold/40 bg-night/70 backdrop-blur-sm text-gold hover:bg-gold hover:text-[color:var(--inv-onaccent)] transition-all"
            >
              {musicPlaying ? "❚❚" : "♪"}
            </button>
          )}

          {/* Hero */}
          <section className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-6 text-center">
            {data.coverImageUrl && (
              <Image src={data.coverImageUrl} alt="" fill priority className="object-cover opacity-20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/30 to-night" />
            <div className="relative z-10">
              {/* crescent */}
              <svg viewBox="0 0 60 60" className="mx-auto mb-10 h-12 w-12 text-gold" aria-hidden>
                <path d="M42 6a24 24 0 1 0 0 48A20 20 0 0 1 42 6Z" fill="currentColor" opacity="0.85" />
              </svg>
              <p className="text-[0.65rem] uppercase tracking-[0.5em] text-gold">The Wedding Of</p>
              <h1 className="mt-6 font-serif text-6xl leading-tight sm:text-8xl">
                {data.groomName}
                <span className="my-3 block font-signature text-4xl text-gold-light sm:text-5xl">&amp;</span>
                {data.brideName}
              </h1>
              <p className="mt-8 flex items-center justify-center text-xs uppercase tracking-[0.3em] text-cream/60">
                <span className="h-px w-10 bg-gold/50" />
                <Diamond />
                {longDate.format(new Date(data.weddingDateISO))}
                <Diamond />
                <span className="h-px w-10 bg-gold/50" />
              </p>
            </div>
          </section>

          <div className="relative z-10 mx-auto max-w-3xl px-6">
            {/* Quote */}
            {data.quote && (
              <Reveal className="py-24 text-center">
                <p className="font-serif text-2xl italic leading-relaxed text-cream/85">
                  <span className="text-gold">⟨</span> {data.quote} <span className="text-gold">⟩</span>
                </p>
              </Reveal>
            )}

            {/* Story */}
            {data.story && (
              <Reveal className="border-l border-gold/30 py-16 pl-8">
                <p className="text-[0.65rem] uppercase tracking-[0.4em] text-gold">Our Constellation</p>
                <p className="mt-5 whitespace-pre-line leading-loose text-cream/75">{data.story}</p>
              </Reveal>
            )}

            {/* Countdown — orbit */}
            <section className="py-20 text-center">
              <p className="mb-10 text-[0.65rem] uppercase tracking-[0.4em] text-gold">Until We Orbit as One</p>
              {mounted && timeLeft ? (
                <div className="flex items-center justify-center">
                  {COUNTDOWN_UNITS(timeLeft).map((u, i) => (
                    <div key={u.label} className="flex items-center">
                      {i > 0 && <span className="h-px w-5 bg-gold/40 sm:w-8" />}
                      <div className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border border-gold/30 sm:h-24 sm:w-24">
                        <div>
                          <p className="font-serif text-2xl tabular-nums text-gold-light sm:text-3xl">
                            {String(u.value).padStart(2, "0")}
                          </p>
                          <p className="text-[0.5rem] uppercase tracking-[0.15em] text-cream/50">{u.label}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-serif text-2xl italic text-gold-light">Tonight is the night ✦</p>
              )}
            </section>

            {/* Events — vertical timeline */}
            {data.events.length > 0 && (
              <section className="py-20">
                <p className="mb-12 text-center text-[0.65rem] uppercase tracking-[0.4em] text-gold">The Evening</p>
                <div className="relative ml-3 border-l border-gold/25 pl-8">
                  {data.events.map((e, i) => (
                    <Reveal key={e.id} delay={i * 0.1} className="relative pb-14 last:pb-0">
                      <span className="absolute -left-[2.15rem] top-1.5 h-3 w-3 rotate-45 bg-gold" />
                      <p className="text-[0.6rem] uppercase tracking-[0.25em] text-gold">
                        {longDate.format(new Date(e.eventDateISO))}
                        {e.startTime && ` · ${e.startTime}`}
                        {e.endTime && ` – ${e.endTime}`}
                      </p>
                      <h3 className="mt-2 font-serif text-3xl">{e.title}</h3>
                      {e.description && <p className="mt-2 text-sm text-cream/60">{e.description}</p>}
                      <p className="mt-3 text-cream/85">{e.venueName}</p>
                      <p className="text-sm text-cream/50">{e.address}</p>
                      <MapButtons
                        mapUrl={e.mapUrl}
                        wazeUrl={e.wazeUrl}
                        wrapClass="mt-3 flex flex-wrap gap-4"
                        linkClass="inline-block text-xs uppercase tracking-[0.2em] text-gold hover:underline"
                      />
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery — thin-bordered grid */}
            {data.features.gallery && data.gallery.length > 0 && (
              <section className="py-20">
                <p className="mb-10 text-center text-[0.65rem] uppercase tracking-[0.4em] text-gold">Moments in the Dark</p>
                <div className="grid grid-cols-2 gap-px bg-gold/20 sm:grid-cols-3">
                  {data.gallery.map((g) => (
                    <figure key={g.id} className="bg-night">
                      <Image
                        src={g.imageUrl}
                        alt={g.caption ?? "Photo"}
                        width={480}
                        height={480}
                        className="aspect-square w-full object-cover brightness-90 transition hover:brightness-110"
                      />
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* RSVP */}
            <section className="py-20">
              <h3 className="mb-2 text-center text-[0.65rem] uppercase tracking-[0.4em] text-gold">Kindly Respond</h3>
              <p className="mb-10 text-center font-serif text-4xl">RSVP</p>
              <RsvpForm slug={data.slug} variant="bare" />
            </section>

            {/* Guestbook */}
            <section className="py-20">
              <h3 className="mb-2 text-center text-[0.65rem] uppercase tracking-[0.4em] text-gold">Wishes Upon a Star</h3>
              <p className="mb-10 text-center font-serif text-4xl">Guestbook</p>
              <WishForm slug={data.slug} wishes={data.wishes} variant="bare" />
            </section>

            {/* Gift & contact */}
            <section className="py-20">
              <GiftContact data={data} variant="bare" />
            </section>
          </div>

          {/* Closing */}
          <section className="relative z-10 overflow-hidden py-36 text-center">
            <div className="relative">
              <p className="text-[0.65rem] uppercase tracking-[0.5em] text-gold">Until Then</p>
              <p className="mx-auto mt-6 max-w-lg font-serif text-2xl italic leading-relaxed text-cream/80">
                Thank you for being a light on our journey.
              </p>
              <p className="mt-8 font-signature text-5xl text-gold-light">
                {data.groomName} &amp; {data.brideName}
              </p>
              <p className="mt-14 text-[0.6rem] uppercase tracking-[0.3em] text-cream/30">Made with InviteYou</p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
