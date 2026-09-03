"use client";

import { useEffect, useState } from "react";

export type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function compute(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/** Live wedding countdown. `mounted` is false on the server / first paint. */
export function useCountdown(weddingDateISO: string): {
  timeLeft: TimeLeft | null;
  mounted: boolean;
} {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Time can't be computed during render without a hydration mismatch, so the
    // first tick is set here and gated by `mounted`.
    const target = new Date(weddingDateISO);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(compute(target));
    setMounted(true);
    const id = setInterval(() => setTimeLeft(compute(target)), 1000);
    return () => clearInterval(id);
  }, [weddingDateISO]);

  return { timeLeft, mounted };
}

export const COUNTDOWN_UNITS = (t: TimeLeft) => [
  { label: "Days", value: t.days },
  { label: "Hours", value: t.hours },
  { label: "Minutes", value: t.minutes },
  { label: "Seconds", value: t.seconds },
];
