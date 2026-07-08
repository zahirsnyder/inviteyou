"use client";

import { useEffect, useState } from "react";
import { Reveal, SectionHeading } from "../shared";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownSection({ weddingDateISO }: { weddingDateISO: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const target = new Date(weddingDateISO);
    setTimeLeft(getTimeLeft(target));
    setMounted(true);
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [weddingDateISO]);

  if (!mounted) return <section className="py-28" />;

  const units = timeLeft
    ? [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
      ]
    : null;

  return (
    <section className="py-28 px-6">
      <SectionHeading eyebrow="Save the date" title="Counting Down" />
      {units ? (
        <Reveal className="flex justify-center gap-4 sm:gap-8">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="w-20 sm:w-28 rounded-2xl border border-gold/20 bg-white/[0.04] backdrop-blur-sm py-6 text-center"
            >
              <p className="font-serif text-3xl sm:text-5xl text-gold-light tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </p>
              <p className="mt-2 text-[0.6rem] sm:text-xs uppercase tracking-[0.2em] text-cream/50">
                {unit.label}
              </p>
            </div>
          ))}
        </Reveal>
      ) : (
        <Reveal className="text-center">
          <p className="font-serif italic text-2xl text-gold-light">The day has arrived ✦</p>
        </Reveal>
      )}
    </section>
  );
}
