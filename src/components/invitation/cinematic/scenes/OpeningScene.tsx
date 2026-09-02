"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { InvitationData } from "../../types";
import { PinnedScene } from "../core/PinnedScene";

const dateFmt = new Intl.DateTimeFormat("en-MY", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function SceneContent({
  progress,
  data,
}: {
  progress: MotionValue<number>;
  data: InvitationData;
}) {
  // Camera: background slowly settles from a zoomed, blurred dreamlike state
  // into a sharp establishing shot as the guest scrolls.
  const bgScale = useTransform(progress, [0, 1], [1.18, 1.02]);
  const blurOpacity = useTransform(progress, [0, 0.55], [1, 0]);
  const veil = useTransform(progress, [0, 0.6], [0.75, 0.45]);

  const eyebrowOpacity = useTransform(progress, [0.02, 0.18], [0, 1]);
  const eyebrowY = useTransform(progress, [0.02, 0.18], [24, 0]);
  const nameOpacity = useTransform(progress, [0.12, 0.38], [0, 1]);
  const nameY = useTransform(progress, [0.12, 0.38], [60, 0]);
  const nameScale = useTransform(progress, [0.12, 0.5], [0.92, 1]);
  const dateOpacity = useTransform(progress, [0.42, 0.62], [0, 1]);
  const lineScaleX = useTransform(progress, [0.5, 0.75], [0, 1]);
  const hintOpacity = useTransform(progress, [0, 0.1, 0.8, 1], [1, 1, 1, 0]);

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {!data.coverImageUrl && (
        <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(201,162,75,0.16),transparent_34%),radial-gradient(circle_at_15%_85%,rgba(160,127,47,0.09),transparent_28%),linear-gradient(145deg,#0c0a09,#1c1917_52%,#12100e)]">
          <div className="absolute inset-6 rounded-[2.5rem] border border-gold/15 sm:inset-10" />
          <div className="absolute left-1/2 top-[12%] h-28 w-px bg-gradient-to-b from-transparent via-gold/35 to-transparent" />
          <div className="absolute bottom-[10%] left-1/2 h-28 w-px bg-gradient-to-b from-transparent via-gold/35 to-transparent" />
          <span className="absolute left-[8%] top-[14%] font-serif text-8xl text-gold/[0.07]">❦</span>
          <span className="absolute bottom-[12%] right-[8%] rotate-180 font-serif text-8xl text-gold/[0.07]">❦</span>
        </div>
      )}
      {data.coverImageUrl && (
        <motion.div style={{ scale: bgScale }} className="absolute inset-0 will-change-transform">
          <Image
            src={data.coverImageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Pre-blurred duplicate fades away instead of animating filter (GPU-cheap) */}
          <motion.div style={{ opacity: blurOpacity }} className="absolute inset-0">
            <Image
              src={data.coverImageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover blur-xl scale-105"
            />
          </motion.div>
        </motion.div>
      )}
      <motion.div style={{ opacity: veil }} className="absolute inset-0 bg-night" />
      <div className="absolute inset-0 bg-gradient-to-b from-night/40 via-transparent to-night" />

      <div className="relative z-10 text-center px-6">
        <motion.p
          style={{ opacity: eyebrowOpacity, y: eyebrowY }}
          className="uppercase tracking-[0.45em] text-gold text-[0.6rem] sm:text-xs mb-8 sm:mb-10"
        >
          The Wedding Of
        </motion.p>

        <motion.h1
          style={{ opacity: nameOpacity, y: nameY, scale: nameScale }}
          className="font-serif text-[clamp(3rem,12vw,8rem)] leading-[1.05] text-cream will-change-transform"
        >
          {data.groomName}
          <span className="block font-signature text-[clamp(2rem,7vw,4.5rem)] text-gold-light my-2">
            &amp;
          </span>
          {data.brideName}
        </motion.h1>

        <motion.div style={{ opacity: dateOpacity }} className="mt-8 sm:mt-10">
          <p className="text-cream/75 tracking-[0.25em] uppercase text-[0.65rem] sm:text-sm">
            {dateFmt.format(new Date(data.weddingDateISO))}
          </p>
        </motion.div>

        <motion.div
          style={{ scaleX: lineScaleX }}
          className="mx-auto mt-8 h-px w-40 bg-gradient-to-r from-transparent via-gold/70 to-transparent"
        />
      </div>

      <motion.div
        style={{ opacity: hintOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-cream/40 mb-2">Scroll</p>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="block text-gold/70"
        >
          ↓
        </motion.span>
      </motion.div>
    </div>
  );
}

export function OpeningScene({ data }: { data: InvitationData }) {
  return (
    <PinnedScene length={2.2}>
      {(progress) => <SceneContent progress={progress} data={data} />}
    </PinnedScene>
  );
}
