"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InvitationData } from "../types";
import { getPreset, presetCssVars } from "./presets";
import { useCountdown, COUNTDOWN_UNITS } from "../parts/useCountdown";
import { useInvitationShell } from "../parts/useInvitationShell";
import { BotanicalPetalScene } from "../three/BotanicalPetalScene";
import { RsvpForm } from "../parts/RsvpForm";
import { WishForm } from "../parts/WishForm";
import QRCode from "qrcode";

/* ------------------------------------------------------------------ *
 * Botanical Heirloom — a vintage Art-Nouveau wedding card. Gilded
 * whiplash corner scrollwork, hand-painted florals climbing the frame,
 * warm parchment, Playfair display type.
 * ------------------------------------------------------------------ */

const ASSET = "/templates/botanical-heirloom";
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

const waHref = (phone: string) => {
  const d = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${d.startsWith("0") ? `6${d}` : d}`;
};

/* One Art-Nouveau corner flourish (gilded whiplash + bud). */
function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="bh-gold" x1="0" y1="0" x2="120" y2="120">
          <stop offset="0" stopColor="#e6c77e" />
          <stop offset="0.5" stopColor="#b88630" />
          <stop offset="1" stopColor="#7d5a1e" />
        </linearGradient>
      </defs>
      <g stroke="url(#bh-gold)" strokeWidth="2.2" strokeLinecap="round">
        <path d="M8 112 C8 60 8 26 30 12 C44 4 66 4 96 8" />
        <path d="M14 106 C14 66 20 40 40 30 C56 22 74 24 92 30" opacity="0.7" />
        <path d="M40 30 C30 18 30 8 40 6 C42 16 40 24 40 30 Z" fill="url(#bh-gold)" stroke="none" opacity="0.85" />
        <path d="M92 30 C104 22 112 24 112 34 C102 36 96 34 92 30 Z" fill="url(#bh-gold)" stroke="none" opacity="0.85" />
        <path d="M8 60 C-2 50 -2 40 8 40 C10 50 10 54 8 60 Z" fill="url(#bh-gold)" stroke="none" opacity="0.8" />
        <circle cx="40" cy="6" r="2.6" fill="url(#bh-gold)" stroke="none" />
        <circle cx="112" cy="34" r="2.6" fill="url(#bh-gold)" stroke="none" />
      </g>
    </svg>
  );
}

/* Floral cluster overlays that "climb" a panel's frame. */
function Florals({ variant }: { variant: "cover" | "details" | "minimal" | "none" }) {
  if (variant === "none") return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible" aria-hidden>
      {variant !== "minimal" && (
        <img src={`${ASSET}/flower-pink.png`} alt="" className="absolute -left-9 -top-10 w-28 rotate-[-8deg] drop-shadow-[0_10px_20px_rgba(120,80,30,0.18)] sm:w-36" />
      )}
      <img src={`${ASSET}/leaf-green.png`} alt="" className="absolute -right-6 top-8 w-20 rotate-[18deg] opacity-90 sm:w-28" />
      <img src={`${ASSET}/flower-yellow.png`} alt="" className="absolute -bottom-10 -right-8 w-28 rotate-[10deg] drop-shadow-[0_10px_20px_rgba(120,80,30,0.18)] sm:w-40" />
      {variant === "cover" && (
        <>
          <img src={`${ASSET}/petal-pink.png`} alt="" className="absolute right-[12%] top-[40%] w-14 rotate-[-24deg] opacity-90 sm:w-20" />
          <img src={`${ASSET}/leaf-green.png`} alt="" className="absolute -bottom-6 left-6 w-16 -rotate-[26deg] opacity-80 sm:w-24" />
        </>
      )}
      {variant === "details" && (
        <img src={`${ASSET}/flower-pink.png`} alt="" className="absolute -right-8 top-1/3 w-24 rotate-[24deg] opacity-95 sm:w-32" />
      )}
    </div>
  );
}

/* The framed parchment card used for every section. */
function HeirloomPanel({
  children,
  florals = "minimal",
  className = "",
}: {
  children: ReactNode;
  florals?: "cover" | "details" | "minimal" | "none";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative ${className}`}
    >
      {/* parchment + faint paper grain */}
      <div className="relative overflow-hidden rounded-[3px] border border-[#b88630]/70 bg-[#fffdf6] shadow-[0_22px_60px_-24px_rgba(120,80,30,0.35)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 15%, rgba(184,134,48,0.06), transparent 45%), radial-gradient(circle at 85% 90%, rgba(184,134,48,0.07), transparent 40%)",
          }}
        />
        {/* inner rule */}
        <div className="pointer-events-none absolute inset-[9px] rounded-[2px] border border-[#b88630]/45" />
        <div className="pointer-events-none absolute inset-[13px] rounded-[2px] border border-[#b88630]/20" />

        {/* gilded corners */}
        <Flourish className="pointer-events-none absolute left-0 top-0 h-16 w-16 sm:h-20 sm:w-20" />
        <Flourish className="pointer-events-none absolute right-0 top-0 h-16 w-16 -scale-x-100 sm:h-20 sm:w-20" />
        <Flourish className="pointer-events-none absolute bottom-0 left-0 h-16 w-16 -scale-y-100 sm:h-20 sm:w-20" />
        <Flourish className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 -scale-100 sm:h-20 sm:w-20" />

        <div className="relative z-10 px-7 py-10 sm:px-12 sm:py-14">{children}</div>
      </div>
      <Florals variant={florals} />
    </motion.div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="font-serif text-[0.62rem] uppercase tracking-[0.5em] text-[#9a6b46] sm:text-[0.7rem]">
      {children}
    </p>
  );
}

function DateStrip({ iso, className = "" }: { iso: string; className?: string }) {
  const d = new Date(iso);
  return (
    <div className={`inline-flex items-stretch gap-4 sm:gap-6 ${className}`}>
      <span className="self-center font-serif text-xs uppercase tracking-[0.3em] text-[#7d5a1e] sm:text-sm">
        {DAYS[d.getDay()]}
      </span>
      <span className="w-px bg-[#b88630]/40" />
      <span className="text-center font-serif leading-none text-[#1e1b18]">
        <span className="block text-[0.6rem] uppercase tracking-[0.2em] text-[#9a6b46]">{MONTHS[d.getMonth()]}</span>
        <span className="text-2xl font-semibold sm:text-3xl">{d.getDate()}</span>
        <span className="block text-[0.6rem] tracking-[0.2em] text-[#9a6b46]">{d.getFullYear()}</span>
      </span>
      <span className="w-px bg-[#b88630]/40" />
      <span className="self-center font-serif text-xs uppercase tracking-[0.25em] text-[#7d5a1e] sm:text-sm">
        {timeFmt.format(d).toUpperCase()}
      </span>
    </div>
  );
}

const goldPill =
  "inline-flex items-center gap-3 rounded-full border border-[#b88630] bg-gradient-to-r from-[#c8973b] via-[#e6c77e] to-[#b88630] px-9 py-3.5 font-serif text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[#3c2c12] shadow-[0_10px_26px_-10px_rgba(184,134,48,0.7)] transition-transform hover:scale-[1.03] active:scale-[0.98]";

export function SunsetTerracottaTheme({ data }: { data: InvitationData }) {
  const preset = getPreset("sunset-terracotta");
  const { opened, open, audioRef, musicPlaying, toggleMusic } = useInvitationShell(data.musicUrl);
  const { timeLeft, mounted } = useCountdown(data.weddingDateISO);

  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [giftCopied, setGiftCopied] = useState(false);

  const initials = `${data.groomName[0] ?? ""}${data.brideName[0] ?? ""}`.toUpperCase();
  const venue = data.events[0];
  const addr = venue?.address ?? "";

  // Show whichever direction links the owner filled in. If neither, fall back to
  // a Google Maps address search so guests still get directions.
  const ownerMap = venue?.mapUrl?.trim() || null;
  const ownerWaze = venue?.wazeUrl?.trim() || null;
  const mapsUrl =
    ownerMap ?? (ownerWaze || !addr ? null : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`);
  const wazeUrl = ownerWaze;
  const qrTarget = mapsUrl ?? wazeUrl;
  const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Wedding of ${data.groomName} & ${data.brideName}`,
  )}&location=${encodeURIComponent(addr)}`;

  useEffect(() => {
    if (!qrTarget) return;
    let alive = true;
    QRCode.toDataURL(qrTarget, { margin: 1, width: 260, color: { dark: "#3c2c12", light: "#ffffff" } })
      .then((url) => alive && setQrCodeUrl(url))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [qrTarget]);

  return (
    <div
      style={presetCssVars(preset)}
      data-scheme={preset.scheme}
      className="relative min-h-screen overflow-x-hidden bg-[#f7efdd] text-[#1e1b18] invitation-scroll selection:bg-[#b88630]/25"
    >
      {/* warm parchment wash */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_0%,#fcf6e6,#f3e8cf_60%,#ecdcbb)]" />
      <BotanicalPetalScene flowerCount={5} petalCount={9} goldDustCount={38} />

      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop preload="none" />}

      {data.musicUrl && opened && (
        <button
          onClick={toggleMusic}
          aria-label={musicPlaying ? "Pause music" : "Play music"}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-[#b88630]/50 bg-[#fffdf6]/95 px-4 py-2 font-serif text-[0.6rem] uppercase tracking-[0.25em] text-[#7d5a1e] shadow-lg backdrop-blur hover:bg-[#faf3e2]"
        >
          <span className="text-sm">{musicPlaying ? "❚❚" : "♪"}</span>
          {musicPlaying ? "Music" : "Play Music"}
        </button>
      )}

      {/* ------------------- OPENING GATE ------------------- */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center px-4"
            exit={{ opacity: 0, transition: { duration: 0.7 } }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#fcf6e6,#ecdcbb)]" />
            <div className="relative z-10 w-full max-w-md">
              <HeirloomPanel florals="cover">
                <div className="text-center">
                  <div className="relative mx-auto mb-6 h-20 w-20">
                    <div className="absolute inset-0 rounded-full border border-[#b88630]/45 animate-spin" style={{ animationDuration: "26s" }} />
                    <div className="absolute inset-[0.5rem] flex items-center justify-center rounded-full bg-gradient-to-br from-[#e6c77e] via-[#b88630] to-[#7d5a1e] border-2 border-[#fff3d4] shadow-[0_8px_18px_rgba(184,134,48,0.4)]">
                      <span className="font-serif text-lg font-bold tracking-wide text-white whitespace-nowrap">
                        {initials[0]}
                        <span className="mx-0.5 font-normal text-[#fff3d4]">&amp;</span>
                        {initials[1]}
                      </span>
                    </div>
                  </div>
                  <Label>The Wedding</Label>
                  <h1 className="mt-4 font-serif text-[2.6rem] leading-none text-[#1e1b18] sm:text-5xl">
                    {data.groomName}
                    <span className="mx-3 align-middle text-lg italic text-[#a85d3b]">&amp;</span>
                    {data.brideName}
                  </h1>
                  <DateStrip iso={data.weddingDateISO} className="mt-6" />
                  {venue && (
                    <p className="mt-4 font-serif text-[0.62rem] uppercase tracking-[0.3em] text-[#7d5a1e]">
                      {venue.venueName}
                    </p>
                  )}
                  <button onClick={open} className={`mt-8 ${goldPill}`}>
                    Open Invitation <span>→</span>
                  </button>
                </div>
              </HeirloomPanel>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------- MAIN ------------------- */}
      {opened && (
        <main className="relative z-10 mx-auto max-w-2xl space-y-10 px-4 pb-40 pt-16 sm:px-6">
          {/* Hero */}
          <HeirloomPanel florals="cover">
            <div className="text-center">
              <p className="font-serif text-lg text-[#7d5a1e] sm:text-xl" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <div className="my-6 flex items-center justify-center gap-3">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#b88630]" />
                <Label>The Wedding</Label>
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#b88630]" />
              </div>
              <h2 className="font-serif text-[3rem] leading-[0.95] text-[#1e1b18] sm:text-[4.5rem]">
                {data.groomName}
                <span className="my-3 block font-serif text-lg italic text-[#a85d3b] sm:text-2xl">— and —</span>
                {data.brideName}
              </h2>
              <DateStrip iso={data.weddingDateISO} className="mt-8" />
            </div>
          </HeirloomPanel>

          {/* Invitation */}
          <HeirloomPanel florals="details">
            <Label>The Wedding</Label>
            {data.story ? (
              <p className="mt-5 whitespace-pre-line font-serif text-[0.95rem] leading-relaxed text-[#332d26]">
                {data.story}
              </p>
            ) : (
              <p className="mt-5 font-serif text-[0.95rem] leading-relaxed text-[#332d26]">
                With hearts full of joy, we warmly invite you and your family to celebrate
                our wedding with us.
              </p>
            )}
            {data.quote && (
              <>
                <div className="my-6 flex items-center gap-3 text-[#b88630]">
                  <span className="h-px flex-1 border-t border-dashed border-[#b88630]/60" />
                  <span>❧</span>
                  <span className="h-px flex-1 border-t border-dashed border-[#b88630]/60" />
                </div>
                <p className="font-serif text-sm italic leading-relaxed text-[#5a5247]">{data.quote}</p>
              </>
            )}

            {venue && (
              <div className="mt-8 grid gap-6 border-t border-[#b88630]/25 pt-6 sm:grid-cols-[auto_1fr]">
                <div className="font-serif text-[#1e1b18]">
                  <span className="text-[0.6rem] uppercase tracking-[0.3em] text-[#9a6b46]">
                    {DAYS[new Date(data.weddingDateISO).getDay()]}
                  </span>
                  <div className="mt-1 text-3xl font-semibold leading-tight sm:text-4xl">
                    {String(new Date(data.weddingDateISO).getDate()).padStart(2, "0")}
                    <br />
                    {String(new Date(data.weddingDateISO).getMonth() + 1).padStart(2, "0")}
                    <br />
                    {String(new Date(data.weddingDateISO).getFullYear()).slice(2)}
                  </div>
                </div>
                <div className="text-sm text-[#4a4239]">
                  <p className="font-serif text-base font-semibold text-[#1e1b18]">{venue.venueName}</p>
                  <p className="mt-1 leading-relaxed">{venue.address}</p>
                  {(venue.startTime || venue.endTime) && (
                    <>
                      <p className="mt-3 font-serif text-xs uppercase tracking-[0.25em] text-[#9a6b46]">Order of Events</p>
                      <p className="mt-0.5">
                        Reception: {venue.startTime}
                        {venue.endTime && ` – ${venue.endTime}`}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </HeirloomPanel>

          {/* COUNTDOWN */}
          <HeirloomPanel>
            <div className="text-center">
              <Label>Counting Down</Label>
              {mounted && timeLeft ? (
                <div className="mx-auto mt-7 grid max-w-sm grid-cols-4 gap-2 sm:gap-3">
                  {COUNTDOWN_UNITS(timeLeft).map((u) => (
                    <div key={u.label} className="rounded-[2px] border border-[#b88630]/35 bg-[#faf3e2] px-2 py-3">
                      <span className="block font-serif text-2xl font-semibold tabular-nums text-[#1e1b18] sm:text-3xl">
                        {String(u.value).padStart(2, "0")}
                      </span>
                      <span className="mt-1 block text-[0.55rem] uppercase tracking-[0.15em] text-[#9a6b46]">
                        {u.label}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 font-serif text-2xl italic text-[#7d5a1e]">The Big Day Is Here ❧</p>
              )}
            </div>
          </HeirloomPanel>

          {/* Order of events */}
          {data.features.events && data.events.length > 0 && (
            <HeirloomPanel>
              <div className="text-center">
                <Label>Order of Events</Label>
              </div>
              <div className="mt-7 divide-y divide-[#b88630]/20 border-y border-[#b88630]/25">
                {data.events.map((e) => (
                  <div key={e.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      {(e.startTime || e.endTime) && (
                        <span className="font-serif text-xs uppercase tracking-[0.2em] text-[#9a6b46]">
                          {e.startTime}
                          {e.endTime && ` – ${e.endTime}`}
                        </span>
                      )}
                      <h4 className="font-serif text-lg text-[#1e1b18]">{e.title}</h4>
                    </div>
                    <span className="text-xs text-[#7a6f63]">{e.venueName}</span>
                  </div>
                ))}
              </div>
            </HeirloomPanel>
          )}

          {/* Venue & QR */}
          {venue && (
            <HeirloomPanel>
              <div className="text-center">
                <Label>Venue</Label>
                <h3 className="mt-2 font-serif text-2xl text-[#1e1b18] sm:text-3xl">{venue.venueName}</h3>
                <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#5a5247] sm:text-sm">{venue.address}</p>
                {qrTarget && qrCodeUrl && (
                  <button
                    onClick={() => setMapModalOpen(true)}
                    className="mx-auto mt-6 block rounded-[2px] border-2 border-[#b88630]/50 bg-white p-3 shadow-md"
                  >
                    <img src={qrCodeUrl} alt="Venue QR code" className="h-40 w-40" />
                    <span className="mt-2 block font-serif text-[0.58rem] uppercase tracking-[0.25em] text-[#9a6b46]">
                      ✦ Scan for Directions
                    </span>
                  </button>
                )}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {mapsUrl && (
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={goldPill}>
                      Google Maps ↗
                    </a>
                  )}
                  {wazeUrl && (
                    <a href={wazeUrl} target="_blank" rel="noopener noreferrer" className={goldPill}>
                      Waze ↗
                    </a>
                  )}
                  <a
                    href={calUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#b88630]/60 bg-[#faf3e2] px-8 py-3.5 font-serif text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#7d5a1e] hover:bg-[#f3e8cf]"
                  >
                    Add to Calendar
                  </a>
                </div>
              </div>
            </HeirloomPanel>
          )}

          {/* CONTACTS */}
          {data.features.contact && data.contacts.length > 0 && (
            <HeirloomPanel>
              <div className="text-center">
                <Label>Contact Us</Label>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {data.contacts.map((c, i) => (
                  <div key={i} className="rounded-[2px] border border-[#b88630]/30 bg-[#faf3e2] p-4">
                    <p className="font-serif text-sm font-semibold text-[#1e1b18]">{c.name}</p>
                    <p className="text-xs text-[#6b6259]">{c.phone}</p>
                    <div className="mt-3 flex gap-2">
                      <a href={waHref(c.phone)} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-[2px] bg-[#4c6b3c] py-2 text-center text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-white hover:bg-[#3e5a30]">
                        WhatsApp
                      </a>
                      <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="flex-1 rounded-[2px] border border-[#b88630]/50 bg-white py-2 text-center text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-[#7d5a1e] hover:bg-[#faf3e2]">
                        Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </HeirloomPanel>
          )}

          {/* GIFT — QR or bank transfer */}
          {data.features.gift &&
            data.showGift &&
            (data.giftDetails || (data.showGiftQr && data.giftQrUrl)) && (
              <HeirloomPanel>
                <div className="text-center">
                  <Label>A Gift for the Couple</Label>
                  <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-[#6b6259] sm:text-sm">
                    Your presence is the greatest gift. If you would like to give more, scan the
                    QR code or transfer to the account below.
                  </p>
                  {data.showGiftQr && data.giftQrUrl && (
                    <div className="mx-auto mt-6 w-fit rounded-[2px] border-2 border-[#b88630]/40 bg-white p-3 shadow-md">
                      <img src={data.giftQrUrl} alt="Payment QR code" className="h-44 w-44" />
                    </div>
                  )}
                  {data.giftDetails && (
                    <div className="mx-auto mt-6 max-w-md rounded-[2px] border border-[#b88630]/30 bg-[#faf3e2] p-5">
                      <p className="whitespace-pre-line font-serif text-[#1e1b18]">{data.giftDetails}</p>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(data.giftDetails ?? "");
                            setGiftCopied(true);
                            setTimeout(() => setGiftCopied(false), 2000);
                          } catch {
                            /* clipboard blocked */
                          }
                        }}
                        className="mt-4 rounded-full border border-[#b88630] bg-white px-7 py-2.5 font-serif text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-[#7d5a1e] hover:bg-[#faf3e2]"
                      >
                        {giftCopied ? "Copied ✦" : "Copy Account Details"}
                      </button>
                    </div>
                  )}
                </div>
              </HeirloomPanel>
            )}

          {/* RSVP */}
          <HeirloomPanel>
            <div className="text-center">
              <Label>Kindly Respond</Label>
              <h3 className="mt-2 font-serif text-3xl text-[#1e1b18]">RSVP</h3>
            </div>
            <div className="mt-7 [&_button[type=submit]]:!bg-gradient-to-r [&_button[type=submit]]:!from-[#c8973b] [&_button[type=submit]]:!via-[#e6c77e] [&_button[type=submit]]:!to-[#b88630] [&_button[type=submit]]:!text-[#3c2c12] [&_form]:!border-[#b88630]/25 [&_form]:!bg-[#faf3e2] [&_input]:!bg-white [&_input]:!border-[#b88630]/40 [&_input]:!text-[#1e1b18] [&_label]:!text-[#7d5a1e] [&_textarea]:!bg-white [&_textarea]:!border-[#b88630]/40 [&_textarea]:!text-[#1e1b18]">
              <RsvpForm slug={data.slug} variant="panel" />
            </div>
          </HeirloomPanel>

          {/* GUESTBOOK */}
          <HeirloomPanel>
            <div className="text-center">
              <Label>Words of Love</Label>
              <h3 className="mt-2 font-serif text-3xl text-[#1e1b18]">Wishes for the Couple</h3>
            </div>
            <div className="mt-7 [&_blockquote]:!bg-[#faf3e2] [&_blockquote]:!text-[#332d26] [&_button[type=submit]]:!border-[#b88630] [&_button[type=submit]]:!text-[#7d5a1e] [&_form]:!border-[#b88630]/25 [&_form]:!bg-[#faf3e2] [&_input]:!bg-white [&_input]:!border-[#b88630]/40 [&_input]:!text-[#1e1b18] [&_label]:!text-[#7d5a1e] [&_textarea]:!bg-white [&_textarea]:!border-[#b88630]/40 [&_textarea]:!text-[#1e1b18]">
              <WishForm slug={data.slug} wishes={data.wishes} variant="panel" />
            </div>
          </HeirloomPanel>

          {/* CLOSING */}
          <div className="pt-8 text-center">
            <div className="mx-auto mb-4 h-px w-24 bg-gradient-to-r from-transparent via-[#b88630]/60 to-transparent" />
            <Label>With Gratitude</Label>
            <h4 className="mt-3 font-serif text-3xl text-[#1e1b18] sm:text-4xl">Thank You</h4>
            <p className="mt-2 font-serif text-lg italic text-[#5a5247]">
              {data.groomName} &amp; {data.brideName}
            </p>
            <p className="mt-6 font-serif text-[0.55rem] uppercase tracking-[0.3em] text-[#9a6b46]">
              Made with InviteYou
            </p>
          </div>
        </main>
      )}

      {/* MAP MODAL */}
      <AnimatePresence>
        {mapModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMapModalOpen(false)}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[3px] border-2 border-[#b88630]/50 bg-[#fffdf6] p-7 text-center shadow-2xl"
            >
              <h3 className="font-serif text-2xl text-[#1e1b18]">{venue?.venueName ?? "Venue"}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#5a5247]">{addr}</p>
              <div className="mt-5 space-y-3">
                {mapsUrl && (
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={`w-full justify-center ${goldPill}`}>
                    Google Maps ↗
                  </a>
                )}
                {wazeUrl && (
                  <a
                    href={wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center rounded-full border border-[#b88630]/50 bg-[#faf3e2] py-3 font-serif text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#7d5a1e]"
                  >
                    Waze ↗
                  </a>
                )}
              </div>
              <button
                onClick={() => setMapModalOpen(false)}
                className="mt-5 font-serif text-[0.6rem] uppercase tracking-[0.25em] text-[#9a6b46] hover:text-[#1e1b18]"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
