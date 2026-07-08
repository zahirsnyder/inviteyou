"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { InvitationData } from "../../types";
import { PinnedScene } from "../core/PinnedScene";

const dateFmt = new Intl.DateTimeFormat("en-MY", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * The camera dives from the hero into a floating invitation card. The
 * envelope flap folds open in 3D, then the card contents rise into place —
 * the wedding-story equivalent of zooming from the car body into the engine.
 */
function SceneContent({
  progress,
  data,
}: {
  progress: MotionValue<number>;
  data: InvitationData;
}) {
  // Phase A (0 → .35): camera approaches the sealed envelope.
  const cardScale = useTransform(progress, [0, 0.35], [0.55, 1]);
  const cardY = useTransform(progress, [0, 0.35], ["14%", "0%"]);
  const cardRotateX = useTransform(progress, [0, 0.35], [18, 0]);
  const inviteLabelOpacity = useTransform(progress, [0.05, 0.2, 0.32, 0.4], [0, 1, 1, 0]);

  // Phase B (.35 → .6): the flap folds open.
  const flapRotateX = useTransform(progress, [0.38, 0.6], [0, -178]);
  const flapZIndex = useTransform(progress, [0, 0.49, 0.5], [3, 3, 0]);
  const sealOpacity = useTransform(progress, [0.38, 0.48], [1, 0]);

  // Phase C (.6 → 1): the card contents reveal line by line.
  const line1 = useTransform(progress, [0.6, 0.72], [0, 1]);
  const line1Y = useTransform(progress, [0.6, 0.72], [24, 0]);
  const line2 = useTransform(progress, [0.68, 0.8], [0, 1]);
  const line2Y = useTransform(progress, [0.68, 0.8], [24, 0]);
  const line3 = useTransform(progress, [0.76, 0.9], [0, 1]);
  const line3Y = useTransform(progress, [0.76, 0.9], [24, 0]);

  const venue = data.events[0];

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-night">
      {/* Ambient candlelight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,75,0.12),transparent_60%)]" />

      <motion.p
        style={{ opacity: inviteLabelOpacity }}
        className="absolute top-[14%] uppercase tracking-[0.4em] text-gold text-[0.6rem] sm:text-xs"
      >
        You are invited
      </motion.p>

      <motion.div
        style={{ scale: cardScale, y: cardY, rotateX: cardRotateX, perspective: 1200 }}
        className="relative w-[min(88vw,420px)] will-change-transform"
      >
        <div className="relative" style={{ transformStyle: "preserve-3d", perspective: 1200 }}>
          {/* Envelope flap */}
          <motion.div
            style={{ rotateX: flapRotateX, zIndex: flapZIndex, transformOrigin: "top center" }}
            className="absolute inset-x-0 top-0 h-1/2 will-change-transform"
          >
            <div className="h-full w-full rounded-t-2xl bg-gradient-to-b from-[#221d17] to-[#191512] border border-gold/25 border-b-0 flex items-start justify-center pt-[12%] [backface-visibility:hidden]">
              <motion.div
                style={{ opacity: sealOpacity }}
                className="h-14 w-14 rounded-full border border-gold/60 bg-gold/15 flex items-center justify-center"
              >
                <span className="font-signature text-2xl text-gold-light">
                  {data.groomName.charAt(0)}
                  {data.brideName.charAt(0)}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* The card itself */}
          <div className="relative z-[1] rounded-2xl border border-gold/30 bg-gradient-to-b from-[#1d1915] to-[#141110] px-8 py-14 sm:px-12 sm:py-16 text-center shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]">
            <p className="uppercase tracking-[0.35em] text-gold text-[0.55rem] sm:text-[0.65rem] mb-8">
              Together with their families
            </p>

            <motion.div style={{ opacity: line1, y: line1Y }}>
              <p className="font-serif text-3xl sm:text-4xl text-cream leading-snug">
                {data.groomName}
                <span className="font-signature text-gold-light text-2xl sm:text-3xl mx-2">&amp;</span>
                {data.brideName}
              </p>
            </motion.div>

            <motion.div style={{ opacity: line2, y: line2Y }} className="mt-8">
              <div className="gold-divider max-w-[140px] mx-auto mb-6">
                <span className="text-xs">✦</span>
              </div>
              <p className="text-gold-light font-serif text-lg sm:text-xl">
                {dateFmt.format(new Date(data.weddingDateISO))}
              </p>
              {venue && (
                <p className="text-cream/60 text-xs sm:text-sm mt-2 tracking-wide">
                  {venue.venueName}
                </p>
              )}
            </motion.div>

            {data.quote && (
              <motion.p
                style={{ opacity: line3, y: line3Y }}
                className="mt-8 font-serif italic text-cream/70 text-sm sm:text-base leading-relaxed"
              >
                “{data.quote.length > 140 ? data.quote.slice(0, 140).trimEnd() + "…" : data.quote}”
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function InvitationRevealScene({ data }: { data: InvitationData }) {
  return (
    <PinnedScene length={3}>
      {(progress) => <SceneContent progress={progress} data={data} />}
    </PinnedScene>
  );
}
