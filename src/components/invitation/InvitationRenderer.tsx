import type { InvitationData } from "./types";
import { CinematicJourneyTheme } from "./themes/CinematicJourneyTheme";
import { DarkGoldTheme } from "./themes/DarkGoldTheme";

/**
 * Picks the theme component for an invitation. The flagship
 * dark-cinematic-gold theme renders the scroll-storytelling journey;
 * other seeded themes fall back to the classic section renderer until
 * their own renderers are built.
 */
export function InvitationRenderer({ data }: { data: InvitationData }) {
  switch (data.themeSlug) {
    case "dark-cinematic-gold":
      return <CinematicJourneyTheme data={data} />;
    default:
      return <DarkGoldTheme data={data} />;
  }
}
