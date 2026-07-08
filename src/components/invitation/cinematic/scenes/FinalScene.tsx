"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { InvitationData } from "../../types";
import { PinnedScene } from "../core/PinnedScene";

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

function Countdown({ weddingDateISO }: { weddingDateISO: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const target = new Date(weddingDateISO);
    setTimeLeft(getTimeLeft(target));
    setMounted(true);
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [weddingDateISO]);

  if (!mounted) return <div className="h-16" />;
  if (!timeLeft) {
    return <p className="font-serif italic text-xl text-gold-light">The day has arrived ✦</p>;
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-6 sm:gap-10">
      {units.map((unit) => (
        <div key={unit.label} className="text-center">
          <p className="font-serif text-3xl sm:text-4xl text-gold-light tabular-nums">
            {String(unit.value).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[0.55rem] uppercase tracking-[0.25em] text-cream/40">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function SceneContent({
  progress,
  data,
}: {
  progress: MotionValue<number>;
  data: InvitationData;
}) {
  const bgOpacity = useTransform(progress, [0, 0.3], [0, 0.3]);
  const thanksOpacity = useTransform(progress, [0.05, 0.3], [0, 1]);
  const thanksY = useTransform(progress, [0.05, 0.3], [40, 0]);
  const namesOpacity = useTransform(progress, [0.25, 0.45], [0, 1]);
  const namesScale = useTransform(progress, [0.25, 0.5], [0.9, 1]);
  const countdownOpacity = useTransform(progress, [0.45, 0.6], [0, 1]);
  const seeYouOpacity = useTransform(progress, [0.6, 0.75], [0, 1]);
  const fadeOut = useTransform(progress, [0.86, 1], [0, 1]);

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-night">
      {data.coverImageUrl && (
        <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0">
          <Image src={data.coverImageUrl} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-night via-night/60 to-night" />
        </motion.div>
      )}

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <motion.p
          style={{ opacity: thanksOpacity, y: thanksY }}
          className="font-serif italic text-xl sm:text-2xl text-cream/85 leading-relaxed"
        >
          Thank you for being part of our journey. Your love, prayers, and presence mean
          everything to us.
        </motion.p>

        <motion.p
          style={{ opacity: namesOpacity, scale: namesScale }}
          className="mt-10 font-signature text-6xl sm:text-7xl text-gold-light will-change-transform"
        >
          {data.groomName} &amp; {data.brideName}
        </motion.p>

        <motion.div style={{ opacity: countdownOpacity }} className="mt-12">
          <Countdown weddingDateISO={data.weddingDateISO} />
        </motion.div>

        <motion.div style={{ opacity: seeYouOpacity }} className="mt-14">
          <p className="uppercase tracking-[0.45em] text-gold text-[0.65rem] sm:text-sm">
            See you there
          </p>
          <p className="mt-8 text-cream/30 text-[0.6rem] tracking-widest">
            Crafted with <span className="text-gold/60">InviteYou</span>
          </p>
        </motion.div>
      </div>

      {/* Soft fade to black at the very end of the journey */}
      <motion.div style={{ opacity: fadeOut }} className="absolute inset-0 bg-ink pointer-events-none" />
    </div>
  );
}

export function FinalScene({ data }: { data: InvitationData }) {
  return (
    <PinnedScene length={2.4}>
      {(progress) => <SceneContent progress={progress} data={data} />}
    </PinnedScene>
  );
}
