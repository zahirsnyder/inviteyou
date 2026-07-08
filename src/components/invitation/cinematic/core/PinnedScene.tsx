"use client";

import { useRef, type ReactNode } from "react";
import {
  useScroll,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useCinematic } from "./CinematicProvider";

/**
 * The camera-pin building block. The section is `length` viewports tall while
 * its content stays pinned on screen; children receive scroll progress (0→1)
 * across the whole section and map it to transforms — this is what makes the
 * scroll feel like a camera traveling through layered objects.
 *
 * For reduced-motion users the scene collapses to a normal, fully-revealed
 * section (progress locked at 1).
 */
export function PinnedScene({
  length = 2.5,
  className = "",
  children,
}: {
  /** Scene height in viewport-heights; higher = slower, more deliberate travel. */
  length?: number;
  className?: string;
  children: (progress: MotionValue<number>) => ReactNode;
}) {
  const { reduced } = useCinematic();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const settled = useMotionValue(1);

  // Mirror the scroll progress into a detached MotionValue. This deliberately
  // breaks Framer Motion's link to the native ScrollTimeline: browsers compute
  // view-timeline progress incorrectly for sticky-pinned sections (the value
  // rises then falls), so scene transforms must stay JS-driven.
  const progress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.set(v);
    if (process.env.NODE_ENV !== "production") {
      ref.current?.setAttribute("data-progress", v.toFixed(3));
    }
  });

  if (reduced) {
    return (
      <section className={`relative min-h-screen ${className}`}>
        <div className="min-h-screen">{children(settled)}</div>
      </section>
    );
  }

  return (
    <section ref={ref} className={`relative ${className}`} style={{ height: `${length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">{children(progress)}</div>
    </section>
  );
}
