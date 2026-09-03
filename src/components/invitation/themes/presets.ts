import type { CSSProperties } from "react";

/**
 * A visual preset for the section-based invitation renderer. Each field maps to
 * a CSS custom property that the section components already consume through
 * Tailwind tokens (`bg-night`, `text-cream`, `text-gold`, `font-serif`, …), so
 * swapping these on a wrapper re-themes every section with no per-section code.
 */
export type InvitationPreset = {
  scheme: "light" | "dark";
  bg: string; // page background            -> --night
  bgSoft: string; // raised panels / gradient stops -> --night-soft
  fg: string; // primary text on bg         -> --cream
  fgMuted: string; // secondary text         -> --champagne
  accent: string; // accent / rule / eyebrow -> --gold
  accentLight: string; //                     -> --gold-light
  accentDark: string; //                      -> --gold-dark
  onAccent: string; // text sitting on an accent fill -> --inv-onaccent
  headingFont: string; // display face -> --inv-heading
};

// Values for --inv-heading (consumed by --font-serif). Bare font-family, no
// fallbacks — globals.css adds `Georgia, serif` after it.
const HEADING = {
  cormorant: "var(--font-cormorant)",
  playfair: "var(--font-playfair)",
  libre: "var(--font-libre)",
  ebGaramond: "var(--font-eb-garamond)",
  fraunces: "var(--font-fraunces)",
} as const;

export const INVITATION_PRESETS: Record<string, InvitationPreset> = {
  "royal-malay-classic": {
    scheme: "dark",
    bg: "#0c2a20",
    bgSoft: "#103428",
    fg: "#f4ede0",
    fgMuted: "#c9bfa8",
    accent: "#d8b25a",
    accentLight: "#eed7a1",
    accentDark: "#a9832f",
    onAccent: "#1a1a17",
    headingFont: HEADING.playfair,
  },
  "minimal-luxury-white": {
    scheme: "light",
    bg: "#f6f3ee",
    bgSoft: "#efe9df",
    fg: "#2b2622",
    fgMuted: "#6f665c",
    accent: "#b3946a",
    accentLight: "#d8c3a3",
    accentDark: "#8a6f4c",
    onAccent: "#221d18",
    headingFont: HEADING.libre,
  },
  "garden-floral": {
    scheme: "dark",
    bg: "#20241d",
    bgSoft: "#272c22",
    fg: "#f0ece0",
    fgMuted: "#c4c1b0",
    accent: "#cf90a4",
    accentLight: "#e8c6d1",
    accentDark: "#a06b80",
    onAccent: "#1e1a1c",
    headingFont: HEADING.ebGaramond,
  },
  "sunset-terracotta": {
    scheme: "light",
    bg: "#FAF6EE",
    bgSoft: "#F3ECE0",
    fg: "#1E1B18",
    fgMuted: "#6B6259",
    accent: "#B88630",
    accentLight: "#D4A853",
    accentDark: "#875E18",
    onAccent: "#FFFFFF",
    headingFont: HEADING.playfair,
  },
  "midnight-sapphire": {
    scheme: "dark",
    bg: "#0e1626",
    bgSoft: "#131f33",
    fg: "#e8ecf4",
    fgMuted: "#aab3c4",
    accent: "#b9c2d6",
    accentLight: "#dde3ee",
    accentDark: "#8b95a9",
    onAccent: "#12161f",
    headingFont: HEADING.cormorant,
  },
};

export const DEFAULT_PRESET_SLUG = "royal-malay-classic";

export function getPreset(slug: string): InvitationPreset {
  return INVITATION_PRESETS[slug] ?? INVITATION_PRESETS[DEFAULT_PRESET_SLUG];
}

/** CSS-var overrides to drop on the theme wrapper's `style`. */
export function presetCssVars(p: InvitationPreset): CSSProperties {
  return {
    "--night": p.bg,
    "--night-soft": p.bgSoft,
    "--cream": p.fg,
    "--champagne": p.fgMuted,
    "--gold": p.accent,
    "--gold-light": p.accentLight,
    "--gold-dark": p.accentDark,
    "--inv-onaccent": p.onAccent,
    "--inv-heading": p.headingFont,
  } as CSSProperties;
}
