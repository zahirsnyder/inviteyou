"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { InvitationGalleryImage } from "../../types";
import { PinnedScene } from "../core/PinnedScene";
import { useCinematic } from "../core/CinematicProvider";

/**
 * The guest travels through the couple's photographs like moving through
 * layered objects in 3D space: each frame rises from the depth, sweeps past
 * the camera, and falls away as the next approaches.
 */
function FloatingFrame({
  progress,
  image,
  index,
  total,
}: {
  progress: MotionValue<number>;
  image: InvitationGalleryImage;
  index: number;
  total: number;
}) {
  // Each frame owns a sliding window of the scene's progress.
  const span = 1 / total;
  const start = index * span * 0.82;
  const mid = start + span * 0.75;
  const end = Math.min(start + span * 1.65, 1);

  const scale = useTransform(progress, [start, mid, end], [0.4, 1, 1.75]);
  const opacity = useTransform(progress, [start, mid, end], [0, 1, 0]);
  const y = useTransform(progress, [start, mid, end], ["16%", "0%", "-14%"]);
  const side = index % 2 === 0 ? -1 : 1;
  const x = useTransform(progress, [start, end], [`${side * 4}%`, `${side * 16}%`]);
  const rotate = useTransform(progress, [start, end], [side * 4, side * -3]);

  return (
    <motion.figure
      style={{ scale, opacity, y, x, rotate }}
      className="absolute inset-0 m-auto h-[52vh] w-[min(78vw,380px)] will-change-transform"
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-gold/20 bg-night-soft shadow-[0_50px_140px_-30px_rgba(0,0,0,0.95)]">
        <Image
          src={image.imageUrl}
          alt={image.caption ?? "Wedding photo"}
          fill
          sizes="(max-width: 640px) 78vw, 380px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent" />
        {image.caption && (
          <figcaption className="absolute bottom-0 inset-x-0 p-5 font-serif italic text-cream/85 text-sm">
            {image.caption}
          </figcaption>
        )}
      </div>
    </motion.figure>
  );
}

export function GalleryScene({ gallery }: { gallery: InvitationGalleryImage[] }) {
  const { reduced } = useCinematic();
  if (gallery.length === 0) return null;
  const images = gallery.slice(0, 8);

  // Reduced motion: a simple, fully visible grid.
  if (reduced) {
    return (
      <section className="py-32 px-6 bg-night">
        <h2 className="font-serif text-5xl text-cream text-center mb-16">Captured Moments</h2>
        <div className="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={image.imageUrl}
                alt={image.caption ?? "Wedding photo"}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <PinnedScene length={1.2 + images.length * 0.8} className="bg-night">
      {(progress) => (
        <div className="relative h-full w-full overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,75,0.08),transparent_65%)]" />

          <SceneTitle progress={progress} />

          {images.map((image, i) => (
            <FloatingFrame
              key={image.id}
              progress={progress}
              image={image}
              index={i}
              total={images.length}
            />
          ))}

          <GalleryProgress progress={progress} total={images.length} />
        </div>
      )}
    </PinnedScene>
  );
}

function SceneTitle({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.05, 0.12], [0, 1, 0]);
  const scale = useTransform(progress, [0, 0.12], [1, 1.3]);
  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
    >
      <p className="uppercase tracking-[0.4em] text-gold text-[0.6rem] sm:text-xs mb-5">
        Captured Moments
      </p>
      <h2 className="font-serif text-5xl sm:text-6xl text-cream">Our Gallery</h2>
    </motion.div>
  );
}

function GalleryProgress({
  progress,
  total,
}: {
  progress: MotionValue<number>;
  total: number;
}) {
  const scaleX = useTransform(progress, [0.08, 0.95], [0, 1]);
  const opacity = useTransform(progress, [0.05, 0.12, 0.9, 1], [0, 1, 1, 0]);
  return (
    <motion.div style={{ opacity }} className="absolute bottom-10 inset-x-0 flex justify-center">
      <div className="h-px w-48 bg-cream/15 overflow-hidden rounded-full" aria-hidden>
        <motion.div
          style={{ scaleX }}
          className="h-full w-full origin-left bg-gradient-to-r from-gold/50 to-gold"
        />
      </div>
      <span className="sr-only">{total} photos</span>
    </motion.div>
  );
}
