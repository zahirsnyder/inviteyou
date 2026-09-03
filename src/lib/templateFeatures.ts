/**
 * Which invitation sections each template actually renders. The wizard uses this
 * to show only the relevant steps (e.g. a template with no photo section never
 * asks for a gallery), and the renderers use it to gate optional sections.
 *
 * Everything is on by default; list only what a template drops.
 */
export type TemplateFeatures = {
  story: boolean;
  events: boolean;
  gallery: boolean;
  cover: boolean; // hero / background photo
  countdown: boolean;
  rsvp: boolean;
  guestbook: boolean;
  gift: boolean;
  contact: boolean;
  music: boolean;
};

const ALL: TemplateFeatures = {
  story: true,
  events: true,
  gallery: true,
  cover: true,
  countdown: true,
  rsvp: true,
  guestbook: true,
  gift: true,
  contact: true,
  music: true,
};

const OVERRIDES: Record<string, Partial<TemplateFeatures>> = {
  // Botanical Heirloom is a formal ceremonial card — no photo gallery, and its
  // parchment layout has no hero/background photo.
  "sunset-terracotta": { gallery: false, cover: false },
};

export function getFeatures(slug: string): TemplateFeatures {
  return { ...ALL, ...(OVERRIDES[slug] ?? {}) };
}
