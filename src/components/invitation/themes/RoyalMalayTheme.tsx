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
import { GiftContact } from "../parts/GiftContact";
import { MapButtons } from "../parts/MapButtons";
import { WishForm } from "../parts/WishForm";

const longDate = new Intl.DateTimeFormat("en-MY", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Corner flourish used to frame sections. */
function Flourish({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`pointer-events-none select-none text-gold/40 ${className}`}>
      ❦
    </span>
  );
}

function Rule() {
  return (
    <div className="gold-divider max-w-[220px] mx-auto my-8">
      <span className="text-xs">✦</span>
    </div>
  );
}

/**
 * Royal Malay Classic — ornate, strictly symmetric, ceremonial. Everything is
 * centered inside a double gold frame; each section reads like an engraved
 * certificate.
 */
export function RoyalMalayTheme({ data }: { data: InvitationData }) {
  const preset = getPreset("royal-malay-classic");
  const { opened, open, audioRef, musicPlaying, toggleMusic } = useInvitationShell(data.musicUrl);
  const { timeLeft, mounted } = useCountdown(data.weddingDateISO);
  const monogram = `${data.groomName[0] ?? ""}${data.brideName[0] ?? ""}`.toUpperCase();

  return (
    <div
      style={presetCssVars(preset)}
      data-scheme={preset.scheme}
      className="bg-night text-cream min-h-screen invitation-scroll font-serif"
    >
      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop preload="none" />}

      {/* Slow-drifting gold dust */}
      <ParticleField
        mode="drift"
        color={preset.accentLight}
        color2={preset.accent}
        count={110}
        size={0.05}
        opacity={0.38}
        speed={0.6}
      />

      {/* Ornate open gate */}
      {!opened && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-night px-6"
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-5 border-2 border-gold/30 sm:inset-10" />
          <div className="absolute inset-8 border border-gold/15 sm:inset-14" />
          <div className="relative text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold/50 text-2xl tracking-[0.15em] text-gold">
              {monogram}
            </div>
            <p className="text-[0.6rem] uppercase tracking-[0.45em] text-gold">The Marriage Of</p>
            <h1 className="mt-6 text-4xl sm:text-5xl leading-tight">
              {data.groomName}
              <span className="mx-3 text-gold">&amp;</span>
              {data.brideName}
            </h1>
            <p className="mt-6 text-sm tracking-[0.25em] text-cream/60">
              {longDate.format(new Date(data.weddingDateISO))}
            </p>
            <button
              onClick={open}
              className="mt-10 rounded-none border border-gold/60 px-12 py-4 text-xs uppercase tracking-[0.3em] text-gold hover:bg-gold hover:text-[color:var(--inv-onaccent)] transition-colors"
            >
              Open Invitation
            </button>
          </div>
        </motion.div>
      )}

      {opened && (
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          {data.musicUrl && (
            <button
              onClick={toggleMusic}
              aria-label={musicPlaying ? "Pause music" : "Play music"}
              className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border border-gold/40 bg-night/80 backdrop-blur-sm text-gold hover:bg-gold hover:text-[color:var(--inv-onaccent)] transition-all"
            >
              {musicPlaying ? "❚❚" : "♪"}
            </button>
          )}

          {/* Fixed decorative frame around the whole scroll */}
          <div className="pointer-events-none fixed inset-3 z-40 border border-gold/20 sm:inset-6" />

          {/* Hero */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center py-24">
            <Flourish className="text-3xl" />
            <p className="mt-6 text-[0.65rem] uppercase tracking-[0.5em] text-gold">
              The Wedding
            </p>
            {data.coverImageUrl && (
              <div className="my-10 h-40 w-40 overflow-hidden rounded-full border-2 border-gold/40 p-1">
                <Image
                  src={data.coverImageUrl}
                  alt={`${data.groomName} & ${data.brideName}`}
                  width={200}
                  height={200}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            )}
            <h1 className="text-5xl sm:text-7xl leading-[1.15]">
              {data.groomName}
              <span className="block my-3 text-3xl text-gold">✦</span>
              {data.brideName}
            </h1>
            <Rule />
            <p className="text-sm tracking-[0.3em] uppercase text-cream/70">
              {longDate.format(new Date(data.weddingDateISO))}
            </p>
            {data.title && <p className="mt-6 italic text-cream/60">{data.title}</p>}
            <Flourish className="mt-10 inline-block rotate-180 text-3xl" />
          </section>

          {/* Quote + story */}
          {(data.quote || data.story) && (
            <section className="py-24 text-center">
              {data.quote && (
                <Reveal>
                  <p className="text-5xl text-gold/40 leading-none">“</p>
                  <p className="mx-auto max-w-xl text-2xl italic leading-relaxed text-cream/85 -mt-3">
                    {data.quote}
                  </p>
                </Reveal>
              )}
              {data.story && (
                <Reveal delay={0.1}>
                  <Rule />
                  <p className="text-[0.65rem] uppercase tracking-[0.4em] text-gold">Our Story</p>
                  <p className="mx-auto mt-6 max-w-xl leading-loose text-cream/70 whitespace-pre-line">
                    {data.story}
                  </p>
                </Reveal>
              )}
            </section>
          )}

          {/* Countdown */}
          <section className="py-20 text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-gold mb-8">Counting Down</p>
            {mounted && timeLeft ? (
              <div className="flex justify-center gap-3 sm:gap-6">
                {COUNTDOWN_UNITS(timeLeft).map((u) => (
                  <div key={u.label} className="w-[4.5rem] sm:w-24 border border-gold/30 py-5">
                    <p className="text-3xl sm:text-4xl tabular-nums text-gold-light">
                      {String(u.value).padStart(2, "0")}
                    </p>
                    <p className="mt-1 text-[0.55rem] uppercase tracking-[0.2em] text-cream/50">
                      {u.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="italic text-2xl text-gold-light">The day has arrived ✦</p>
            )}
          </section>

          {/* Events */}
          {data.events.length > 0 && (
            <section className="py-24">
              <p className="text-center text-[0.65rem] uppercase tracking-[0.4em] text-gold mb-12">
                Order of Events
              </p>
              <div className="space-y-14">
                {data.events.map((e, i) => (
                  <Reveal key={e.id} delay={i * 0.1}>
                    <div className="border-y border-gold/25 py-10 text-center">
                      <Flourish />
                      <p className="mt-4 text-[0.6rem] uppercase tracking-[0.3em] text-gold">
                        {longDate.format(new Date(e.eventDateISO))}
                      </p>
                      <h3 className="mt-3 text-3xl sm:text-4xl">{e.title}</h3>
                      {(e.startTime || e.endTime) && (
                        <p className="mt-3 text-lg text-gold-light">
                          {e.startTime}
                          {e.endTime && ` — ${e.endTime}`}
                        </p>
                      )}
                      {e.description && (
                        <p className="mx-auto mt-4 max-w-md text-sm text-cream/60">{e.description}</p>
                      )}
                      <Rule />
                      <p className="text-xl">{e.venueName}</p>
                      <p className="mt-1 text-sm text-cream/50">{e.address}</p>
                      <MapButtons
                        mapUrl={e.mapUrl}
                        wazeUrl={e.wazeUrl}
                        wrapClass="mt-6 flex flex-wrap items-center justify-center gap-3"
                        linkClass="inline-block border border-gold/50 px-8 py-3 text-[0.65rem] uppercase tracking-[0.25em] text-gold hover:bg-gold hover:text-[color:var(--inv-onaccent)] transition-colors"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {/* Gallery — uniform framed squares */}
          {data.features.gallery && data.gallery.length > 0 && (
            <section className="py-24">
              <p className="text-center text-[0.65rem] uppercase tracking-[0.4em] text-gold mb-10">
                Kenangan
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {data.gallery.map((g) => (
                  <figure key={g.id} className="border border-gold/30 p-1.5">
                    <Image
                      src={g.imageUrl}
                      alt={g.caption ?? "Gallery photo"}
                      width={480}
                      height={480}
                      className="aspect-square w-full object-cover"
                    />
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* RSVP */}
          <section className="py-24">
            <p className="text-center text-[0.65rem] uppercase tracking-[0.4em] text-gold mb-2">
              Kindly Respond
            </p>
            <h3 className="mb-10 text-center text-4xl">RSVP</h3>
            <div className="mx-auto max-w-lg">
              <RsvpForm slug={data.slug} variant="panel" />
            </div>
          </section>

          {/* Guestbook */}
          <section className="py-24">
            <p className="text-center text-[0.65rem] uppercase tracking-[0.4em] text-gold mb-2">
              Wishes for the Couple
            </p>
            <h3 className="mb-10 text-center text-4xl">Guestbook</h3>
            <div className="mx-auto max-w-lg">
              <WishForm slug={data.slug} wishes={data.wishes} variant="panel" />
            </div>
          </section>

          {/* Gift & contact */}
          <section className="py-24">
            <div className="mx-auto max-w-lg [&_p.uppercase]:text-center">
              <GiftContact data={data} variant="panel" />
            </div>
          </section>

          {/* Closing */}
          <section className="py-32 text-center">
            <Flourish className="text-3xl" />
            <p className="mt-6 text-[0.65rem] uppercase tracking-[0.4em] text-gold">Thank You</p>
            <p className="mx-auto mt-6 max-w-lg text-xl italic leading-relaxed text-cream/80">
              Thank you for your prayers and blessings.
            </p>
            <p className="mt-8 font-signature text-5xl text-gold-light">
              {data.groomName} &amp; {data.brideName}
            </p>
            <Rule />
            <p className="text-[0.6rem] tracking-[0.3em] text-cream/30">
              CRAFTED WITH <span className="text-gold/60">INVITEYOU</span>
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
