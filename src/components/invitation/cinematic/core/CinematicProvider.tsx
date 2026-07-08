"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";

type CinematicContextValue = {
  /** True when the user prefers reduced motion — scenes render fully revealed, no scroll choreography. */
  reduced: boolean;
};

const CinematicContext = createContext<CinematicContextValue>({ reduced: false });

export function useCinematic() {
  return useContext(CinematicContext);
}

/**
 * Wraps the cinematic invitation experience:
 * - Lenis smooth scrolling (skipped for reduced-motion users)
 * - MotionConfig so Framer Motion also honours the OS preference
 */
export function CinematicProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    // Programmatic navigation (and tests) must go through lenis.scrollTo,
    // otherwise Lenis re-applies its own position on the next frame.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let frame: number;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [reduced]);

  return (
    <CinematicContext.Provider value={{ reduced }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </CinematicContext.Provider>
  );
}
