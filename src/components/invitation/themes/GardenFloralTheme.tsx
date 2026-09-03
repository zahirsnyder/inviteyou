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

/** A hand-drawn-ish sprig of leaves. */
function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M60 112 C60 80 60 40 60 8" strokeLinecap="round" />
      {Array.from({ length: 6 }).map((_, i) => {
        const y = 20 + i * 14;
        return (
          <g key={i}>
            <path d={`M60 ${y} C46 ${y - 6} 34 ${y - 2} 28 ${y + 8} C40 ${y + 12} 52 ${y + 8} 60 ${y}`} />
            <path d={`M60 ${y} C74 ${y - 6} 86 ${y - 2} 92 ${y + 8} C80 ${y + 12} 68 ${y + 8} 60 ${y}`} />
          </g>
        );
      })}
    </svg>
  );
}

function Blob({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />;
}

/**
 * Garden Floral — soft and organic. Rounded "petal" shapes, oval photos,
 * botanical sprigs, blurred colour washes, sections offset left and right.
 */
export function GardenFloralTheme({ data }: { data: InvitationData }) {
  const preset = getPreset("garden-floral");
  const { opened, open, audioRef, musicPlaying, toggleMusic } = useInvitationShell(data.musicUrl);
  const { timeLeft, mounted } = useCountdown(data.weddingDateISO);

  return (
    <div
      style={presetCssVars(preset)}
      data-scheme={preset.scheme}
      className="relative overflow-hidden bg-night text-cream min-h-screen invitation-scroll"
    >
      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop preload="none" />}

      {/* Petals drifting down */}
      <ParticleField
        mode="fall"
        color={preset.accent}
        color2={preset.accentLight}
        count={55}
        size={0.13}
        opacity={0.5}
        speed={0.5}
      />

      <Blob className="left-[-8rem] top-[10%] h-80 w-80 bg-gold/20" />
      <Blob className="right-[-10rem] top-[45%] h-96 w-96 bg-gold-light/10" />
      <Blob className="left-[20%] bottom-[5%] h-72 w-72 bg-gold/15" />

      {/* Open gate — wreath */}
      {!opened && (
        <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-night px-6 text-center" exit={{ opacity: 0 }}>
          <div className="relative">
            <Sprig className="absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 -scale-x-100 text-gold/50" />
            <Sprig className="absolute -right-16 top-1/2 h-40 w-40 -translate-y-1/2 text-gold/50" />
            <p className="text-[0.6rem] uppercase tracking-[0.45em] text-gold">You&apos;re Invited</p>
            <h1 className="mt-5 font-serif text-4xl italic sm:text-5xl">
              {data.groomName} &amp; {data.brideName}
            </h1>
            <p className="mt-4 text-sm tracking-[0.2em] text-cream/60">
              {longDate.format(new Date(data.weddingDateISO))}
            </p>
            <button
              onClick={open}
              className="mt-9 rounded-full border border-gold/50 px-10 py-3.5 text-xs uppercase tracking-[0.25em] text-gold hover:bg-gold hover:text-[color:var(--inv-onaccent)] transition-colors"
            >
              Enter the Garden
            </button>
          </div>
        </motion.div>
      )}

      {opened && (
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          {data.musicUrl && (
            <button
              onClick={toggleMusic}
              aria-label={musicPlaying ? "Pause music" : "Play music"}
              className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border border-gold/40 bg-night/70 backdrop-blur-sm text-gold hover:bg-gold hover:text-[color:var(--inv-onaccent)] transition-all"
            >
              {musicPlaying ? "❚❚" : "♪"}
            </button>
          )}

          {/* Hero — oval portrait */}
          <section className="flex min-h-screen flex-col items-center justify-center py-24 text-center">
            {data.coverImageUrl && (
              <div className="mb-10 h-72 w-56 overflow-hidden rounded-[50%] border border-gold/30 sm:h-96 sm:w-72">
                <Image
                  src={data.coverImageUrl}
                  alt={`${data.groomName} & ${data.brideName}`}
                  width={400}
                  height={560}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <p className="text-[0.65rem] uppercase tracking-[0.45em] text-gold">Together with their families</p>
            <h1 className="mt-5 font-serif text-5xl leading-tight sm:text-7xl">
              {data.groomName}
              <span className="mx-3 font-signature text-4xl text-gold-light">&amp;</span>
              {data.brideName}
            </h1>
            <p className="mt-6 text-sm tracking-[0.25em] text-cream/70">
              {longDate.format(new Date(data.weddingDateISO))}
            </p>
          </section>

          {/* Quote on a petal */}
          {data.quote && (
            <Reveal className="my-20">
              <div className="mx-auto max-w-2xl rounded-[3rem] rounded-tl-lg border border-gold/20 bg-cream/[0.04] px-10 py-14 text-center">
                <p className="font-serif text-2xl italic leading-relaxed text-cream/85">“{data.quote}”</p>
              </div>
            </Reveal>
          )}

          {/* Story — offset card */}
          {data.story && (
            <Reveal className="my-20 sm:pr-24">
              <div className="relative rounded-[2.5rem] rounded-br-lg border border-gold/20 bg-cream/[0.03] p-10">
                <Sprig className="absolute -right-4 -top-8 h-16 w-16 text-gold/40" />
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-gold">Our Story</p>
                <p className="mt-5 whitespace-pre-line leading-loose text-cream/75">{data.story}</p>
              </div>
            </Reveal>
          )}

          {/* Countdown — circles */}
          <section className="py-16 text-center">
            <p className="mb-8 text-[0.65rem] uppercase tracking-[0.35em] text-gold">Blooming Soon</p>
            {mounted && timeLeft ? (
              <div className="flex justify-center gap-3 sm:gap-6">
                {COUNTDOWN_UNITS(timeLeft).map((u) => (
                  <div key={u.label} className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border border-gold/30 sm:h-24 sm:w-24">
                    <div>
                      <p className="font-serif text-2xl text-gold-light tabular-nums sm:text-3xl">
                        {String(u.value).padStart(2, "0")}
                      </p>
                      <p className="text-[0.5rem] uppercase tracking-[0.15em] text-cream/50">{u.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-serif text-2xl italic text-gold-light">In full bloom ✦</p>
            )}
          </section>

          {/* Events — alternating offset */}
          {data.events.length > 0 && (
            <section className="py-20">
              <p className="mb-12 text-center text-[0.65rem] uppercase tracking-[0.35em] text-gold">When &amp; Where</p>
              <div className="space-y-12">
                {data.events.map((e, i) => (
                  <Reveal key={e.id} delay={i * 0.1}>
                    <div className={`max-w-xl rounded-[2rem] border border-gold/20 bg-cream/[0.03] p-8 ${i % 2 ? "sm:ml-auto rounded-tr-lg" : "rounded-tl-lg"}`}>
                      <p className="text-[0.6rem] uppercase tracking-[0.25em] text-gold">
                        {longDate.format(new Date(e.eventDateISO))}
                      </p>
                      <h3 className="mt-2 font-serif text-3xl">{e.title}</h3>
                      {(e.startTime || e.endTime) && (
                        <p className="mt-2 text-gold-light">{e.startTime}{e.endTime && ` — ${e.endTime}`}</p>
                      )}
                      {e.description && <p className="mt-3 text-sm text-cream/60">{e.description}</p>}
                      <p className="mt-4 font-serif text-lg">{e.venueName}</p>
                      <p className="text-sm text-cream/50">{e.address}</p>
                      <MapButtons
                        mapUrl={e.mapUrl}
                        wazeUrl={e.wazeUrl}
                        wrapClass="mt-4 flex flex-wrap gap-2"
                        linkClass="inline-block rounded-full border border-gold/50 px-6 py-2.5 text-[0.6rem] uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-[color:var(--inv-onaccent)] transition-colors"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {/* Gallery — rounded, slight tilt */}
          {data.features.gallery && data.gallery.length > 0 && (
            <section className="py-20">
              <p className="mb-10 text-center text-[0.65rem] uppercase tracking-[0.35em] text-gold">Petals &amp; Moments</p>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                {data.gallery.map((g, i) => (
                  <motion.figure
                    key={g.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.7, delay: (i % 3) * 0.08 }}
                    className={`overflow-hidden rounded-[2rem] ${i % 2 ? "rotate-1" : "-rotate-1"}`}
                  >
                    <Image
                      src={g.imageUrl}
                      alt={g.caption ?? "Gallery photo"}
                      width={480}
                      height={600}
                      className="aspect-[4/5] w-full object-cover"
                    />
                  </motion.figure>
                ))}
              </div>
            </section>
          )}

          {/* RSVP */}
          <section className="py-20">
            <p className="mb-2 text-center text-[0.65rem] uppercase tracking-[0.35em] text-gold">Kindly Respond</p>
            <h3 className="mb-10 text-center font-serif text-4xl">RSVP</h3>
            <div className="mx-auto max-w-lg [&_form]:rounded-[2.5rem]">
              <RsvpForm slug={data.slug} variant="panel" />
            </div>
          </section>

          {/* Guestbook */}
          <section className="py-20">
            <p className="mb-2 text-center text-[0.65rem] uppercase tracking-[0.35em] text-gold">Words of Love</p>
            <h3 className="mb-10 text-center font-serif text-4xl">Guestbook</h3>
            <div className="mx-auto max-w-lg [&_form]:rounded-[2.5rem] [&_blockquote]:rounded-[1.75rem]">
              <WishForm slug={data.slug} wishes={data.wishes} variant="panel" />
            </div>
          </section>

          {/* Gift & contact */}
          <section className="py-20">
            <div className="mx-auto max-w-lg [&_form]:rounded-[2.5rem] [&>div>div]:rounded-[2rem]">
              <GiftContact data={data} variant="panel" />
            </div>
          </section>

          {/* Closing */}
          <section className="relative py-32 text-center">
            <Sprig className="mx-auto h-20 w-20 text-gold/40" />
            <p className="mt-6 text-[0.65rem] uppercase tracking-[0.35em] text-gold">With Gratitude</p>
            <p className="mx-auto mt-6 max-w-lg font-serif text-2xl italic leading-relaxed text-cream/80">
              Thank you for growing this garden of love with us.
            </p>
            <p className="mt-8 font-signature text-5xl text-gold-light">
              {data.groomName} &amp; {data.brideName}
            </p>
            <p className="mt-14 text-[0.6rem] uppercase tracking-[0.3em] text-cream/30">Made with InviteYou</p>
          </section>
        </div>
      )}
    </div>
  );
}
