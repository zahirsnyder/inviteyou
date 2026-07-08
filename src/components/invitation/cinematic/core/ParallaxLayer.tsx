"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCinematic } from "./CinematicProvider";

/**
 * A depth layer for free-flowing (non-pinned) sections. `depth` sets how far
 * the layer drifts against the scroll: positive = background (moves slower),
 * negative = foreground (moves faster). Layers at different depths create
 * the layered-photo parallax.
 */
export function ParallaxLayer({
  depth = 0.2,
  className = "",
  children,
}: {
  depth?: number;
  className?: string;
  children: ReactNode;
}) {
  const { reduced } = useCinematic();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [depth * 120, depth * -120]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={`will-change-transform ${className}`}>
      {children}
    </motion.div>
  );
}
